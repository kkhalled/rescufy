// lib/domain/repositories/auth_repository.dart
import 'package:dartz/dartz.dart';
import '../core/failures.dart';
import '../entities/user.dart';

abstract class AuthRepository {
  Future<Either<Failure, User>> login({
    required String email,
    required String password,
  });

  Future<Either<Failure, User>> register({
    required String name,
    required String email,
    required String userName,
    required String password,
    required String nationalId,
    required int age,
    required String gender,
    String? profileImagePath,
  });

  Future<Either<Failure, User>> restoreSession();

  Future<Either<Failure, void>> logout();

  // ✅ NEW: Forgot Password Flow
  Future<Either<Failure, String>> forgotPassword({required String email});

  Future<Either<Failure, void>> verifyResetPasswordOtp({
    required String email,
    required String otp,
  });

  Future<Either<Failure, void>> resetPassword({
    required String email,
    required String otp,
    required String newPassword,
  });
}
