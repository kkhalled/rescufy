import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Core
import 'package:rescufy/core/network/dio_client.dart';

// Data
import 'package:rescufy/data/datasources/auth_remote_datasource.dart';
import 'package:rescufy/data/datasources/local/auth_local_datasource.dart';
import 'package:rescufy/data/repositories/auth_repository_impl.dart';

// Domain
import 'package:rescufy/domain/repositories/auth_repository.dart';
import 'package:rescufy/domain/usecases/login_usecase.dart';
import 'package:rescufy/domain/usecases/register_usecase.dart';
import 'package:rescufy/domain/usecases/forgot_password_usecase.dart';
import 'package:rescufy/domain/usecases/verify_reset_otp_usecase.dart';
import 'package:rescufy/domain/usecases/reset_password_usecase.dart';

// Presentation (Cubits)
import 'package:rescufy/presentation/features/auth/cubit/login/login_cubit.dart';
import 'package:rescufy/presentation/features/auth/cubit/register/register_cubit.dart';
import 'package:rescufy/presentation/features/auth/cubit/forgot_password/forgot_password_cubit.dart';
import 'package:rescufy/presentation/features/auth/cubit/reset_password/reset_password_cubit.dart';
import 'package:rescufy/presentation/features/auth/cubit/reset_password/reset_password_cubit.dart';

import '../../presentation/features/auth/cubit/verify_reset_otp/verify_reset_otp_cubit.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // =============================
  // External
  // =============================
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);
  sl.registerLazySingleton(() => Dio());
  sl.registerLazySingleton(() => DioClient(sl()));

  // =============================
  // Data sources
  // =============================
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(sl()),
  );

  sl.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSourceImpl(sl()),
  );

  // =============================
  // Repository
  // =============================
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(sl(), sl()),
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
  // Cubits (FACTORY, not singleton)
  // =============================
  sl.registerFactory(() => LoginCubit(sl()));
  sl.registerFactory(() => RegisterCubit(sl()));

  sl.registerFactory(() => ForgotPasswordCubit(sl()));
  sl.registerFactory(() => VerifyResetOtpCubit(sl()));
  sl.registerFactory(() => ResetPasswordCubit(sl()));
}
