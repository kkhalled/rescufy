// lib/presentation/features/auth/cubit/register_state.dart
import 'package:equatable/equatable.dart';
import '../../../../../domain/entities/user.dart';

abstract class RegisterState extends Equatable {
  const RegisterState();

  @override
  List<Object?> get props => [];
}

class RegisterInitial extends RegisterState {
  final bool obscurePassword;
  final bool obscureConfirmPassword;
  final String selectedGender;

  const RegisterInitial({
    this.obscurePassword = true,
    this.obscureConfirmPassword = true,
    this.selectedGender = '',
  });

  @override
  List<Object?> get props => [
    obscurePassword,
    obscureConfirmPassword,
    selectedGender,
  ];

  RegisterInitial copyWith({
    bool? obscurePassword,
    bool? obscureConfirmPassword,
    String? selectedGender,
  }) {
    return RegisterInitial(
      obscurePassword: obscurePassword ?? this.obscurePassword,
      obscureConfirmPassword:
          obscureConfirmPassword ?? this.obscureConfirmPassword,
      selectedGender: selectedGender ?? this.selectedGender,
    );
  }
}

class RegisterLoading extends RegisterState {
  final bool obscurePassword;
  final bool obscureConfirmPassword;
  final String selectedGender;

  const RegisterLoading({
    this.obscurePassword = true,
    this.obscureConfirmPassword = true,
    this.selectedGender = '',
  });

  @override
  List<Object?> get props => [
    obscurePassword,
    obscureConfirmPassword,
    selectedGender,
  ];
}

class RegisterSuccess extends RegisterState {
  final User user;

  const RegisterSuccess(this.user);

  @override
  List<Object?> get props => [user];
}

class RegisterFailure extends RegisterState {
  final String message;
  final bool obscurePassword;
  final bool obscureConfirmPassword;
  final String selectedGender;

  const RegisterFailure(
    this.message, {
    this.obscurePassword = true,
    this.obscureConfirmPassword = true,
    this.selectedGender = '',
  });

  @override
  List<Object?> get props => [
    message,
    obscurePassword,
    obscureConfirmPassword,
    selectedGender,
  ];
}
