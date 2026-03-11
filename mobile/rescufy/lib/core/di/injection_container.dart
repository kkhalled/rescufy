// lib/core/di/injection_container.dart
import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import 'package:rescufy/core/services/location_service.dart';
import 'package:rescufy/presentation/user/profile/cubit/profile_cubit.dart';
import 'package:rescufy/presentation/user/request/cubit/emergency_request_cubit.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Core
import 'package:rescufy/core/network/dio_client.dart';

// Data
import 'package:rescufy/data/datasources/remote/auth_remote_datasource.dart';
import 'package:rescufy/data/datasources/local/auth_local_datasource.dart';
import 'package:rescufy/data/repositories/auth_repository_impl.dart';

// Domain
import 'package:rescufy/domain/repositories/auth_repository.dart';
import 'package:rescufy/domain/usecases/auth/login_usecase.dart';
import 'package:rescufy/domain/usecases/auth/register_usecase.dart';
import 'package:rescufy/domain/usecases/auth/forgot_password_usecase.dart';
import 'package:rescufy/domain/usecases/auth/verify_reset_otp_usecase.dart';
import 'package:rescufy/domain/usecases/auth/reset_password_usecase.dart';

// Presentation (Cubits)
import 'package:rescufy/presentation/auth/cubit/login/login_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/register/register_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/forgot_password/forgot_password_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/reset_password/reset_password_cubit.dart';
import 'package:rescufy/core/cubit/theme/theme_cubit.dart';
import 'package:rescufy/core/cubit/locale/locale_cubit.dart';

import '../../presentation/auth/cubit/verify_reset_otp/verify_reset_otp_cubit.dart';

import 'package:rescufy/data/datasources/remote/emergency_remote_datasource.dart';
import 'package:rescufy/data/repositories/emergency_repository_impl.dart';
import 'package:rescufy/domain/repositories/emergency_repository.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // =============================
  // External
  // =============================
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);
  sl.registerLazySingleton(() => Dio());
  sl.registerLazySingleton(() => DioClient(sl()));
  sl.registerLazySingleton(() => LocationService());

  // =============================
  // Data sources
  // =============================
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(sl()),
  );

  sl.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSourceImpl(sl()),
  );
  sl.registerLazySingleton<EmergencyRemoteDataSource>(
    () => EmergencyRemoteDataSourceImpl(sl()),
  );

  // =============================
  // Repository
  // =============================
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(sl(), sl()),
  );
  sl.registerLazySingleton<EmergencyRepository>(
    () => EmergencyRepositoryImpl(sl()),
  );

  // =============================
  // Use cases
  // =============================
  sl.registerLazySingleton(() => LoginUseCase(sl()));
  sl.registerLazySingleton(() => RegisterUseCase(sl()));
  sl.registerLazySingleton(() => ForgotPasswordUseCase(sl()));
  sl.registerLazySingleton(() => VerifyResetOtpUseCase(sl()));
  sl.registerLazySingleton(() => ResetPasswordUseCase(sl()));

  // =============================
  // Global Cubits (Singleton)
  // =============================
  sl.registerLazySingleton(() => ThemeCubit());
  sl.registerLazySingleton(() => LocaleCubit(sl()));

  // =============================
  // Cubits (FACTORY, not singleton)
  // =============================
  sl.registerFactory(() => LoginCubit(sl()));
  sl.registerFactory(() => RegisterCubit(sl()));

  sl.registerFactory(() => ForgotPasswordCubit(sl()));
  sl.registerFactory(() => VerifyResetOtpCubit(sl()));
  sl.registerFactory(() => ResetPasswordCubit(sl()));

  sl.registerFactory(() => ProfileCubit(sl()));
  sl.registerFactory(() => EmergencyRequestCubit(sl(), sl()));
}
