// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rescufy/core/cubit/theme/theme_cubit.dart';
import 'package:rescufy/core/cubit/locale/locale_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/auth/auth_cubit.dart';

import 'package:rescufy/core/di/injection_container.dart' as di;
import 'package:rescufy/core/navigation/app_router.dart';

import 'package:rescufy/rescufy_app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize dependency injection
  await di.init();

  runApp(
    MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => di.sl<ThemeCubit>()),
        BlocProvider(create: (_) => di.sl<LocaleCubit>()),
        BlocProvider(create: (_) => di.sl<AuthCubit>()),
      ],
      child: RescufyApp(appRouter: AppRouter()),
    ),
  );
}
