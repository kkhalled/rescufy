// lib/core/network/api_endpoints.dart
class ApiEndpoints {
  static const String baseUrl = 'http://rescufyy.runasp.net';
  // Auth
  static const String login = '$baseUrl/api/Auth/login';
  static const String register = '$baseUrl/api/Auth/register';
  static const String logout = '$baseUrl/api/Auth/logout';
  static const String verifyEmail =
      '$baseUrl/api/Auth/verify-registration-otp?';

  // ✅ NEW: Password Reset
  static const String forgotPassword = '$baseUrl/api/Auth/forgot-password';
  static const String verifyResetPasswordOtp =
      '$baseUrl/api/Auth/verify-reset-password-otp';
  static const String resetPassword = '$baseUrl/api/Auth/reset-password';
  // User
  static const String profile = 'user/profile';
  static const String updateProfile = 'user/update';

  // Emergency
  static const String createEmergency = 'emergency/create';
  static const String getEmergencies = 'emergency/list';
}
