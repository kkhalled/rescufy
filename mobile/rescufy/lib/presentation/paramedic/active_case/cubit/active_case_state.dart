import 'package:equatable/equatable.dart';
import 'package:rescufy/domain/entities/case_status.dart';
import 'package:rescufy/domain/entities/incoming_request.dart';

enum ActiveCaseLoadStatus { joining, ready, error }

class ActiveCaseState extends Equatable {
  const ActiveCaseState({
    required this.request,
    required this.loadStatus,
    required this.caseStatus,
    this.paramedicLat,
    this.paramedicLng,
    this.isTrackingLocation = false,
    this.isUpdatingStatus = false,
    this.liveStatusMessage,
    this.lastUpdatedAt,
    this.errorMessage,
  });

  final IncomingRequest request;
  final ActiveCaseLoadStatus loadStatus;
  final CaseStatus caseStatus;
  final double? paramedicLat; // paramedic coordinates only
  final double? paramedicLng;
  final bool isTrackingLocation;
  final bool isUpdatingStatus;
  final String? liveStatusMessage;
  final DateTime? lastUpdatedAt;
  final String? errorMessage;

  factory ActiveCaseState.initial(IncomingRequest request) => ActiveCaseState(
    request: request,
    loadStatus: ActiveCaseLoadStatus.joining,
    caseStatus: CaseStatus.onTheWay,
    liveStatusMessage: 'Case accepted. Preparing live updates.',
  );

  ActiveCaseState copyWith({
    ActiveCaseLoadStatus? loadStatus,
    CaseStatus? caseStatus,
    double? paramedicLat,
    double? paramedicLng,
    bool? isTrackingLocation,
    bool? isUpdatingStatus,
    String? liveStatusMessage,
    DateTime? lastUpdatedAt,
    String? errorMessage,
    bool clearError = false,
  }) => ActiveCaseState(
    request: request,
    loadStatus: loadStatus ?? this.loadStatus,
    caseStatus: caseStatus ?? this.caseStatus,
    paramedicLat: paramedicLat ?? this.paramedicLat,
    paramedicLng: paramedicLng ?? this.paramedicLng,
    isTrackingLocation: isTrackingLocation ?? this.isTrackingLocation,
    isUpdatingStatus: isUpdatingStatus ?? this.isUpdatingStatus,
    liveStatusMessage: liveStatusMessage ?? this.liveStatusMessage,
    lastUpdatedAt: lastUpdatedAt ?? this.lastUpdatedAt,
    errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
  );

  @override
  List<Object?> get props => [
    request,
    loadStatus,
    caseStatus,
    paramedicLat,
    paramedicLng,
    isTrackingLocation,
    isUpdatingStatus,
    liveStatusMessage,
    lastUpdatedAt,
    errorMessage,
  ];
}
