import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../domain/usecases/verify_reset_otp_usecase.dart';
import 'verify_reset_otp_state.dart';

class VerifyResetOtpCubit extends Cubit<VerifyResetOtpState> {
  final VerifyResetOtpUseCase verifyOtpUseCase;

  VerifyResetOtpCubit(this.verifyOtpUseCase)
    : super(const VerifyResetOtpInitial());

  Future<void> verifyResetOtp(String email, String otp) async {
    emit(VerifyResetOtpLoading(email));

    final result = await verifyOtpUseCase(
      VerifyResetOtpParams(email: email, otp: otp),
    );

    result.fold(
      (failure) => emit(VerifyResetOtpFailure(failure.message, email)),
      (_) => emit(VerifyResetOtpSuccess(email, otp)),
    );
  }
}
