// lib/presentation/features/auth/cubit/reset_password/reset_password_cubit.dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:rescufy/domain/repositories/auth_repository.dart';
import 'reset_password_state.dart';

class ResetPasswordCubit extends Cubit<ResetPasswordState> {
  ResetPasswordCubit(this._authRepository) : super(const ResetPasswordState());

  final AuthRepository _authRepository;

  final _obscurePasswordController = StreamController<bool>.broadcast();
  final _obscureConfirmPasswordController = StreamController<bool>.broadcast();
  final _isLoadingController = StreamController<bool>.broadcast();

  Stream<bool> get obscurePasswordStream => _obscurePasswordController.stream;
  Stream<bool> get obscureConfirmPasswordStream =>
      _obscureConfirmPasswordController.stream;
  Stream<bool> get isLoadingStream => _isLoadingController.stream;

  BuildContext? _context;
  GlobalKey<FormState>? _formKey;
  String _email = '';
  String _otp = '';
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  void initialize({
    required BuildContext context,
    required GlobalKey<FormState> formKey,
    required String email,
    required String otp,
  }) {
    _context = context;
    _formKey = formKey;
    _email = email;
    _otp = otp;
  }

  String? validateNewPassword(String? value) {
    final password = value ?? '';

    if (password.isEmpty) {
      return 'Please enter a password';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!RegExp(r'[A-Z]').hasMatch(password)) {
      return 'Password must contain an uppercase letter';
    }
    if (!RegExp(r'[a-z]').hasMatch(password)) {
      return 'Password must contain a lowercase letter';
    }
    if (!RegExp(r'[0-9]').hasMatch(password)) {
      return 'Password must contain a number';
    }

    return null;
  }

  String? validateConfirmPassword({
    required String? newPassword,
    required String? confirmPassword,
  }) {
    final confirmation = confirmPassword ?? '';

    if (confirmation.isEmpty) {
      return 'Please confirm your password';
    }

    if (confirmation != (newPassword ?? '')) {
      return 'Passwords do not match';
    }

    return null;
  }

  void togglePasswordVisibility() {
    _obscurePassword = !_obscurePassword;
    _obscurePasswordController.add(_obscurePassword);
  }

  void toggleConfirmPasswordVisibility() {
    _obscureConfirmPassword = !_obscureConfirmPassword;
    _obscureConfirmPasswordController.add(_obscureConfirmPassword);
  }

  Future<void> resetPassword({required String newPassword}) async {
    if (_context == null || _formKey == null) return;
    if (!_formKey!.currentState!.validate()) return;

    _isLoadingController.add(true);

    final result = await _authRepository.resetPassword(
      email: _email.trim(),
      otp: _otp.trim(),
      newPassword: newPassword.trim(),
    );

    result.fold(
      (failure) {
        _isLoadingController.add(false);
        _showSnackbar(message: failure.message, isError: true);
      },
      (_) {
        _isLoadingController.add(false);
        _showSnackbar(message: 'Password reset successful!', isError: false);
        Navigator.of(
          _context!,
        ).pushNamedAndRemoveUntil(AppRoutes.login, (_) => false);
      },
    );
  }

  void _showSnackbar({required String message, bool isError = false}) {
    if (_context == null) return;
    final colorScheme = Theme.of(_context!).colorScheme;

    ScaffoldMessenger.of(_context!).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? colorScheme.error : colorScheme.primary,
      ),
    );
  }

  @override
  Future<void> close() {
    _obscurePasswordController.close();
    _obscureConfirmPasswordController.close();
    _isLoadingController.close();
    return super.close();
  }
}
