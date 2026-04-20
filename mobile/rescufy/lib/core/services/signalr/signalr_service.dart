import 'dart:async';
import 'package:signalr_netcore/signalr_client.dart';
import 'signalr_events.dart';

enum SignalRConnectionState {
  disconnected,
  connecting,
  connected,
  reconnecting,
}

/// Global singleton — registered as LazySingleton in GetIt.
/// One connection for the entire paramedic session.
class SignalRService {
  SignalRService({required String hubUrl, required String accessToken})
    : _hubUrl = hubUrl,
      _accessToken = accessToken;

  final String _hubUrl;
  final String _accessToken;
  HubConnection? _connection;

  final _stateController = StreamController<SignalRConnectionState>.broadcast();
  final _incomingRequestController =
      StreamController<Map<String, dynamic>>.broadcast();
  final _caseUpdatedController =
      StreamController<Map<String, dynamic>>.broadcast();
  final _requestCancelledController = StreamController<String>.broadcast();
  Stream<SignalRConnectionState> get stateStream => _stateController.stream;
  Stream<Map<String, dynamic>> onIncomingRequest() =>
      _incomingRequestController.stream;
  Stream<Map<String, dynamic>> onCaseUpdated() => _caseUpdatedController.stream;
  Stream<String> onRequestCancelled() => _requestCancelledController.stream;

  SignalRConnectionState _state = SignalRConnectionState.disconnected;
  SignalRConnectionState get state => _state;

  // ── Connection ───────────────────────────────────────────────────────────────

  Future<void> connect() async {
    if (_state == SignalRConnectionState.connected ||
        _state == SignalRConnectionState.connecting) {
      return;
    }

    _emit(SignalRConnectionState.connecting);

    _connection = HubConnectionBuilder()
        .withUrl(
          _hubUrl,
          options: HttpConnectionOptions(
            accessTokenFactory: () async => _accessToken,
            transport: HttpTransportType.WebSockets,
            skipNegotiation: true,
          ),
        )
        .withAutomaticReconnect(retryDelays: [2000, 5000, 10000, 30000])
        .build();

    _registerCoreEventHandlers();

    _connection!.onreconnecting(
      ({error}) => _emit(SignalRConnectionState.reconnecting),
    );
    _connection!.onreconnected(
      ({connectionId}) => _emit(SignalRConnectionState.connected),
    );
    _connection!.onclose(
      ({error}) => _emit(SignalRConnectionState.disconnected),
    );

    try {
      await _connection!.start();
      _emit(SignalRConnectionState.connected);
    } catch (e) {
      _emit(SignalRConnectionState.disconnected);
      rethrow;
    }
  }

  Future<void> disconnect() async {
    await _connection?.stop();
    _connection = null;
    _emit(SignalRConnectionState.disconnected);
  }

  // ── Event subscriptions ──────────────────────────────────────────────────────

  void on(String methodName, MethodInvocationFunc handler) =>
      _connection?.on(methodName, handler);

  void off(String methodName) => _connection?.off(methodName);

  // ── Invocations ──────────────────────────────────────────────────────────────

  Future<void> acceptRequest(String requestId) =>
      _invoke(SignalREvents.acceptRequest, args: [requestId]);

  Future<void> refuseRequest(String requestId, String reason) =>
      _invoke(SignalREvents.refuseRequest, args: [requestId, reason]);

  Future<void> joinCaseGroup(String requestId) =>
      _invoke(SignalREvents.joinCaseGroup, args: [requestId]);

  /// Only paramedic location is sent — never the patient's.
  Future<void> sendLocation(String requestId, double lat, double lng) =>
      _invoke(SignalREvents.sendLocation, args: [requestId, lat, lng]);

  Future<void> updateStatus(String requestId, String status) =>
      _invoke(SignalREvents.updateStatus, args: [requestId, status]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  Future<void> _invoke(String method, {List<Object>? args}) async {
    if (_connection == null ||
        _connection!.state != HubConnectionState.Connected) {
      throw StateError('SignalR: Cannot invoke "$method" — not connected.');
    }
    await _connection!.invoke(method, args: args);
  }

  void _registerCoreEventHandlers() {
    _connection?.on(SignalREvents.receiveEmergencyRequest, (args) {
      if (args == null || args.isEmpty) return;
      final payload = args.first;
      if (payload is Map<String, dynamic>) {
        _incomingRequestController.add(payload);
      } else if (payload is Map) {
        _incomingRequestController.add(Map<String, dynamic>.from(payload));
      }
    });

    _connection?.on(SignalREvents.caseUpdated, (args) {
      if (args == null || args.isEmpty) return;
      final payload = args.first;
      if (payload is Map<String, dynamic>) {
        _caseUpdatedController.add(payload);
      } else if (payload is Map) {
        _caseUpdatedController.add(Map<String, dynamic>.from(payload));
      }
    });

    _connection?.on(SignalREvents.requestCancelled, (args) {
      if (args == null || args.isEmpty) return;
      final payload = args.first;
      if (payload is String) {
        _requestCancelledController.add(payload);
      }
    });
  }

  void _emit(SignalRConnectionState s) {
    _state = s;
    if (!_stateController.isClosed) _stateController.add(s);
  }

  void dispose() {
    _stateController.close();
    _incomingRequestController.close();
    _caseUpdatedController.close();
    _requestCancelledController.close();
    _connection?.stop();
  }
}
