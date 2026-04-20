// lib/core/di/injection_container.dart
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get_it/get_it.dart';
import 'package:rescufy/core/services/location_service.dart';
import 'package:rescufy/core/services/signalr/mock_signalr_service.dart';
import 'package:rescufy/core/services/signalr/signalr_service.dart';
import 'package:rescufy/presentation/paramedic/active_case/cubit/active_case_cubit.dart';
import 'package:rescufy/presentation/paramedic/dashboard/cubit/dashboard_cubit.dart';
import 'package:rescufy/presentation/paramedic/incoming_request/cubit/incoming_request_cubit.dart';
import 'package:rescufy/presentation/user/profile/cubit/profile_cubit.dart';
import 'package:rescufy/presentation/user/request/cubit/emergency_request_cubit.dart';
import 'package:shared_preferences/shared_preferences.dart';
// Core
import 'package:rescufy/core/network/dio_client.dart';
import 'package:rescufy/core/network/auth_interceptor.dart';

// Data
import 'package:rescufy/data/datasources/remote/auth_remote_datasource.dart';
import 'package:rescufy/data/datasources/local/auth_local_datasource.dart';
import 'package:rescufy/data/repositories/auth_repository_impl.dart';
import 'package:rescufy/data/datasources/remote/emergency_remote_datasource.dart'
    as user_ds;

// Domain
import 'package:rescufy/domain/repositories/auth_repository.dart';
import 'package:rescufy/domain/entities/incoming_request.dart';

// Presentation (Cubits)
import 'package:rescufy/presentation/auth/cubit/auth/auth_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/login/login_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/register/register_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/forgot_password/forgot_password_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/reset_password/reset_password_cubit.dart';
import 'package:rescufy/core/cubit/theme/theme_cubit.dart';
import 'package:rescufy/core/cubit/locale/locale_cubit.dart';

import '../../presentation/auth/cubit/verify_reset_otp/verify_reset_otp_cubit.dart';

import 'package:rescufy/data/repositories/emergency_repository_impl.dart';
import 'package:rescufy/domain/repositories/emergency_repository.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // =============================
  // External
  // =============================
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);
  sl.registerLazySingleton(() => const FlutterSecureStorage());
  sl.registerLazySingleton(() => Dio());
  sl.registerLazySingleton(() => AuthInterceptor(sl()));
  sl.registerLazySingleton(() => DioClient(sl(), sl()));
  sl.registerLazySingleton(() => LocationService());

  // =============================
  // SignalR
  // =============================
  //
  // TODO: When hub URL is confirmed, replace MockSignalRService with the real one:
  //
  //   sl.registerLazySingleton<SignalRService>(() {
  //     final token = sl<AuthLocalDataSource>().getToken() ?? '';
  //     return SignalRService(
  //       hubUrl: ApiEndpoints.signalRHubUrl,
  //       accessToken: token,
  //     );
  //   });
  //
  sl.registerLazySingleton<SignalRService>(() => MockSignalRService());

  // =============================
  // Data sources
  // =============================
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(sl()),
  );
  sl.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSourceImpl(sl()),
  );
  sl.registerLazySingleton<user_ds.EmergencyRemoteDataSource>(
    () => user_ds.EmergencyRemoteDataSourceImpl(sl()),
  );

  // sl.registerLazySingleton<ParamedicEmergencyRemoteDataSource>(
  //       () => paramedic_ds.ParamedicEmergencyRemoteDataSourceImpl(sl()),
  // );

  // =============================
  // Repository
  // =============================
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(sl(), sl()),
  );
  sl.registerLazySingleton<EmergencyRepository>(
    () => EmergencyRepositoryImpl(sl()),
  );
  // sl.registerLazySingleton<ParamedicEmergencyRepository>(
  //   () => ParamedicEmergencyRepositoryImpl(sl()),
  // );

  // =============================
  // Global Cubits (Singleton)
  // =============================
  sl.registerLazySingleton(() => ThemeCubit());
  sl.registerLazySingleton(() => LocaleCubit(sl()));
  sl.registerLazySingleton(() => AuthCubit(authRepository: sl()));

  // =============================
  // Cubits (FACTORY — one per route)
  // =============================
  sl.registerFactory(() => LoginCubit());
  sl.registerFactory(() => RegisterCubit());
  sl.registerFactory(() => ForgotPasswordCubit(sl<AuthRepository>()));
  sl.registerFactory(() => VerifyResetOtpCubit(sl<AuthRepository>()));
  sl.registerFactory(() => ResetPasswordCubit(sl<AuthRepository>()));
  sl.registerFactory(() => ProfileCubit(sl()));
  sl.registerFactory(() => EmergencyRequestCubit(sl(), sl()));

  // Paramedic Cubits
  sl.registerFactory(() => DashboardCubit(signalRService: sl()));
  sl.registerFactoryParam<IncomingRequestCubit, IncomingRequest, void>(
    (request, _) =>
        IncomingRequestCubit(request: request, signalRService: sl()),
  );
  sl.registerFactoryParam<ActiveCaseCubit, IncomingRequest, void>(
    (request, _) => ActiveCaseCubit(
      request: request,
      signalRService: sl(),
      locationService: sl(),
    ),
  );
}
