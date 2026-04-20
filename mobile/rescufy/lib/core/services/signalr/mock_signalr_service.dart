// lib/core/services/signalr/mock_signalr_service.dart
//
// Drop-in replacement for SignalRService while the real hub URL is pending.
// Exposes the exact same public API — DashboardCubit, IncomingRequestCubit,
// and ActiveCaseCubit call it without any modification.
//
// HOW TO REMOVE THIS MOCK:
//   1. Add the real hub URL to ApiEndpoints.signalRHubUrl
//   2. Uncomment the SignalRService registration in injection_container.dart
//   3. Delete this file

import 'dart:async';
import 'dart:math';

import 'package:rescufy/core/services/signalr/signalr_events.dart';
import 'package:rescufy/core/services/signalr/signalr_service.dart';

class MockSignalRService extends SignalRService {
  MockSignalRService()
    : super(hubUrl: 'mock://localhost', accessToken: 'mock-token');

  final _stateCtrl = StreamController<SignalRConnectionState>.broadcast();
  final _incomingRequestCtrl =
      StreamController<Map<String, dynamic>>.broadcast();
  final _caseUpdatedCtrl = StreamController<Map<String, dynamic>>.broadcast();
  final _requestCancelledCtrl = StreamController<String>.broadcast();

  @override
  Stream<SignalRConnectionState> get stateStream => _stateCtrl.stream;

  @override
  Stream<Map<String, dynamic>> onIncomingRequest() =>
      _incomingRequestCtrl.stream;

  @override
  Stream<Map<String, dynamic>> onCaseUpdated() => _caseUpdatedCtrl.stream;

  @override
  Stream<String> onRequestCancelled() => _requestCancelledCtrl.stream;

  SignalRConnectionState _mockState = SignalRConnectionState.disconnected;

  @override
  SignalRConnectionState get state => _mockState;
  Timer? _incomingRequestTimer;
  Timer? _caseUpdateTimer;
  Map<String, dynamic>? _pendingRequest;
  Map<String, dynamic>? _activeRequest;
  int _requestCounter = 0;
  int _liveUpdateIndex = 0;
  final _random = Random();

  static const Duration _incomingRequestInterval = Duration(seconds: 18);
  static const Duration _caseUpdateInterval = Duration(seconds: 6);

  static const List<String> _patientNames = [
    'Omar Hassan',
    'Mona Adel',
    'Youssef Tarek',
    'Mariam Nabil',
    'Salma Hany',
  ];

  static const List<String> _locations = [
    'Nasr City, Cairo',
    'Heliopolis, Cairo',
    'Zamalek, Cairo',
    'Smouha, Alexandria',
    'Sheikh Zayed, Giza',
  ];

  static const List<String> _emergencyTypes = [
    'Cardiac Arrest',
    'Severe Trauma',
    'Stroke Symptoms',
    'Respiratory Distress',
    'Road Accident',
  ];

  static const List<String> _severityLevels = ['Critical', 'High', 'Medium'];

  static const List<String> _liveMessages = [
    'Dispatch confirmed. Routing details synchronized with the dashboard.',
    'Traffic conditions updated. Estimated arrival remains within target range.',
    'Receiving center has been notified and is preparing the trauma bay.',
    'Patient vitals history uploaded to the case timeline.',
  ];

  // ── Connection ────────────────────────────────────────────────────────────

  @override
  Future<void> connect() async {
    if (_mockState == SignalRConnectionState.connected ||
        _mockState == SignalRConnectionState.connecting) {
      return;
    }
    _emit(SignalRConnectionState.connecting);
    await Future.delayed(const Duration(milliseconds: 800));
    _emit(SignalRConnectionState.connected);
    _scheduleIncomingRequests();
  }

  @override
  Future<void> disconnect() async {
    _incomingRequestTimer?.cancel();
    _caseUpdateTimer?.cancel();
    _emit(SignalRConnectionState.disconnected);
  }

  // ── Invocations ───────────────────────────────────────────────────────────

  @override
  Future<void> acceptRequest(String requestId) async {
    final request = _pendingRequest;
    if (request == null || request[SignalRPayloadKeys.requestId] != requestId) {
      return;
    }

    _activeRequest = request;
    _pendingRequest = null;
    _liveUpdateIndex = 0;

    _emitCaseUpdate(
      requestId: requestId,
      status: 'OnTheWay',
      message: 'Request accepted. Proceed to the patient location.',
    );

    _startCaseUpdates();
    _scheduleIncomingRequests();
  }

  @override
  Future<void> refuseRequest(String requestId, String reason) async {
    if (_pendingRequest == null) return;
    _pendingRequest = null;
    if (!_requestCancelledCtrl.isClosed) {
      _requestCancelledCtrl.add(requestId);
    }
    _scheduleIncomingRequests(delay: const Duration(seconds: 8));
  }

  @override
  Future<void> joinCaseGroup(String requestId) async {}

  @override
  Future<void> sendLocation(String requestId, double lat, double lng) async {}

  @override
  Future<void> updateStatus(String requestId, String status) async {
    final request = _activeRequest;
    if (request == null || request[SignalRPayloadKeys.requestId] != requestId) {
      return;
    }

    final message = switch (status) {
      'OnTheWay' => 'Unit is now en route to the patient.',
      'Arrived' => 'Paramedic has arrived on site.',
      'TreatmentStarted' =>
        'Treatment has started. Monitoring patient response.',
      'Completed' => 'Case completed successfully and ready for handoff.',
      _ => 'Case updated.',
    };

    _emitCaseUpdate(requestId: requestId, status: status, message: message);

    if (status == 'Completed') {
      _caseUpdateTimer?.cancel();
      _activeRequest = null;
      _scheduleIncomingRequests(delay: const Duration(seconds: 12));
    }
  }

