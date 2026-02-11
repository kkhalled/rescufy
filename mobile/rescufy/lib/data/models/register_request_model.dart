// lib/domain/entities/register_request_model.dart
import 'package:equatable/equatable.dart';

class RegisterRequestModel extends Equatable {
  final String fullName;
  final String email;
  final String password;
  final String nationalId;
  final String phoneNumber;
  final int age;
  final String gender;

  const RegisterRequestModel({
    required this.fullName,
    required this.email,
    required this.password,
    required this.nationalId,
    required this.phoneNumber,
    required this.age,
    required this.gender,
  });

  @override
  List<Object?> get props => [
    fullName,
    email,
    password,
    nationalId,
    phoneNumber,
    age,
    gender,
  ];
}
