import 'package:rescufy/domain/entities/user_role.dart';

class UserRoleMapper {
  const UserRoleMapper._();

  static UserRole fromBackend(
    String? role, {
    UserRole fallback = UserRole.user,
  }) {
    switch (role?.trim().toLowerCase()) {
      case 'user':
        return UserRole.user;
      case 'ambulancedriver':
      case 'paramedic':
        return UserRole.paramedic;
      default:
        return fallback;
    }
  }
}
