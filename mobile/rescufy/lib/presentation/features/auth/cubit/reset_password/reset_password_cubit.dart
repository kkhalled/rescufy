import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../domain/usecases/reset_password_usecase.dart';
import 'reset_password_state.dart';

class ResetPasswordCubit extends Cubit<ResetPasswordState> {
  final ResetPasswordUseCase resetPasswordUseCase;

  ResetPasswordCubit(this.resetPasswordUseCase)
    : super(const ResetPasswordInitial());

  void togglePasswordVisibility() {
    if (state is ResetPasswordInitial) {
      final s = state as ResetPasswordInitial;
      emit(s.copyWith(obscurePassword: !s.obscurePassword));
    }
  }

  void toggleConfirmPasswordVisibility() {
    if (state is ResetPasswordInitial) {
      final s = state as ResetPasswordInitial;
      emit(s.copyWith(obscureConfirmPassword: !s.obscureConfirmPassword));
    }
  }

  Future<void> resetPassword({
    required String email,
    required String otp,
    required String newPassword,
    required String confirmPassword,
  }) async {
    final current = state as ResetPasswordInitial;

    emit(
      ResetPasswordLoading(
        obscurePassword: current.obscurePassword,
        obscureConfirmPassword: current.obscureConfirmPassword,
      ),
    );

    final result = await resetPasswordUseCase(
      ResetPasswordParams(
        email: email,
        otp: otp,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      ),
    );

    result.fold(
      (failure) => emit(
        ResetPasswordFailure(
          failure.message,
          obscurePassword: current.obscurePassword,
          obscureConfirmPassword: current.obscureConfirmPassword,
        ),
      ),
      (_) => emit(const ResetPasswordSuccess()),
    );
  }
}
