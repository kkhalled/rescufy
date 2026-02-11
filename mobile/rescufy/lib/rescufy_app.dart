// lib/rescufy_app.dart
import 'package:flutter/material.dart';
import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'core/navigation/app_router.dart';
import 'core/theme/app_theme.dart';

class RescufyApp extends StatelessWidget {
  const RescufyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(375, 812),
      minTextAdapt: true,
      splitScreenMode: true,
      child: MaterialApp(
        title: 'Rescufy',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system,
        initialRoute: AppRoutes.splash,
        onGenerateRoute: AppRouter().generateRoute, // ✅ Create instance here
      ),
    );
  }
}
