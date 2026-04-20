// lib/rescufy_app.dart
import 'package:flutter/material.dart';
import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'core/navigation/app_router.dart';
import 'core/theme/app_theme.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rescufy/core/cubit/theme/theme_cubit.dart';
import 'package:rescufy/core/cubit/theme/theme_state.dart';
import 'package:rescufy/core/cubit/locale/locale_cubit.dart';
import 'package:rescufy/core/cubit/locale/locale_state.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:rescufy/l10n/app_localizations.dart';

class RescufyApp extends StatelessWidget {
  const RescufyApp({super.key, required AppRouter appRouter});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(375, 812),
      minTextAdapt: true,
      splitScreenMode: true,
      child: BlocBuilder<LocaleCubit, LocaleState>(
        builder: (context, localeState) {
          return BlocBuilder<ThemeCubit, ThemeState>(
            builder: (context, themeState) {
              return MaterialApp(
                title: 'Rescufy',
                debugShowCheckedModeBanner: false,

                // Localization delegates
                localizationsDelegates: const [
                  AppLocalizations.delegate,
                  GlobalMaterialLocalizations.delegate,
                  GlobalWidgetsLocalizations.delegate,
                  GlobalCupertinoLocalizations.delegate,
                ],

                // Supported locales
                supportedLocales: const [
                  Locale('en'), // English
                  Locale('ar'), // Arabic
                ],

                // Current locale from cubit
                locale: localeState.locale,

                theme: AppTheme.lightTheme,
                darkTheme: AppTheme.darkTheme,
                themeMode: themeState.themeMode,
                initialRoute: AppRoutes.splash,
                onGenerateRoute: AppRouter().generateRoute,
              );
            },
          );
        },
      ),
    );
  }
}
