// lib/core/theme/colors.dart
import 'package:flutter/material.dart';

class AppColors {
  // Primary Emergency Colors
  static const Color primary = Color(0xFFB40D14);
  static const Color primaryDark = Color(0xFF8A0A10);
  static const Color primaryLight = Color(0xFFE63946);

  // Background & Surface
  static const Color background = Color(0xFFF8F9FA);
  static const Color surface = Colors.white;
  static const Color card = Colors.white;

  // Text Colors
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color textDisabled = Color(0xFF9E9E9E);
  static const Color textInverse = Colors.white;

  // Status Colors
  static const Color success = Color(0xFF2E7D32);
  static const Color warning = Color(0xFFF57C00);
  static const Color error = Color(0xFFD32F2F);
  static const Color info = Color(0xFF1976D2);

  // UI Elements
  static const Color border = Color(0xFFE0E0E0);
  static const Color divider = Color(0xFFEEEEEE);
  static const Color shadow = Color(0x1A000000);

  // Gradients
  static Gradient get primaryGradient => LinearGradient(
    colors: [primaryDark, primary],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static Gradient get emergencyGradient => LinearGradient(
    colors: [primary, Color(0xFFD32F2F)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );
}

// ✅ NEW: Dark Theme Colors
class AppColorsDark {
  // Background & Surface
  static const Color background = Color(0xFF121212); // Dark background
  static const Color surface = Color(0xFF1E1E1E); // Elevated surface
  static const Color card = Color(0xFF2C2C2C); // Card background

  // Text Colors
  static const Color textPrimary = Color(0xFFE0E0E0); // Light text
  static const Color textSecondary = Color(0xFFB0B0B0); // Gray text
  static const Color textDisabled = Color(0xFF757575); // Disabled text

  // UI Elements
  static const Color border = Color(0xFF3A3A3A); // Subtle borders
  static const Color divider = Color(0xFF2C2C2C); // Dividers
}
