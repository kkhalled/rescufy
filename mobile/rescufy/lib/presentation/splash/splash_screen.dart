import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rescufy/presentation/auth/cubit/auth/auth_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/auth/auth_state.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AuthCubit>().restoreSession();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocListener<AuthCubit, AuthState>(
        listener: (context, state) {
          if (state is AuthAuthenticated) {
            Navigator.pushReplacementNamed(context, state.route);
          } else if (state is AuthUnauthenticated) {
            Navigator.pushReplacementNamed(context, state.route);
          }
        },
        child: const Center(child: CircularProgressIndicator()),
      ),
    );
  }
}
