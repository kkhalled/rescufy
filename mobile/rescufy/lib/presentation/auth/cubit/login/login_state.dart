import 'package:equatable/equatable.dart';

class LoginState extends Equatable {
  const LoginState({
    this.email = '',
    this.password = '',
    this.emailError,
    this.passwordError,
    this.obscurePassword = true,
    this.rememberMe = false,
    this.showValidation = false,
  });

  final String email;
  final String password;
  final String? emailError;
  final String? passwordError;
  final bool obscurePassword;
  final bool rememberMe;
  final bool showValidation;

  bool get isValid => emailError == null && passwordError == null;

  LoginState copyWith({
    String? email,
    String? password,
    String? emailError,
    String? passwordError,
    bool? obscurePassword,
    bool? rememberMe,
    bool? showValidation,
    bool clearEmailError = false,
    bool clearPasswordError = false,
  }) {
    return LoginState(
      email: email ?? this.email,
      password: password ?? this.password,
      emailError: clearEmailError ? null : (emailError ?? this.emailError),
      passwordError: clearPasswordError
          ? null
          : (passwordError ?? this.passwordError),
      obscurePassword: obscurePassword ?? this.obscurePassword,
      rememberMe: rememberMe ?? this.rememberMe,
      showValidation: showValidation ?? this.showValidation,
    );
  }

  @override
  List<Object?> get props => [
    email,
    password,
    emailError,
    passwordError,
    obscurePassword,
    rememberMe,
    showValidation,
  ];
}
