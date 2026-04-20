import 'package:flutter_bloc/flutter_bloc.dart';
import 'login_state.dart';

class LoginCubit extends Cubit<LoginState> {
  LoginCubit() : super(const LoginState());

  void onEmailChanged(String value) {
    emit(
      state.copyWith(
        email: value,
        emailError: state.showValidation ? _validateEmail(value) : null,
        clearEmailError: !state.showValidation,
      ),
    );
  }

  void onPasswordChanged(String value) {
    emit(
      state.copyWith(
        password: value,
        passwordError: state.showValidation ? _validatePassword(value) : null,
        clearPasswordError: !state.showValidation,
      ),
    );
  }

  void togglePasswordVisibility() {
    emit(state.copyWith(obscurePassword: !state.obscurePassword));
  }

  void toggleRememberMe(bool? value) {
    emit(state.copyWith(rememberMe: value ?? false));
  }

  bool validate() {
    final emailError = _validateEmail(state.email);
    final passwordError = _validatePassword(state.password);

    emit(
      state.copyWith(
        emailError: emailError,
        passwordError: passwordError,
        showValidation: true,
      ),
    );

    return emailError == null && passwordError == null;
  }

  String? _validateEmail(String value) {
    if (value.trim().isEmpty) {
      return 'Please enter your email';
    }
    if (!RegExp(r'^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value.trim())) {
      return 'Please enter a valid email';
    }
    return null;
  }

  String? _validatePassword(String value) {
    if (value.isEmpty) {
      return 'Please enter your password';
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  }
}
