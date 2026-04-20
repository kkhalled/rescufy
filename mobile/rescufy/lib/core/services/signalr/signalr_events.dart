/// Single source of truth for all SignalR method names.
/// Never use raw strings anywhere else.
class SignalREvents {
  SignalREvents._();

  // ── Inbound (server → client) ──────────────────────────────────────────────
  static const String receiveEmergencyRequest = 'ReceiveEmergencyRequest';
  static const String requestCancelled = 'RequestCancelled';
  static const String caseGroupJoined = 'CaseGroupJoined';
  static const String caseUpdated = 'CaseUpdated';

  // ── Outbound (client → server) ─────────────────────────────────────────────
  static const String acceptRequest = 'AcceptRequest'; // (requestId)
  static const String refuseRequest = 'RefuseRequest'; // (requestId, reason)
  static const String joinCaseGroup = 'JoinCaseGroup'; // (requestId)
  static const String sendLocation = 'SendLocation'; // (requestId, lat, lng)
  static const String updateStatus = 'UpdateStatus'; // (requestId, status)
}

class SignalRPayloadKeys {
  SignalRPayloadKeys._();

  static const String requestId = 'requestId';
  static const String caseId = 'caseId';
  static const String patientName = 'patientName';
  static const String patientAge = 'patientAge';
  static const String patientGender = 'patientGender';
  static const String emergencyType = 'emergencyType';
  static const String severity = 'severity';
  static const String description = 'description';
  static const String latitude = 'latitude';
  static const String longitude = 'longitude';
  static const String address = 'address';
  static const String hospitalName = 'hospitalName';
  static const String createdAt = 'createdAt';
  static const String aiSummary = 'aiSummary';
  static const String allergies = 'allergies';
  static const String chronicDiseases = 'chronicDiseases';
  static const String currentMedications = 'currentMedications';
  static const String bloodType = 'bloodType';
  static const String status = 'status';
  static const String message = 'message';
  static const String updatedAt = 'updatedAt';
}
