// lib/presentation/features/auth/cubit/login_cubit.dart
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../domain/usecases/login_usecase.dart';
import 'login_state.dart';

class LoginCubit extends Cubit<LoginState> {
  final LoginUseCase loginUseCase;

  LoginCubit(this.loginUseCase) : super(const LoginInitial());

  void togglePasswordVisibility() {
    if (state is LoginInitial) {
      final currentState = state as LoginInitial;
      emit(
        currentState.copyWith(obscurePassword: !currentState.obscurePassword),
      );
    }
  }

  void toggleRememberMe(bool value) {
    if (state is LoginInitial) {
      final currentState = state as LoginInitial;
      emit(currentState.copyWith(rememberMe: value));
    }
  }

  Future<void> login(String email, String password) async {
    emit(LoginLoading());

    final result = await loginUseCase(
      LoginParams(email: email, password: password),
    );

    result.fold(
      (failure) => emit(LoginFailure(failure.message)),
      (user) => emit(LoginSuccess(user)),
    );
  }
}
