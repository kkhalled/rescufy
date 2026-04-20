import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:rescufy/data/mappers/user_role_mapper.dart';
import 'package:rescufy/domain/entities/user.dart';
import 'package:rescufy/domain/entities/user_role.dart';

class UserModel extends User {
  final String? token;

  const UserModel({
    required super.id,
    required super.email,
    required super.name,
    required super.role,
    super.phone,
    super.profileImage,
    super.createdAt,
    this.token,
  });

  factory UserModel.fromToken(String token) {
    final decodedToken = JwtDecoder.decode(token);
    return UserModel.fromMap(decodedToken, token: token);
  }

  factory UserModel.fromAuthResponse(Map<String, dynamic> response) {
    final token = response['token']?.toString();
    final userPayload = response['user'];

    if (token != null && token.isNotEmpty) {
      final decodedToken = JwtDecoder.decode(token);
      final mergedPayload = {
        ...decodedToken,
        if (userPayload is Map<String, dynamic>) ...userPayload,
      };

      return UserModel.fromMap(mergedPayload, token: token);
    }

    if (userPayload is Map<String, dynamic>) {
      return UserModel.fromMap(userPayload);
    }

    throw Exception('Invalid auth response: token was not provided.');
  }

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      UserModel.fromMap(json, token: json['token']?.toString());

  factory UserModel.fromMap(Map<String, dynamic> json, {String? token}) {
    final rawRole =
        json['role'] ??
        json['Role'] ??
        json['userRole'] ??
        json['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    return UserModel(
      id:
          json['id']?.toString() ??
          json['userId']?.toString() ??
          json['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
              ?.toString() ??
          '',
      email:
          json['email']?.toString() ??
          json['Email']?.toString() ??
          json['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
              ?.toString() ??
          '',
      name:
          json['name']?.toString() ??
          json['fullName']?.toString() ??
          json['FullName']?.toString() ??
          '',
      role: UserRoleMapper.fromBackend(rawRole?.toString()),
      phone: json['phone']?.toString() ?? json['phoneNumber']?.toString(),
      profileImage:
          json['profileImage']?.toString() ?? json['ProfileImage']?.toString(),
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString())
          : null,
      token: token,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'role': role.name,
      'phone': phone,
      'profileImage': profileImage,
      'createdAt': createdAt?.toIso8601String(),
      'token': token,
    };
  }

  // Helper to copy with new values
  UserModel copyWith({
    String? id,
    String? email,
    String? name,
    UserRole? role,
    String? phone,
    String? profileImage,
    DateTime? createdAt,
    String? token,
  }) {
    return UserModel(
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      role: role ?? this.role,
      phone: phone ?? this.phone,
      profileImage: profileImage ?? this.profileImage,
      createdAt: createdAt ?? this.createdAt,
      token: token ?? this.token,
    );
  }
}
