import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rescufy/core/services/location_service.dart';
import 'package:rescufy/core/services/signalr/signalr_events.dart';
import 'package:rescufy/core/services/signalr/signalr_service.dart';
import 'package:rescufy/domain/entities/case_status.dart';
import 'package:rescufy/domain/entities/incoming_request.dart';
import 'active_case_state.dart';

class ActiveCaseCubit extends Cubit<ActiveCaseState> {
  ActiveCaseCubit({
    required IncomingRequest request,
    required SignalRService signalRService,
    required LocationService locationService,
  }) : _signalR = signalRService,
       _locationService = locationService,
       super(ActiveCaseState.initial(request));

  final SignalRService _signalR;
  final LocationService _locationService;
  Timer? _locationTimer;
  StreamSubscription<Map<String, dynamic>>? _caseUpdateSubscription;

  static const _intervalSeconds = 3;

  Future<void> initialize() async {
    _listenToCaseUpdates();
    await _joinCaseGroup();
    if (!isClosed && state.loadStatus == ActiveCaseLoadStatus.ready) {
      _startLocationTracking();
    }
  }

  @override
  Future<void> close() async {
    _locationTimer?.cancel();
    await _caseUpdateSubscription?.cancel();
    await super.close();
  }

  Future<void> updateStatus(CaseStatus newStatus) async {
    emit(state.copyWith(isUpdatingStatus: true, clearError: true));
    try {
      await _signalR.updateStatus(
        state.request.requestId,
        newStatus.serverValue,
      );
    } catch (e) {
      emit(
        state.copyWith(
          isUpdatingStatus: false,
          errorMessage: 'Status update failed: $e',
        ),
      );
    }
  }

  Future<void> _joinCaseGroup() async {
    try {
      await _signalR.joinCaseGroup(state.request.requestId);
      emit(
        state.copyWith(
          loadStatus: ActiveCaseLoadStatus.ready,
          liveStatusMessage: 'Connected to the live case channel.',
          lastUpdatedAt: DateTime.now(),
        ),
      );
    } catch (e) {
      emit(
        state.copyWith(
          loadStatus: ActiveCaseLoadStatus.error,
          errorMessage: 'Failed to join case group: $e',
        ),
      );
    }
  }

  void _listenToCaseUpdates() {
    _caseUpdateSubscription ??= _signalR.onCaseUpdated().listen((payload) {
      if (isClosed ||
          payload[SignalRPayloadKeys.requestId] != state.request.requestId) {
        return;
      }

      final statusValue =
          (payload[SignalRPayloadKeys.status] as String?) ?? 'Pending';
      final updatedAtValue = payload[SignalRPayloadKeys.updatedAt] as String?;

      emit(
        state.copyWith(
          caseStatus: statusValue.toCaseStatus(),
          isUpdatingStatus: false,
          liveStatusMessage:
              payload[SignalRPayloadKeys.message] as String? ??
              state.liveStatusMessage,
          lastUpdatedAt: updatedAtValue != null
              ? DateTime.tryParse(updatedAtValue) ?? DateTime.now()
              : DateTime.now(),
        ),
      );
    });
  }

  void _startLocationTracking() {
    emit(state.copyWith(isTrackingLocation: true));
    _broadcastLocation(); // immediate first tick
    _locationTimer = Timer.periodic(
      const Duration(seconds: _intervalSeconds),
      (_) => _broadcastLocation(),
    );
  }

  Future<void> _broadcastLocation() async {
    final position = await _locationService.getCurrentPosition();
    if (position == null || isClosed) return;

    try {
      // Only the paramedic's location — never the patient's.
      await _signalR.sendLocation(
        state.request.requestId,
        position.latitude,
        position.longitude,
      );
    } catch (_) {
      return;
    }

    if (!isClosed) {
      emit(
        state.copyWith(
          paramedicLat: position.latitude,
          paramedicLng: position.longitude,
        ),
      );
    }
  }
}
