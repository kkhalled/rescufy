import 'package:equatable/equatable.dart';
import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:rescufy/domain/entities/user.dart';

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {
  const AuthInitial();
}

class AuthLoading extends AuthState {
  const AuthLoading();
}

class AuthAuthenticated extends AuthState {
  final User user;
  final String route;

  const AuthAuthenticated({required this.user, required this.route});

  @override
  List<Object?> get props => [user, route];
}

class AuthUnauthenticated extends AuthState {
  final String route;

  const AuthUnauthenticated({this.route = AppRoutes.login});

  @override
  List<Object?> get props => [route];
}

class AuthFailure extends AuthState {
  final String message;

  const AuthFailure(this.message);

  @override
  List<Object?> get props => [message];
}
