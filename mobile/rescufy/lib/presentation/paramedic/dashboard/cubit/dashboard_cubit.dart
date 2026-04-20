// lib/presentation/paramedic/dashboard/cubit/dashboard_cubit.dart
import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rescufy/core/services/signalr/signalr_service.dart';
import 'package:rescufy/domain/entities/incoming_request.dart';
import 'dashboard_state.dart';

class DashboardCubit extends Cubit<DashboardState> {
  DashboardCubit({required SignalRService signalRService})
    : _signalR = signalRService,
      super(DashboardState.initial());

  final SignalRService _signalR;
  StreamSubscription<SignalRConnectionState>? _connSub;
  StreamSubscription<Map<String, dynamic>>? _incomingRequestSub;
  StreamSubscription<String>? _requestCancelledSub;

  Future<void> initialize() async {
    _listenConnectionState();
    _listenIncomingRequests();
    _listenRequestCancelled();
    await _connect();
  }

  @override
  Future<void> close() async {
    await _connSub?.cancel();
    await _incomingRequestSub?.cancel();
    await _requestCancelledSub?.cancel();
    await super.close();
  }

  void toggleAvailability() => emit(state.copyWith(isOnline: !state.isOnline));

  void clearIncomingRequest() => emit(state.copyWith(clearRequest: true));

  // ── Private ───────────────────────────────────────────────────────────────

  Future<void> _connect() async {
    try {
      await _signalR.connect();
    } catch (e) {
      if (!isClosed) emit(state.copyWith(error: 'Connection failed: $e'));
    }
  }

  void _listenConnectionState() {
    _connSub = _signalR.stateStream.listen((s) {
      if (isClosed) return;
      emit(state.copyWith(signalRStatus: _mapState(s)));
    });
  }

  void _listenIncomingRequests() {
    _incomingRequestSub = _signalR.onIncomingRequest().listen((payload) {
      if (isClosed) return;
      try {
        final request = IncomingRequest.fromJson(payload);
        emit(state.copyWith(incomingRequest: request));
      } catch (e) {
        emit(state.copyWith(error: 'Failed to parse request: $e'));
      }
    });
  }

  void _listenRequestCancelled() {
    _requestCancelledSub = _signalR.onRequestCancelled().listen((_) {
      if (isClosed) return;
      emit(state.copyWith(clearRequest: true));
    });
  }

  DashboardSignalRStatus _mapState(SignalRConnectionState s) => switch (s) {
    SignalRConnectionState.connected => DashboardSignalRStatus.connected,
    SignalRConnectionState.connecting => DashboardSignalRStatus.connecting,
    SignalRConnectionState.reconnecting => DashboardSignalRStatus.reconnecting,
    SignalRConnectionState.disconnected => DashboardSignalRStatus.disconnected,
  };
}
