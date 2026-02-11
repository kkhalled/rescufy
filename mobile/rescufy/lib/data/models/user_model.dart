// lib/data/models/user_model.dart

import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:rescufy/domain/entities/user.dart';

class UserModel extends User {
  final String? token;

  const UserModel({
    required super.id,
    required super.email,
    required super.name,
    this.token,
  });

  factory UserModel.fromToken(String token) {
    try {
      Map<String, dynamic> decodedToken = JwtDecoder.decode(token);

      return UserModel(
        id:
            decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ??
            '',
        email:
            decodedToken['Email'] ??
            decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
            '',
        name: decodedToken['FullName'] ?? '',
        token: token,
      );
    } catch (e) {
      throw Exception('Failed to decode token: $e');
    }
  }
  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id']?.toString() ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? json['fullName'] ?? '',
      token: json['token'],
    );
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'email': email, 'name': name, 'token': token};
  }
}
