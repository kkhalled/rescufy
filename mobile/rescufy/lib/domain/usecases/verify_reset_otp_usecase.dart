// lib/domain/usecases/verify_reset_otp_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../core/failures.dart';
import '../core/usecase.dart';
import '../repositories/auth_repository.dart';

class VerifyResetOtpUseCase implements UseCase<void, VerifyResetOtpParams> {
  final AuthRepository repository;

  VerifyResetOtpUseCase(this.repository);

  @override
  Future<Either<Failure, void>> call(VerifyResetOtpParams params) async {
    if (params.email.isEmpty) {
      return const Left(ValidationFailure('Email is required'));
    }

    if (params.otp.isEmpty) {
      return const Left(ValidationFailure('OTP is required'));
    }

    if (params.otp.length != 6) {
      return const Left(ValidationFailure('OTP must be 6 digits'));
    }

    return await repository.verifyResetPasswordOtp(
      email: params.email,
      otp: params.otp,
    );
  }
}

class VerifyResetOtpParams extends Equatable {
  final String email;
  final String otp;

  const VerifyResetOtpParams({required this.email, required this.otp});

  @override
  List<Object> get props => [email, otp];
}
