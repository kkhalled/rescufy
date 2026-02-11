import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:rescufy/core/di/injection_container.dart' as di;
import 'package:rescufy/core/navigation/app_routes.dart';

// Screens
import 'package:rescufy/presentation/features/onboarding/onboarding_screen.dart';
import 'package:rescufy/presentation/features/auth/views/login_screen.dart';
import 'package:rescufy/presentation/features/auth/views/register_screen.dart';
import 'package:rescufy/presentation/features/auth/views/forgot_password_screen.dart';
import 'package:rescufy/presentation/features/auth/views/verify_reset_otp_screen.dart';
import 'package:rescufy/presentation/features/auth/views/reset_password_screen.dart';
import 'package:rescufy/presentation/features/home/views/home_screen.dart';
import 'package:rescufy/presentation/features/request/views/emergency_form_screen.dart';
import 'package:rescufy/presentation/features/request/views/request_history_screen.dart';
import 'package:rescufy/presentation/features/profile/views/profile_screen.dart';

// Cubits
import 'package:rescufy/presentation/features/auth/cubit/login/login_cubit.dart';
import 'package:rescufy/presentation/features/auth/cubit/register/register_cubit.dart';
import 'package:rescufy/presentation/features/auth/cubit/forgot_password/forgot_password_cubit.dart';
import 'package:rescufy/presentation/features/auth/cubit/verify_reset_otp/verify_reset_otp_cubit.dart';
import 'package:rescufy/presentation/features/auth/cubit/reset_password/reset_password_cubit.dart';

class AppRouter {
  Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      // =============================
      // Splash / Onboarding
      // =============================
      case AppRoutes.splash:
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
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => di.sl<VerifyResetOtpCubit>(),
            child: const VerifyResetOtpScreen(email: ''),
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
      // Main App
      // =============================
      case AppRoutes.home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());

      case AppRoutes.emergencyForm:
        final isSelfCase = settings.arguments as bool? ?? true;
        return MaterialPageRoute(
          builder: (_) => EmergencyFormScreen(isSelfCase: isSelfCase),
        );

      case AppRoutes.history:
        return MaterialPageRoute(builder: (_) => const RequestHistoryScreen());

      case AppRoutes.profile:
        return MaterialPageRoute(builder: (_) => const ProfileScreen());

      // =============================
      // Fallback
      // =============================
      default:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
    }
  }
}
