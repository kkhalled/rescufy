// lib/data/repositories/auth_repository_impl.dart
import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../domain/core/failures.dart';
import '../../core/network/network_exceptions.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/remote/auth_remote_datasource.dart';
import '../datasources/local/auth_local_datasource.dart';
import '../models/user_model.dart';

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
      final userModel = await remoteDataSource.login(
        email: email,
        password: password,
      );

      // Save token and user data
      if (userModel.token != null) {
        await localDataSource.saveToken(userModel.token!);
        await localDataSource.saveUser(
          userModel,
        ); // Fixed: was using undefined 'userModel'
      }

      return Right(userModel);
    } on DioException catch (e) {
      return Left(NetworkExceptions.handleDioException(e));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, User>> register({
    required String name,
    required String email,
    required String userName,
    required String password,
    required String nationalId,
    required int age,
    required String gender,
    String? profileImagePath,
  }) async {
    try {
      final userModel = await remoteDataSource.register(
        name: name,
        email: email,
        userName: userName,
        password: password,
        nationalId: nationalId,
        age: age,
        gender: gender,
        profileImagePath: profileImagePath,
      );

      // Save token and user data
      if (userModel.token != null) {
        await localDataSource.saveToken(userModel.token!);
        await localDataSource.saveUser(userModel);
      }

      return Right(userModel);
    } on DioException catch (e) {
      return Left(NetworkExceptions.handleDioException(e));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      await localDataSource.deleteToken();
      await localDataSource.deleteUser();
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, User>> restoreSession() async {
    try {
      final token = await localDataSource.getToken();
      if (token == null || token.isEmpty) {
        return const Left(CacheFailure('No active session found'));
      }

      final userModel = UserModel.fromToken(token);
      await localDataSource.saveUser(userModel);

      return Right(userModel);
    } catch (_) {
      await localDataSource.deleteToken();
      await localDataSource.deleteUser();
      return const Left(CacheFailure('Session restoration failed'));
    }
  }

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
