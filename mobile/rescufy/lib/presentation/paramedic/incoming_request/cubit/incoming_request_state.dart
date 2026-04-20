import 'package:equatable/equatable.dart';
import 'package:rescufy/domain/entities/incoming_request.dart';

enum IncomingRequestStatus {
  idle,
  accepting,
  accepted,
  refusing,
  refused,
  cancelled,
  error,
}

class IncomingRequestState extends Equatable {
  const IncomingRequestState({
    required this.request,
    required this.status,
    this.errorMessage,
    this.refusalReason,
  });

  final IncomingRequest request;
  final IncomingRequestStatus status;
  final String? errorMessage;
  final String? refusalReason;

  factory IncomingRequestState.initial(IncomingRequest request) =>
      IncomingRequestState(
        request: request,
        status: IncomingRequestStatus.idle,
      );

  IncomingRequestState copyWith({
    IncomingRequestStatus? status,
    String? errorMessage,
    String? refusalReason,
    bool clearError = false,
  }) => IncomingRequestState(
    request: request,
    status: status ?? this.status,
    errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
    refusalReason: refusalReason ?? this.refusalReason,
  );

  @override
  List<Object?> get props => [request, status, errorMessage, refusalReason];
}
