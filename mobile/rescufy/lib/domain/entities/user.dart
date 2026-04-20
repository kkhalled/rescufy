import 'package:equatable/equatable.dart';
import 'user_role.dart';

class User extends Equatable {
  final String id;
  final String email;
  final String name;
  final UserRole role;
  final String? phone;
  final String? profileImage;
  final DateTime? createdAt;

  const User({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    this.phone,
    this.profileImage,
    this.createdAt,
  });

  // Role helpers
  bool get isParamedic => role.isParamedic;
  bool get isUser => role.isUser;
  bool get canLoginFromMobile => role.canLoginFromMobile;

  @override
  List<Object?> get props => [
    id,
    email,
    name,
    role,
    phone,
    profileImage,
    createdAt,
  ];
}
