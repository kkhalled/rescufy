// lib/data/datasources/auth_remote_datasource.dart
import 'package:dio/dio.dart';
import '../../core/network/api_endpoints.dart';
import '../../core/network/dio_client.dart';
import '../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserModel> login({required String email, required String password});

  Future<UserModel> register({
    required String fullName,
    required String email,
    required String password,
    required String nationalId,
    required String phoneNumber,
    required int age,
    required String gender,
  });

  Future<void> logout();

  // ✅ NEW: Password Reset
  Future<String> forgotPassword({required String email});

  Future<void> verifyResetPasswordOtp({
    required String email,
    required String otp,
  });

  Future<void> resetPassword({
    required String email,
    required String otp,
    required String newPassword,
  });
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final DioClient dioClient;

  AuthRemoteDataSourceImpl(this.dioClient);

  @override
  Future<UserModel> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await dioClient.post(
        ApiEndpoints.login,
        data: {'email': email, 'password': password},
      );

      final token = response.data['token'];
      if (token != null) {
        return UserModel.fromToken(token);
      } else {
        throw Exception('No token received from server');
      }
    } on DioException {
      rethrow;
    }
  }

  @override
  Future<UserModel> register({
    required String fullName,
    required String email,
    required String password,
    required String nationalId,
    required String phoneNumber,
    required int age,
    required String gender,
  }) async {
    try {
      final response = await dioClient.post(
        ApiEndpoints.register,
        data: {
          'full_name': fullName,
          'email': email,
          'password': password,
          'national_id': nationalId,
          'phone_number': phoneNumber,
          'age': age,
          'gender': gender,
        },
      );

      if (response.data['token'] != null) {
        return UserModel.fromToken(response.data['token']);
      } else {
        throw Exception('Invalid response format');
      }
    } on DioException {
      rethrow;
    }
  }

  @override
  Future<void> logout() async {
    try {
      await dioClient.post(ApiEndpoints.logout);
    } on DioException {
      rethrow;
    }
  }

  // ✅ NEW: Forgot Password
  @override
  Future<String> forgotPassword({required String email}) async {
    try {
      final response = await dioClient.post(
        ApiEndpoints.forgotPassword,
        data: {'email': email},
      );

      // API might return a message
      return response.data['message'] ?? 'OTP sent to your email';
    } on DioException {
      rethrow;
    }
  }

  // ✅ NEW: Verify OTP
  @override
  Future<void> verifyResetPasswordOtp({
    required String email,
    required String otp,
  }) async {
    try {
      await dioClient.post(
        ApiEndpoints.verifyResetPasswordOtp,
        data: {'email': email, 'otp': otp},
      );
    } on DioException {
      rethrow;
    }
  }

  // ✅ NEW: Reset Password
  @override
  Future<void> resetPassword({
    required String email,
    required String otp,
    required String newPassword,
  }) async {
    try {
      await dioClient.post(
        ApiEndpoints.resetPassword,
        data: {'email': email, 'otp': otp, 'newPassword': newPassword},
      );
    } on DioException {
      rethrow;
    }
  }
}
