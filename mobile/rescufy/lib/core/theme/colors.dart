// lib/core/theme/colors.dart
import 'package:flutter/material.dart';

class AppColors {
  // Primary Emergency Colors
  static const Color primary = Color(0xFFB40D14); // Your emergency red
  static const Color primaryDark = Color(0xFF8A0A10);
  static const Color primaryLight = Color(0xFFE63946);

  // Background & Surface
  static const Color background = Color(0xFFF8F9FA); // Light gray
  static const Color surface = Colors.white;
  static const Color card = Colors.white;

  // Text Colors
  static const Color textPrimary = Color(0xFF212121); // Almost black
  static const Color textSecondary = Color(0xFF757575); // Gray
  static const Color textDisabled = Color(0xFF9E9E9E);
  static const Color textInverse = Colors.white; // For dark backgrounds

  // Status Colors
  static const Color success = Color(0xFF2E7D32); // Green
  static const Color warning = Color(0xFFF57C00); // Orange
  static const Color error = Color(0xFFD32F2F); // Red
  static const Color info = Color(0xFF1976D2); // Blue

  // UI Elements
  static const Color border = Color(0xFFE0E0E0);
  static const Color divider = Color(0xFFEEEEEE);
  static const Color shadow = Color(0x1A000000); // 10% black - ADD THIS LINE

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
