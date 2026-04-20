import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:rescufy/core/theme/colors.dart';
import 'package:rescufy/l10n/app_localizations.dart';
import '../cubit/auth/auth_cubit.dart';
import '../cubit/auth/auth_state.dart';
import '../cubit/login/login_cubit.dart';
import '../cubit/login/login_state.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      backgroundColor: colorScheme.primary,
      body: BlocListener<AuthCubit, AuthState>(
        listener: (context, state) {
          if (state is AuthAuthenticated) {
            Navigator.pushReplacementNamed(context, state.route);
          } else if (state is AuthFailure) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Theme.of(context).colorScheme.error,
              ),
            );
          }
        },
        child: BlocBuilder<LoginCubit, LoginState>(
          builder: (context, loginState) {
            final cubit = context.read<LoginCubit>();
            return SafeArea(
              child: SingleChildScrollView(
                padding: EdgeInsets.all(24.w),
                child: Column(
                  children: [
                    SizedBox(height: 20.h),
                    Text(
                      l10n.accountLoginForm,
                      style: textTheme.titleMedium?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                    SizedBox(height: 40.h),
                    Container(
                      width: 100.w,
                      height: 100.h,
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(16.r),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 20,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: SvgPicture.asset(
                        'assets/svgs/logo4.svg',
                        height: 50.h,
                        width: 50.w,
                        color: colorScheme.background,
                      ),
                    ),
                    SizedBox(height: 40.h),
                    Container(
                      padding: EdgeInsets.all(28.w),
                      decoration: BoxDecoration(
                        color: theme.cardTheme.color,
                        borderRadius: BorderRadius.circular(20.r),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.15),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            l10n.signInToAccount,
                            style: textTheme.headlineMedium,
                          ),
                          SizedBox(height: 28.h),
                          TextFormField(
                            initialValue: loginState.email,
                            onChanged: cubit.onEmailChanged,
                            keyboardType: TextInputType.emailAddress,
                            style: textTheme.bodyLarge,
                            decoration: InputDecoration(
                              labelText: l10n.email,
                              hintText: l10n.emailHint,
                              errorText: loginState.emailError,
                              prefixIcon: Icon(
                                Icons.email_outlined,
                                size: 22.sp,
                              ),
                            ),
                          ),
                          SizedBox(height: 20.h),
                          TextFormField(
                            initialValue: loginState.password,
                            onChanged: cubit.onPasswordChanged,
                            obscureText: loginState.obscurePassword,
                            style: textTheme.bodyLarge,
                            decoration: InputDecoration(
                              labelText: l10n.password,
                              hintText: l10n.enterPassword,
                              errorText: loginState.passwordError,
                              prefixIcon: Icon(
                                Icons.lock_outline_rounded,
                                size: 22.sp,
                              ),
                              suffixIcon: IconButton(
                                icon: Icon(
                                  loginState.obscurePassword
                                      ? Icons.visibility_outlined
                                      : Icons.visibility_off_outlined,
                                  size: 22.sp,
                                ),
                                onPressed: cubit.togglePasswordVisibility,
                              ),
                            ),
                          ),
                          SizedBox(height: 16.h),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  SizedBox(
                                    width: 24.w,
                                    height: 24.h,
                                    child: Checkbox(
                                      value: loginState.rememberMe,
                                      onChanged: cubit.toggleRememberMe,
                                      materialTapTargetSize:
                                          MaterialTapTargetSize.shrinkWrap,
                                      visualDensity: VisualDensity.compact,
                                    ),
                                  ),
                                  SizedBox(width: 8.w),
                                  Text(
                                    l10n.rememberMe,
                                    style: textTheme.bodyMedium,
                                  ),
                                ],
                              ),
                              TextButton(
                                onPressed: () {
                                  Navigator.pushNamed(
                                    context,
                                    AppRoutes.forgotPassword,
                                  );
                                },
                                style: TextButton.styleFrom(
                                  padding: EdgeInsets.zero,
                                  minimumSize: const Size(0, 0),
                                  tapTargetSize:
                                      MaterialTapTargetSize.shrinkWrap,
                                ),
                                child: Text(
                                  l10n.forgotPassword,
                                  style: textTheme.bodyMedium?.copyWith(
                                    color: colorScheme.primary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 28.h),
                          BlocBuilder<AuthCubit, AuthState>(
                            builder: (context, authState) {
                              final isLoading = authState is AuthLoading;
                              return SizedBox(
                                width: double.infinity,
                                height: 56.h,
                                child: ElevatedButton(
                                  onPressed: isLoading
                                      ? null
                                      : () {
                                          if (!cubit.validate()) {
                                            return;
                                          }

                                          context.read<AuthCubit>().login(
                                            email: loginState.email.trim(),
                                            password: loginState.password
                                                .trim(),
                                          );
                                        },
                                  child: isLoading
                                      ? SizedBox(
                                          width: 24.w,
                                          height: 24.h,
                                          child:
                                              const CircularProgressIndicator(
                                                color: Colors.white,
                                                strokeWidth: 2.5,
                                              ),
                                        )
                                      : Text(
                                          l10n.logIn,
                                          style: textTheme.labelLarge?.copyWith(
                                            fontSize: 16.sp,
                                            fontWeight: FontWeight.w600,
                                            color: Colors.white,
                                          ),
                                        ),
                                ),
                              );
                            },
                          ),
                          SizedBox(height: 20.h),
                          Center(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  l10n.dontHaveAccount,
                                  style: textTheme.bodyMedium,
                                ),
                                TextButton(
                                  onPressed: () {
                                    Navigator.pushNamed(
                                      context,
                                      AppRoutes.signup,
                                    );
                                  },
                                  style: TextButton.styleFrom(
                                    padding: EdgeInsets.zero,
                                    minimumSize: const Size(0, 0),
                                    tapTargetSize:
                                        MaterialTapTargetSize.shrinkWrap,
                                  ),
                                  child: Text(
                                    l10n.createAccount,
                                    style: textTheme.bodyMedium?.copyWith(
                                      color: colorScheme.primary,
                                      fontWeight: FontWeight.w700,
                                      decoration: TextDecoration.underline,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
