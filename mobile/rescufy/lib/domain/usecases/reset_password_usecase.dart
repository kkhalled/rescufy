// lib/domain/usecases/reset_password_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../core/failures.dart';
import '../core/usecase.dart';
import '../repositories/auth_repository.dart';

class ResetPasswordUseCase implements UseCase<void, ResetPasswordParams> {
  final AuthRepository repository;

  ResetPasswordUseCase(this.repository);

  @override
  Future<Either<Failure, void>> call(ResetPasswordParams params) async {
    if (params.email.isEmpty) {
      return const Left(ValidationFailure('Email is required'));
    }

    if (params.otp.isEmpty) {
      return const Left(ValidationFailure('OTP is required'));
    }

    if (params.newPassword.isEmpty) {
      return const Left(ValidationFailure('New password is required'));
    }

    if (params.newPassword.length < 6) {
      return const Left(
        ValidationFailure('Password must be at least 6 characters'),
      );
    }

    if (params.newPassword != params.confirmPassword) {
      return const Left(ValidationFailure('Passwords do not match'));
    }

    return await repository.resetPassword(
      email: params.email,
      otp: params.otp,
      newPassword: params.newPassword,
    );
  }
}

class ResetPasswordParams extends Equatable {
  final String email;
  final String otp;
  final String newPassword;
  final String confirmPassword;

  const ResetPasswordParams({
    required this.email,
    required this.otp,
    required this.newPassword,
    required this.confirmPassword,
  });

  @override
  List<Object> get props => [email, otp, newPassword, confirmPassword];
}
