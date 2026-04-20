// lib/data/datasources/auth_remote_datasource.dart
import 'package:dio/dio.dart';
import '../../../core/network/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import '../../models/register_request_model.dart';
import '../../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserModel> login({required String email, required String password});

  Future<UserModel> register({
    required String name,
    required String email,
    required String userName,
    required String password,
    required String nationalId,
    required int age,
    required String gender,
    String? profileImagePath,
  });

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
        return UserModel.fromAuthResponse(
          Map<String, dynamic>.from(response.data),
        );
      } else {
        throw Exception('No token received from server');
      }
    } on DioException {
      rethrow;
    }
  }

  @override
  Future<UserModel> register({
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
      final request = RegisterRequestModel(
        name: name,
        email: email,
        userName: userName,
        password: password,
        nationalId: nationalId,
        age: age,
        gender: gender,
        profileImagePath: profileImagePath,
      );

      final response = await dioClient.post(
        ApiEndpoints.register,
        data: request.toJson(),
      );

      if (response.data is Map<String, dynamic>) {
        return UserModel.fromAuthResponse(
          Map<String, dynamic>.from(response.data),
        );
      }

      throw Exception('Invalid response format');
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
