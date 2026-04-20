import 'package:equatable/equatable.dart';

class IncomingRequest extends Equatable {
  const IncomingRequest({
    required this.requestId,
    required this.caseId,
    required this.patientName,
    required this.patientAge,
    required this.patientGender,
    required this.emergencyType,
    required this.severity,
    required this.description,
    required this.latitude,
    required this.longitude,
    required this.address,
    required this.hospitalName,
    required this.createdAt,
    this.aiSummary,
    this.allergies = const [],
    this.chronicDiseases = const [],
    this.currentMedications = const [],
    this.bloodType,
  });

  final String requestId;
  final String caseId;
  final String patientName;
  final int patientAge;
  final String patientGender;
  final String emergencyType;
  final String severity;
  final String description;
  final String? aiSummary;
  final List<String> allergies;
  final List<String> chronicDiseases;
  final List<String> currentMedications;
  final String? bloodType;
  final double latitude;
  final double longitude;
  final String address;
  final String hospitalName;
  final DateTime createdAt;

  bool get hasCriticalMedicalData =>
      allergies.isNotEmpty || chronicDiseases.isNotEmpty;

  bool get isCritical =>
      severity.toLowerCase() == 'critical' || severity.toLowerCase() == 'high';

  String get googleMapsUrl =>
      'https://www.google.com/maps/dir/?api=1&destination=$latitude,$longitude';

  factory IncomingRequest.fromJson(Map<String, dynamic> json) {
    return IncomingRequest(
      requestId: json['requestId'] as String,
      caseId: json['caseId'] as String? ?? '',
      patientName: json['patientName'] as String? ?? 'Unknown',
      patientAge: (json['patientAge'] as num?)?.toInt() ?? 0,
      patientGender: json['patientGender'] as String? ?? '',
      emergencyType: json['emergencyType'] as String? ?? 'Other',
      severity: json['severity'] as String? ?? 'medium',
      description: json['description'] as String? ?? '',
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      address: json['address'] as String? ?? '',
      hospitalName: json['hospitalName'] as String? ?? 'Nearest Hospital',
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : DateTime.now(),
      aiSummary: json['aiSummary'] as String?,
      bloodType: json['bloodType'] as String?,
      allergies:
          (json['allergies'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      chronicDiseases:
          (json['chronicDiseases'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      currentMedications:
          (json['currentMedications'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
    );
  }

  @override
  List<Object?> get props => [
    requestId,
    caseId,
    patientName,
    patientAge,
    patientGender,
    emergencyType,
    severity,
    description,
    latitude,
    longitude,
    address,
    hospitalName,
    createdAt,
    aiSummary,
    allergies,
    chronicDiseases,
    currentMedications,
    bloodType,
  ];
}
