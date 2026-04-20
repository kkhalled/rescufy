import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rescufy/core/services/signalr/signalr_service.dart';
import 'package:rescufy/domain/entities/incoming_request.dart';
import 'incoming_request_state.dart';

class IncomingRequestCubit extends Cubit<IncomingRequestState> {
  IncomingRequestCubit({
    required IncomingRequest request,
    required SignalRService signalRService,
  }) : _signalR = signalRService,
       super(IncomingRequestState.initial(request));

  final SignalRService _signalR;
  StreamSubscription<String>? _cancelledSubscription;

  void initialize() {
    _cancelledSubscription ??= _signalR.onRequestCancelled().listen((
      requestId,
    ) {
      if (isClosed || requestId != state.request.requestId) return;
      emit(
        state.copyWith(
          status: IncomingRequestStatus.cancelled,
          errorMessage: 'This emergency request was cancelled.',
        ),
      );
    });
  }

  Future<void> acceptRequest() async {
    if (state.status == IncomingRequestStatus.accepting) return;
    emit(
      state.copyWith(status: IncomingRequestStatus.accepting, clearError: true),
    );

    try {
      await _signalR.acceptRequest(state.request.requestId);
      emit(state.copyWith(status: IncomingRequestStatus.accepted));
    } catch (e) {
      emit(
        state.copyWith(
          status: IncomingRequestStatus.error,
          errorMessage: 'Failed to accept the request: $e',
        ),
      );
    }
  }

  Future<void> refuseRequest(String reason) async {
    if (state.status == IncomingRequestStatus.refusing) return;
    emit(
      state.copyWith(
        status: IncomingRequestStatus.refusing,
        refusalReason: reason,
        clearError: true,
      ),
    );
    try {
      await _signalR.refuseRequest(state.request.requestId, reason);
      emit(state.copyWith(status: IncomingRequestStatus.refused));
    } catch (e) {
      emit(
        state.copyWith(
          status: IncomingRequestStatus.error,
          errorMessage: 'Failed to refuse: $e',
        ),
      );
    }
  }

  @override
  Future<void> close() async {
    await _cancelledSubscription?.cancel();
    return super.close();
  }
}
