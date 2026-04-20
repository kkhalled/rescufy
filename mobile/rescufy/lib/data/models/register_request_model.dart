// lib/domain/entities/register_request_model.dart
import 'package:equatable/equatable.dart';

class RegisterRequestModel extends Equatable {
  final String name;
  final String email;
  final String userName;
  final String password;
  final String nationalId;
  final int age;
  final String gender;
  final String? profileImagePath;

  const RegisterRequestModel({
    required this.name,
    required this.email,
    required this.userName,
    required this.password,
    required this.nationalId,
    required this.age,
    required this.gender,
    this.profileImagePath,
  });

  Map<String, dynamic> toJson() {
    return {
      'Name': name,
      'Email': email,
      'UserName': userName,
      'Password': password,
      'NationalId': nationalId,
      'Gender': gender,
      'Age': age,
      if (profileImagePath != null && profileImagePath!.isNotEmpty)
        'ProfileImage': profileImagePath,
    };
  }

  @override
  List<Object?> get props => [
    name,
    email,
    userName,
    password,
    nationalId,
    age,
    gender,
    profileImagePath,
  ];
}
