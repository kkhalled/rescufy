// lib/presentation/features/auth/cubit/verify_reset_otp/verify_reset_otp_cubit.dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:rescufy/domain/repositories/auth_repository.dart';
import 'verify_reset_otp_state.dart';

class VerifyResetOtpCubit extends Cubit<VerifyResetOtpState> {
  VerifyResetOtpCubit(this._authRepository)
    : super(const VerifyResetOtpState());

  final AuthRepository _authRepository;

  final _isLoadingController = StreamController<bool>.broadcast();
  final _otpController = StreamController<String>.broadcast();

  Stream<bool> get isLoadingStream => _isLoadingController.stream;
  Stream<String> get otpStream => _otpController.stream;

  BuildContext? _context;

  void initialize(BuildContext context) {
    _context = context;
  }

  void updateOtp(String otp) {
    _otpController.add(otp.trim());
  }

  String? validateOtp(String otp) {
    final normalizedOtp = otp.trim();

    if (normalizedOtp.isEmpty) {
      return 'Please enter the verification code';
    }

    if (!RegExp(r'^\d{6}$').hasMatch(normalizedOtp)) {
      return 'Please enter a valid 6-digit code';
    }

    return null;
  }

  Future<void> verifyResetOtp(String email, String otp) async {
    if (_context == null) return;

    final otpError = validateOtp(otp);
    if (otpError != null) {
      _showSnackbar(message: otpError, isError: true);
      return;
    }

    _isLoadingController.add(true);

    final result = await _authRepository.verifyResetPasswordOtp(
      email: email.trim(),
      otp: otp.trim(),
    );

    result.fold(
      (failure) {
        _isLoadingController.add(false);
        _showSnackbar(message: failure.message, isError: true);
      },
      (_) {
        _isLoadingController.add(false);
        Navigator.of(_context!).pushNamed(
          AppRoutes.resetPassword,
          arguments: {'email': email.trim(), 'otp': otp.trim()},
        );
      },
    );
  }

  void navigateBack() {
    if (_context == null) return;
    Navigator.of(_context!).pop();
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
    _isLoadingController.close();
    _otpController.close();
    return super.close();
  }
}
