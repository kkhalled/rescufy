// lib/data/datasources/local/auth_local_datasource.dart
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../models/user_model.dart';

abstract class AuthLocalDataSource {
  Future<void> saveToken(String token);
  Future<String?> getToken();
  Future<void> deleteToken();
  Future<void> saveUser(UserModel user);
  Future<UserModel?> getUser();
  Future<void> deleteUser();
}

class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  final FlutterSecureStorage secureStorage;

  AuthLocalDataSourceImpl(this.secureStorage);

  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';

  @override
  Future<void> saveToken(String token) async {
    await secureStorage.write(key: _tokenKey, value: token);
  }

  @override
  Future<String?> getToken() async {
    return secureStorage.read(key: _tokenKey);
  }

  @override
  Future<void> deleteToken() async {
    await secureStorage.delete(key: _tokenKey);
  }

  @override
  Future<void> saveUser(UserModel user) async {
    final userJson = jsonEncode(user.toJson());
    await secureStorage.write(key: _userKey, value: userJson);
  }

  @override
  Future<UserModel?> getUser() async {
    final userJson = await secureStorage.read(key: _userKey);
    if (userJson == null) return null;

    try {
      final userMap = jsonDecode(userJson) as Map<String, dynamic>;
      return UserModel.fromJson(userMap);
    } catch (e) {
      return null;
    }
  }

  @override
  Future<void> deleteUser() async {
    await secureStorage.delete(key: _userKey);
  }
}
