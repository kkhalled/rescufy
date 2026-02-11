// lib/data/repositories/auth_repository_impl.dart
import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../domain/core/failures.dart';
import '../../core/network/network_exceptions.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';
import '../datasources/local/auth_local_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;

  AuthRepositoryImpl(this.remoteDataSource, this.localDataSource);

  @override
  Future<Either<Failure, User>> login({
    required String email,
    required String password,
  }) async {
    try {
      final user = await remoteDataSource.login(
        email: email,
        password: password,
      );

      if (user.token != null) {
        await localDataSource.saveToken(user.token!);
      }

      return Right(user);
    } on DioException catch (e) {
      return Left(NetworkExceptions.handleDioException(e));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, User>> register({
    required String fullName,
    required String email,
    required String password,
    required String nationalId,
    required String phoneNumber,
    required int age,
    required String gender,
  }) async {
    try {
      final user = await remoteDataSource.register(
        fullName: fullName,
        email: email,
        password: password,
        nationalId: nationalId,
        phoneNumber: phoneNumber,
        age: age,
        gender: gender,
      );

      if (user.token != null) {
        await localDataSource.saveToken(user.token!);
      }

      return Right(user);
    } on DioException catch (e) {
      return Left(NetworkExceptions.handleDioException(e));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      await remoteDataSource.logout();
      await localDataSource.deleteToken();
      return const Right(null);
    } on DioException catch (e) {
      return Left(NetworkExceptions.handleDioException(e));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  // ✅ NEW: Forgot Password
  @override
  Future<Either<Failure, String>> forgotPassword({
    required String email,
  }) async {
    try {
      final message = await remoteDataSource.forgotPassword(email: email);
      return Right(message);
    } on DioException catch (e) {
      return Left(NetworkExceptions.handleDioException(e));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  // ✅ NEW: Verify OTP
  @override
  Future<Either<Failure, void>> verifyResetPasswordOtp({
    required String email,
    required String otp,
  }) async {
    try {
      await remoteDataSource.verifyResetPasswordOtp(email: email, otp: otp);
      return const Right(null);
    } on DioException catch (e) {
      return Left(NetworkExceptions.handleDioException(e));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  // ✅ NEW: Reset Password
  @override
  Future<Either<Failure, void>> resetPassword({
    required String email,
    required String otp,
    required String newPassword,
  }) async {
    try {
      await remoteDataSource.resetPassword(
        email: email,
        otp: otp,
        newPassword: newPassword,
      );
      return const Right(null);
    } on DioException catch (e) {
      return Left(NetworkExceptions.handleDioException(e));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }
}
