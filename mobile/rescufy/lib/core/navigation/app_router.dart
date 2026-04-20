// lib/core/navigation/app_router.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rescufy/core/di/injection_container.dart' as di;
import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:rescufy/domain/entities/incoming_request.dart';

// Auth Screens
import 'package:rescufy/presentation/onboarding/onboarding_screen.dart';
import 'package:rescufy/presentation/auth/views/login_screen.dart';
import 'package:rescufy/presentation/auth/views/register_screen.dart';
import 'package:rescufy/presentation/auth/views/forgot_password_screen.dart';
import 'package:rescufy/presentation/auth/views/verify_reset_otp_screen.dart';
import 'package:rescufy/presentation/auth/views/reset_password_screen.dart';
import 'package:rescufy/presentation/splash/splash_screen.dart';
import 'package:rescufy/presentation/paramedic/active_case/cubit/active_case_cubit.dart';
import 'package:rescufy/presentation/paramedic/dashboard/cubit/dashboard_cubit.dart';
import 'package:rescufy/presentation/paramedic/dashboard/views/dashboard_screen.dart';
import 'package:rescufy/presentation/paramedic/incoming_request/cubit/incoming_request_cubit.dart';
import 'package:rescufy/presentation/paramedic/incoming_request/views/incoming_request_screen.dart';

// User Screens
import 'package:rescufy/presentation/user/home/views/home_screen.dart';
import 'package:rescufy/presentation/user/request/cubit/emergency_request_cubit.dart';
import 'package:rescufy/presentation/user/request/views/emergency_form_builder.dart';
import 'package:rescufy/presentation/user/history/views/request_history_screen.dart';
import 'package:rescufy/presentation/user/profile/views/profile_screen.dart';
import 'package:rescufy/presentation/settings/language/language_screen.dart';

// Paramedic Screens
import 'package:rescufy/presentation/paramedic/paramedic_shell/paramedic_navigation_screen.dart';
import 'package:rescufy/presentation/paramedic/active_case/views/active_case_screen.dart';

// Cubits
import 'package:rescufy/presentation/auth/cubit/login/login_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/register/register_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/forgot_password/forgot_password_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/verify_reset_otp/verify_reset_otp_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/reset_password/reset_password_cubit.dart';
import 'package:rescufy/presentation/user/profile/cubit/profile_cubit.dart';

class AppRouter {
  Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      // =============================
      // Splash / Onboarding
      // =============================
      case AppRoutes.splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());

      case AppRoutes.onboarding:
        return MaterialPageRoute(builder: (_) => const OnBoardingScreen());

      // =============================
      // Auth
      // =============================
      case AppRoutes.login:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => di.sl<LoginCubit>(),
            child: const LoginScreen(),
          ),
        );

      case AppRoutes.signup:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => di.sl<RegisterCubit>(),
            child: const SignupScreen(),
          ),
        );

      case AppRoutes.forgotPassword:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => di.sl<ForgotPasswordCubit>(),
            child: const ForgotPasswordScreen(),
          ),
        );

      case AppRoutes.verifyResetOtp:
        final args = settings.arguments as Map<String, dynamic>?;
        final email = args?['email'] as String? ?? '';

        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => di.sl<VerifyResetOtpCubit>(),
            child: VerifyResetOtpScreen(email: email),
          ),
        );

      case AppRoutes.resetPassword:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => di.sl<ResetPasswordCubit>(),
            child: const ResetPasswordScreen(),
          ),
        );

      // =============================
      // USER MODULE
      // =============================
      case AppRoutes.userHome:
        return MaterialPageRoute(builder: (_) => const HomeScreen());

      case AppRoutes.emergencyForm:
        final isSelfCase = settings.arguments as bool? ?? true;
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => di.sl<EmergencyRequestCubit>()..detectLocation(),
            child: EmergencyFormBuilder(isSelfCase: isSelfCase),
          ),
        );

      case AppRoutes.userHistory:
        return MaterialPageRoute(builder: (_) => const RequestHistoryScreen());

      case AppRoutes.userProfile:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => di.sl<ProfileCubit>(),
            child: const ProfileScreen(),
          ),
        );

      case AppRoutes.language:
        return MaterialPageRoute(builder: (_) => const LanguageScreen());

      // =============================
      // PARAMEDIC MODULE
      // =============================
      case AppRoutes.paramedicShell:
        return MaterialPageRoute(
          builder: (_) => const ParamedicNavigationScreen(),
        );

      case AppRoutes.paramedicDashboard:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => di.sl<DashboardCubit>(),
            child: const DashboardScreen(),
          ),
        );

      case AppRoutes.paramedicIncomingRequest:
        final request = settings.arguments as IncomingRequest;
        return MaterialPageRoute(
          fullscreenDialog: true,
          builder: (_) => BlocProvider(
            create: (_) =>
                di.sl<IncomingRequestCubit>(param1: request)..initialize(),
            child: const IncomingRequestScreen(),
          ),
        );

      case AppRoutes.paramedicActiveCase:
        final request = settings.arguments as IncomingRequest;
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => di.sl<ActiveCaseCubit>(param1: request),
            child: const ActiveCaseScreen(),
          ),
        );

      // =============================
      // Fallback
      // =============================
      default:
        return MaterialPageRoute(builder: (_) => const OnBoardingScreen());
    }
  }
}
