import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:rescufy/core/navigation/role_home_route_mapper.dart';
import 'package:rescufy/domain/entities/user.dart';
import 'package:rescufy/domain/repositories/auth_repository.dart';
import 'auth_state.dart';

class AuthCubit extends Cubit<AuthState> {
  AuthCubit({required AuthRepository authRepository})
    : _authRepository = authRepository,
      super(const AuthInitial());

  final AuthRepository _authRepository;
  User? _currentUser;

  User? get currentUser => _currentUser;

  Future<void> restoreSession() async {
    emit(const AuthLoading());

    final result = await _authRepository.restoreSession();
    result.fold((_) {
      _clearSession();
      emit(const AuthUnauthenticated(route: AppRoutes.login));
    }, _emitAuthenticatedUser);
  }

  Future<void> login({required String email, required String password}) async {
    emit(const AuthLoading());

    final result = await _authRepository.login(
      email: email.trim(),
      password: password.trim(),
    );

    result.fold((failure) {
      _clearSession();
      emit(AuthFailure(failure.message));
    }, _emitAuthenticatedUser);
  }

  Future<void> register({
    required String name,
    required String email,
    required String userName,
    required String password,
    required String nationalId,
    required int age,
    required String gender,
    String? profileImagePath,
  }) async {
    emit(const AuthLoading());

    final result = await _authRepository.register(
      name: name.trim(),
      email: email.trim(),
      userName: userName.trim(),
      password: password.trim(),
      nationalId: nationalId.trim(),
      age: age,
      gender: gender,
      profileImagePath: profileImagePath,
    );

    result.fold((failure) {
      _clearSession();
      emit(AuthFailure(failure.message));
    }, _emitAuthenticatedUser);
  }

  Future<void> logout() async {
    emit(const AuthLoading());

    final result = await _authRepository.logout();
    result.fold((failure) => emit(AuthFailure(failure.message)), (_) {
      _clearSession();
      emit(const AuthUnauthenticated(route: AppRoutes.login));
    });
  }

  void _clearSession() {
    _currentUser = null;
  }

  void _emitAuthenticatedUser(User user) {
    _currentUser = user;
    emit(
      AuthAuthenticated(
        user: user,
        route: RoleHomeRouteMapper.fromRole(user.role),
      ),
    );
  }
}
