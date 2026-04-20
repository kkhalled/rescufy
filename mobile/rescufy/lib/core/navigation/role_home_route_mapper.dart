import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:rescufy/domain/entities/user_role.dart';

class RoleHomeRouteMapper {
  const RoleHomeRouteMapper._();

  static String fromRole(UserRole role) {
    switch (role) {
      case UserRole.paramedic:
        return AppRoutes.paramedicShell;
      case UserRole.user:
        return AppRoutes.userHome;
    }
  }
}
