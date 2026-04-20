// lib/core/network/api_endpoints.dart
class ApiEndpoints {
  static const String baseUrl = 'http://umedical2.runasp.net';

  // Auth
  static const String login = '$baseUrl/api/Auth/login';
  static const String register = '$baseUrl/api/Auth/register';
  static const String logout = '$baseUrl/api/Auth/logout';
  static const String verifyEmail =
      '$baseUrl/api/Auth/verify-registration-otp?';

  // Password Reset
  static const String forgotPassword = '$baseUrl/api/Auth/forget-password';
  static const String verifyResetPasswordOtp =
      '$baseUrl/api/Auth/verify-reset-password-otp';
  static const String resetPassword = '$baseUrl/api/Auth/reset-password';

  // User
  static const String profile = '$baseUrl/api/user/profile';
  static const String updateProfile = '$baseUrl/api/user/update';

  // Emergency
  static const String createEmergencyRequest = '$baseUrl/api/emergency/create';
  static const String getEmergencies = '$baseUrl/api/emergency/list';

  // Paramedic
  static const String incomingRequests =
      '$baseUrl/api/paramedic/incoming-requests';
  static const String caseHistory = '$baseUrl/api/paramedic/case-history';

  static String acceptRequest(String requestId) =>
      '$baseUrl/api/paramedic/requests/$requestId/accept';

  static String rejectRequest(String requestId) =>
      '$baseUrl/api/paramedic/requests/$requestId/reject';

  static String updateCaseStatus(String requestId) =>
      '$baseUrl/api/paramedic/requests/$requestId/status';
  static const String paramedicHistory = '/paramedic/history';
  static const String paramedicProfile = '/paramedic/profile';

  // ── SignalR ─────────────────────────────────────────────────────────────────
  /// Full URL to the SignalR hub (NOT the REST base URL).
  static const String signalRHubUrl = 'https://api.rescufy.io/hubs/emergency';
}
