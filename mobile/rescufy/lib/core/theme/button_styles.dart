// lib/core/theme/button_styles.dart
import 'package:flutter/material.dart';
import 'colors.dart';
import 'text_styles.dart';

class AppButtonStyles {
  // Primary Button (Emergency Red)
  static ButtonStyle get primary =>
      ElevatedButton.styleFrom(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        disabledBackgroundColor: AppColors.textDisabled,
        disabledForegroundColor: Colors.white,
        minimumSize: const Size(double.infinity, 56),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        elevation: 0,
        shadowColor: Colors.transparent,
        textStyle: AppTextStyles.buttonLarge,
      ).copyWith(
        overlayColor: MaterialStateProperty.resolveWith<Color?>((states) {
          if (states.contains(MaterialState.pressed)) {
            return AppColors.primaryDark;
          }
          return null;
        }),
      );

  // Secondary Button (Outlined)
  static ButtonStyle get secondary => OutlinedButton.styleFrom(
    foregroundColor: AppColors.primary,
    side: BorderSide(color: AppColors.primary, width: 2),
    minimumSize: const Size(double.infinity, 56),
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    textStyle: AppTextStyles.buttonLarge.copyWith(color: AppColors.primary),
  );

  // Emergency Button (Prominent)
  static ButtonStyle get emergency => ElevatedButton.styleFrom(
    backgroundColor: AppColors.primary,
    foregroundColor: Colors.white,
    minimumSize: const Size(double.infinity, 60),
    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 18),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    elevation: 4,
    shadowColor: AppColors.primary.withOpacity(0.3),
    textStyle: AppTextStyles.buttonLarge.copyWith(
      fontSize: 18,
      fontWeight: FontWeight.w700,
      letterSpacing: 1.1,
    ),
  );

  // Text Button
  static ButtonStyle get text => TextButton.styleFrom(
    foregroundColor: AppColors.primary,
    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
    textStyle: AppTextStyles.labelLarge.copyWith(color: AppColors.primary),
  );

  // Icon Button
  static ButtonStyle get icon => IconButton.styleFrom(
    backgroundColor: AppColors.primary.withOpacity(0.1),
    foregroundColor: AppColors.primary,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
  );
}
