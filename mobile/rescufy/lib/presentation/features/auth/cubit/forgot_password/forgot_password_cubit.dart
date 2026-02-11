import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../domain/usecases/forgot_password_usecase.dart';
import 'forgot_password_state.dart';

class ForgotPasswordCubit extends Cubit<ForgotPasswordState> {
  final ForgotPasswordUseCase forgotPasswordUseCase;

  ForgotPasswordCubit(this.forgotPasswordUseCase)
    : super(const ForgotPasswordInitial());

  Future<void> sendOtp(String email) async {
    emit(const ForgotPasswordLoading());

    final result = await forgotPasswordUseCase(
      ForgotPasswordParams(email: email),
    );

    result.fold(
      (failure) => emit(ForgotPasswordFailure(failure.message)),
      (message) => emit(ForgotPasswordSuccess(message, email)),
    );
  }
}
