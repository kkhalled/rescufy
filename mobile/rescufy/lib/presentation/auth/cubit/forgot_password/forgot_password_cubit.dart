// lib/presentation/features/auth/cubit/forgot_password/forgot_password_cubit.dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:rescufy/domain/repositories/auth_repository.dart';
import 'forgot_password_state.dart';

class ForgotPasswordCubit extends Cubit<ForgotPasswordState> {
  ForgotPasswordCubit(this._authRepository)
    : super(const ForgotPasswordState());

  final AuthRepository _authRepository;

  // Stream controller for loading state
  final _isLoadingController = StreamController<bool>.broadcast();

  Stream<bool> get isLoadingStream => _isLoadingController.stream;

  BuildContext? _context;
  GlobalKey<FormState>? _formKey;

  void initialize({
    required BuildContext context,
    required GlobalKey<FormState> formKey,
  }) {
    _context = context;
    _formKey = formKey;
  }

  String? validateEmail(String? value) {
    final email = value?.trim() ?? '';

    if (email.isEmpty) {
      return 'Please enter your email';
    }

    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email)) {
      return 'Please enter a valid email';
    }

    return null;
  }

  Future<void> sendOtp(String email) async {
    if (_context == null || _formKey == null) return;
    if (!_formKey!.currentState!.validate()) return;

    _isLoadingController.add(true);

    final result = await _authRepository.forgotPassword(email: email.trim());

    result.fold(
      (failure) {
        _isLoadingController.add(false);
        _showSnackbar(message: failure.message, isError: true);
      },
      (_) {
        _isLoadingController.add(false);
        Navigator.of(_context!).pushNamed(
          AppRoutes.verifyResetOtp,
          arguments: {'email': email.trim()},
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
    return super.close();
  }
}