  // ── Test helpers (call from DI or a debug screen) ─────────────────────────

  /// Simulates the server pushing a new emergency request.
  void simulateIncomingRequest(Map<String, dynamic> requestJson) {
    _pendingRequest = Map<String, dynamic>.from(requestJson);
    if (!_incomingRequestCtrl.isClosed) {
      _incomingRequestCtrl.add(_pendingRequest!);
    }
  }

  /// Simulates the server cancelling an active request.
  void simulateRequestCancelled([String? requestId]) {
    final id =
        requestId ??
        _pendingRequest?[SignalRPayloadKeys.requestId] as String? ??
        _activeRequest?[SignalRPayloadKeys.requestId] as String?;
    if (id == null) return;
    _pendingRequest = null;
    if (!_requestCancelledCtrl.isClosed) {
      _requestCancelledCtrl.add(id);
    }
  }

  /// Simulates a connection state change (e.g. reconnecting → connected).
  void simulateConnectionState(SignalRConnectionState newState) =>
      _emit(newState);

  void _scheduleIncomingRequests({Duration? delay}) {
    _incomingRequestTimer?.cancel();
    if (_mockState != SignalRConnectionState.connected ||
        _pendingRequest != null ||
        _activeRequest != null) {
      return;
    }

    final initialDelay = delay ?? const Duration(seconds: 4);
    _incomingRequestTimer = Timer(initialDelay, () {
      if (_mockState != SignalRConnectionState.connected ||
          _pendingRequest != null ||
          _activeRequest != null) {
        return;
      }

      final request = _buildMockRequest();
      _pendingRequest = request;
      if (!_incomingRequestCtrl.isClosed) {
        _incomingRequestCtrl.add(request);
      }

      _incomingRequestTimer = Timer(_incomingRequestInterval, () {
        _scheduleIncomingRequests();
      });
    });
  }

  void _startCaseUpdates() {
    _caseUpdateTimer?.cancel();
    _caseUpdateTimer = Timer.periodic(_caseUpdateInterval, (_) {
      final request = _activeRequest;
      if (request == null) return;
      final message = _liveMessages[_liveUpdateIndex % _liveMessages.length];
      _liveUpdateIndex += 1;
      _emitCaseUpdate(
        requestId: request[SignalRPayloadKeys.requestId] as String,
        status: 'OnTheWay',
        message: message,
      );
    });
  }

  Map<String, dynamic> _buildMockRequest() {
    final index = _requestCounter++;
    final latitude = 29.95 + _random.nextDouble() * 0.15;
    final longitude = 31.18 + _random.nextDouble() * 0.22;

    return {
      SignalRPayloadKeys.requestId: 'REQ-${1000 + index}',
      SignalRPayloadKeys.caseId: 'CASE-${2000 + index}',
      SignalRPayloadKeys.patientName:
          _patientNames[index % _patientNames.length],
      SignalRPayloadKeys.patientAge: 22 + _random.nextInt(43),
      SignalRPayloadKeys.patientGender: index.isEven ? 'Male' : 'Female',
      SignalRPayloadKeys.emergencyType:
          _emergencyTypes[index % _emergencyTypes.length],
      SignalRPayloadKeys.severity:
          _severityLevels[index % _severityLevels.length],
      SignalRPayloadKeys.description:
          'Emergency reported by bystander. Patient requires immediate paramedic support.',
      SignalRPayloadKeys.latitude: latitude,
      SignalRPayloadKeys.longitude: longitude,
      SignalRPayloadKeys.address: _locations[index % _locations.length],
      SignalRPayloadKeys.hospitalName: 'Rescufy General Hospital',
      SignalRPayloadKeys.createdAt: DateTime.now().toIso8601String(),
      SignalRPayloadKeys.aiSummary:
          'Possible acute emergency case. Prioritize airway, circulation, and transport readiness.',
      SignalRPayloadKeys.allergies: index.isEven ? ['Penicillin'] : <String>[],
      SignalRPayloadKeys.chronicDiseases: index.isOdd
          ? ['Hypertension']
          : <String>[],
      SignalRPayloadKeys.currentMedications: index.isOdd
          ? ['Aspirin']
          : <String>[],
      SignalRPayloadKeys.bloodType: index.isEven ? 'O+' : 'A+',
    };
  }

  void _emitCaseUpdate({
    required String requestId,
    required String status,
    required String message,
  }) {
    final request = _activeRequest;
    if (request == null) return;

    final payload = <String, dynamic>{
      SignalRPayloadKeys.requestId: requestId,
      SignalRPayloadKeys.caseId: request[SignalRPayloadKeys.caseId],
      SignalRPayloadKeys.status: status,
      SignalRPayloadKeys.message: message,
      SignalRPayloadKeys.updatedAt: DateTime.now().toIso8601String(),
    };

    if (!_caseUpdatedCtrl.isClosed) {
      _caseUpdatedCtrl.add(payload);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  void _emit(SignalRConnectionState s) {
    _mockState = s;
    if (!_stateCtrl.isClosed) _stateCtrl.add(s);
  }

  @override
  void dispose() {
    _stateCtrl.close();
    _incomingRequestCtrl.close();
    _caseUpdatedCtrl.close();
    _requestCancelledCtrl.close();
    _incomingRequestTimer?.cancel();
    _caseUpdateTimer?.cancel();
  }
}
