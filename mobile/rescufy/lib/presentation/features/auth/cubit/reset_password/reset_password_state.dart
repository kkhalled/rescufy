import 'package:equatable/equatable.dart';

abstract class ResetPasswordState extends Equatable {
  const ResetPasswordState();

  @override
  List<Object?> get props => [];
}

class ResetPasswordInitial extends ResetPasswordState {
  final bool obscurePassword;
  final bool obscureConfirmPassword;

  const ResetPasswordInitial({
    this.obscurePassword = true,
    this.obscureConfirmPassword = true,
  });

  ResetPasswordInitial copyWith({
    bool? obscurePassword,
    bool? obscureConfirmPassword,
  }) {
    return ResetPasswordInitial(
      obscurePassword: obscurePassword ?? this.obscurePassword,
      obscureConfirmPassword:
          obscureConfirmPassword ?? this.obscureConfirmPassword,
    );
  }

  @override
  List<Object?> get props => [obscurePassword, obscureConfirmPassword];
}

class ResetPasswordLoading extends ResetPasswordState {
  final bool obscurePassword;
  final bool obscureConfirmPassword;

  const ResetPasswordLoading({
    required this.obscurePassword,
    required this.obscureConfirmPassword,
  });

  @override
  List<Object?> get props => [obscurePassword, obscureConfirmPassword];
}

class ResetPasswordSuccess extends ResetPasswordState {
  const ResetPasswordSuccess();
}

class ResetPasswordFailure extends ResetPasswordState {
  final String message;
  final bool obscurePassword;
  final bool obscureConfirmPassword;

  const ResetPasswordFailure(
    this.message, {
    required this.obscurePassword,
    required this.obscureConfirmPassword,
  });

  @override
  List<Object?> get props => [message, obscurePassword, obscureConfirmPassword];
}
