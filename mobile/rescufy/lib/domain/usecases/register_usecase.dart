// lib/domain/usecases/register_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../core/failures.dart';
import '../core/usecase.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class RegisterUseCase implements UseCase<User, RegisterParams> {
  final AuthRepository repository;

  RegisterUseCase(this.repository);

  @override
  Future<Either<Failure, User>> call(RegisterParams params) async {
    // Validation
    if (params.fullName.isEmpty) {
      return const Left(ValidationFailure('Full name is required'));
    }

    if (params.email.isEmpty) {
      return const Left(ValidationFailure('Email is required'));
    }

    if (!_isValidEmail(params.email)) {
      return const Left(ValidationFailure('Invalid email format'));
    }

    if (params.password.isEmpty) {
      return const Left(ValidationFailure('Password is required'));
    }

    if (params.password.length < 6) {
      return const Left(
        ValidationFailure('Password must be at least 6 characters'),
      );
    }

    if (params.password != params.confirmPassword) {
      return const Left(ValidationFailure('Passwords do not match'));
    }

    if (params.nationalId.isEmpty) {
      return const Left(ValidationFailure('National ID is required'));
    }

    if (params.phoneNumber.isEmpty) {
      return const Left(ValidationFailure('Phone number is required'));
    }

    if (params.age < 18) {
      return const Left(ValidationFailure('You must be at least 18 years old'));
    }

    if (params.gender.isEmpty) {
      return const Left(ValidationFailure('Please select your gender'));
    }

    return await repository.register(
      fullName: params.fullName,
      email: params.email,
      password: params.password,
      nationalId: params.nationalId,
      phoneNumber: params.phoneNumber,
      age: params.age,
      gender: params.gender,
    );
  }

  bool _isValidEmail(String email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  }
}

class RegisterParams extends Equatable {
  final String fullName;
  final String email;
  final String password;
  final String confirmPassword;
  final String nationalId;
  final String phoneNumber;
  final int age;
  final String gender;

  const RegisterParams({
    required this.fullName,
    required this.email,
    required this.password,
    required this.confirmPassword,
    required this.nationalId,
    required this.phoneNumber,
    required this.age,
    required this.gender,
  });

  @override
  List<Object> get props => [
    fullName,
    email,
    password,
    confirmPassword,
    nationalId,
    phoneNumber,
    age,
    gender,
  ];
}
