import 'package:equatable/equatable.dart';
import 'package:rescufy/domain/entities/incoming_request.dart';

enum DashboardSignalRStatus {
  disconnected,
  connecting,
  connected,
  reconnecting,
}

class DashboardState extends Equatable {
  const DashboardState({
    required this.isOnline,
    required this.signalRStatus,
    this.incomingRequest,
    this.error,
  });

  final bool isOnline;
  final DashboardSignalRStatus signalRStatus;
  final IncomingRequest? incomingRequest;
  final String? error;

  factory DashboardState.initial() => const DashboardState(
    isOnline: false,
    signalRStatus: DashboardSignalRStatus.disconnected,
  );

  DashboardState copyWith({
    bool? isOnline,
    DashboardSignalRStatus? signalRStatus,
    IncomingRequest? incomingRequest,
    bool clearRequest = false,
    String? error,
    bool clearError = false,
  }) {
    return DashboardState(
      isOnline: isOnline ?? this.isOnline,
      signalRStatus: signalRStatus ?? this.signalRStatus,
      incomingRequest: clearRequest
          ? null
          : incomingRequest ?? this.incomingRequest,
      error: clearError ? null : error ?? this.error,
    );
  }

  @override
  List<Object?> get props => [isOnline, signalRStatus, incomingRequest, error];
}
