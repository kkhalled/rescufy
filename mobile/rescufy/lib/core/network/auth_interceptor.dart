// lib/core/network/auth_interceptor.dart
import 'package:dio/dio.dart';
import 'package:rescufy/data/datasources/local/auth_local_datasource.dart';

class AuthInterceptor extends Interceptor {
  AuthInterceptor(this.authLocalDataSource);

  final AuthLocalDataSource authLocalDataSource;

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await authLocalDataSource.getToken();

    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    // Handle 401 Unauthorized - logout user
    if (err.response?.statusCode == 401) {
      // TODO: Clear token and navigate to login
    }
    handler.next(err);
  }
}
