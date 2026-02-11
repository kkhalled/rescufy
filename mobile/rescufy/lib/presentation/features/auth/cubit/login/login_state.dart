// lib/presentation/features/auth/cubit/login_state.dart
import 'package:equatable/equatable.dart';
import '../../../../../domain/entities/user.dart';

abstract class LoginState extends Equatable {
  const LoginState();

  @override
  List<Object?> get props => [];
}

class LoginInitial extends LoginState {
  final bool obscurePassword;
  final bool rememberMe;

  const LoginInitial({this.obscurePassword = true, this.rememberMe = false});

  @override
  List<Object?> get props => [obscurePassword, rememberMe];

  LoginInitial copyWith({bool? obscurePassword, bool? rememberMe}) {
    return LoginInitial(
      obscurePassword: obscurePassword ?? this.obscurePassword,
      rememberMe: rememberMe ?? this.rememberMe,
    );
  }
}

class LoginLoading extends LoginState {}

class LoginSuccess extends LoginState {
  final User user;

  const LoginSuccess(this.user);

  @override
  List<Object?> get props => [user];
}

class LoginFailure extends LoginState {
  final String message;

  const LoginFailure(this.message);

  @override
  List<Object?> get props => [message];
}
