class AppRoutes {
  // =========================
  // Core
  // =========================
  static const String splash = '/';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String signup = '/signup';

  // =========================
  // Password Reset
  // =========================
  static const String forgotPassword = '/forgot-password';
  static const String verifyResetOtp = '/verify-reset-otp';
  static const String resetPassword = '/reset-password';

  // =========================
  // USER MODULE
  // =========================
  static const String userHome = '/user/home';
  static const String emergencyForm = '/emergency-form';
  static const String userHistory = '/user/history';
  static const String userProfile = '/user/profile';
  static const String language = '/language';

  // =========================
  // PARAMEDIC MODULE
  // =========================
  static const String paramedicShell = '/paramedic';
  static const String paramedicDashboard = '/paramedic/dashboard';
  static const String activeCase = '/paramedic/active-case';
  static const String paramedicHistory = '/paramedic/history';
  static const String paramedicProfile = '/paramedic/profile';
  static const String paramedicActiveCase = '/paramedic/active-case';

  // =========================
  // Error
  // =========================
  static const String error = '/error';
}
