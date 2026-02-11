// lib/core/network/network_exceptions.dart
import 'package:dio/dio.dart';
import '../../domain/core/failures.dart';

class NetworkExceptions {
  static Failure handleDioException(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const NetworkFailure('Connection timeout');

      case DioExceptionType.badResponse:
        return _handleStatusCode(error.response?.statusCode);

      case DioExceptionType.cancel:
        return const NetworkFailure('Request cancelled');

      case DioExceptionType.connectionError:
        return const NetworkFailure('No internet connection');

      case DioExceptionType.unknown:
        return const NetworkFailure('Something went wrong');

      default:
        return const NetworkFailure('Unexpected error occurred');
    }
  }

  static Failure _handleStatusCode(int? statusCode) {
    switch (statusCode) {
      case 400:
        return const ServerFailure('Bad request');
      case 401:
        return const ServerFailure('Unauthorized');
      case 403:
        return const ServerFailure('Forbidden');
      case 404:
        return const ServerFailure('Not found');
      case 500:
        return const ServerFailure('Internal server error');
      case 503:
        return const ServerFailure('Service unavailable');
      default:
        return ServerFailure('Error occurred: $statusCode');
    }
  }
}
