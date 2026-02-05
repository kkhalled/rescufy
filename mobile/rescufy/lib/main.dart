// lib/main.dart
import 'package:flutter/material.dart';
import 'package:rescufy/core/theme/app_theme.dart';

// Screens
import 'package:rescufy/presentation/screens/splash_screen.dart';
import 'package:rescufy/presentation/features/home/views/home_screen.dart';
import 'package:rescufy/presentation/features/auth/views/login_screen.dart';
import 'package:rescufy/presentation/features/auth/views/signup_screen.dart';
import 'package:rescufy/presentation/features/request/views/emergency_form_screen.dart';
import 'package:rescufy/presentation/features/request/views/request_history_screen.dart';
import 'package:rescufy/presentation/features/profile/views/profile_screen.dart';

void main() {
  runApp(const RescufyApp());
}

class RescufyApp extends StatelessWidget {
  const RescufyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Rescufy',
      debugShowCheckedModeBanner: false,

      // Apply your theme
      theme: AppTheme.lightTheme,

      // Initial route
      initialRoute: '/',

      // All routes
      routes: {
        '/': (context) => const SplashScreen(),
        '/home': (context) => const HomeScreen(),
        '/login': (context) => const LoginScreen(),
        '/signup': (context) => const SignupScreen(),
        '/emergency-form': (context) {
          // Get arguments passed from home screen
          final args = ModalRoute.of(context)?.settings.arguments;
          final isSelfCase = args is bool ? args : true;
          return EmergencyFormScreen(isSelfCase: isSelfCase);
        },
        '/history': (context) => const RequestHistoryScreen(),
        '/profile': (context) => const ProfileScreen(),
      },

      // Fallback for unknown routes
      onUnknownRoute: (settings) {
        return MaterialPageRoute(builder: (context) => const HomeScreen());
      },
    );
  }
}
