enum CaseStatus { pending, onTheWay, arrived, treatmentStarted, completed }

extension CaseStatusX on CaseStatus {
  String get serverValue => switch (this) {
    CaseStatus.pending => 'Pending',
    CaseStatus.onTheWay => 'OnTheWay',
    CaseStatus.arrived => 'Arrived',
    CaseStatus.treatmentStarted => 'TreatmentStarted',
    CaseStatus.completed => 'Completed',
  };

  String get label => switch (this) {
    CaseStatus.pending => 'Pending',
    CaseStatus.onTheWay => 'On The Way',
    CaseStatus.arrived => 'Arrived',
    CaseStatus.treatmentStarted => 'Treatment',
    CaseStatus.completed => 'Completed',
  };
}

extension CaseStatusParsing on String {
  CaseStatus toCaseStatus() => switch (toLowerCase()) {
    'pending' => CaseStatus.pending,
    'ontheway' => CaseStatus.onTheWay,
    'arrived' => CaseStatus.arrived,
    'treatmentstarted' => CaseStatus.treatmentStarted,
    'completed' => CaseStatus.completed,
    _ => CaseStatus.pending,
  };
}
