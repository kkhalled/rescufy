// lib/presentation/auth/views/login_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:rescufy/core/theme/colors.dart';
import 'package:rescufy/domain/entities/user_role.dart';
import 'package:rescufy/l10n/app_localizations.dart';
import '../cubit/login/login_cubit.dart';
import '../cubit/login/login_state.dart';
import '../widgets/admin_blocked_dialog.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final cubit = context.read<LoginCubit>();
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      backgroundColor: colorScheme.primary,
      body: BlocListener<LoginCubit, LoginState>(
        listener: (context, state) {
          if (state is LoginSuccess) {
            _navigateBasedOnRole(state.user.role);
          } else if (state is LoginError) {
            _showError(state.message);
          } else if (state is LoginAdminBlocked) {
            _showAdminBlockedDialog(state.message);
          }
        },
        child: SafeArea(
          child: SingleChildScrollView(
            padding: EdgeInsets.all(24.w),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  SizedBox(height: 20.h),

                  // Header Text
                  Text(
                    l10n.accountLoginForm,
                    style: textTheme.titleMedium?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w400,
                    ),
                  ),

                  SizedBox(height: 40.h),

                  // Logo Container
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

                  // Login Form Card
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
                        // Title
                        Text(
                          l10n.signInToAccount,
                          style: textTheme.headlineMedium,
                        ),

                        SizedBox(height: 28.h),

                        // Email Field
                        TextFormField(
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          style: textTheme.bodyLarge,
                          decoration: InputDecoration(
                            labelText: l10n.email,
                            hintText: l10n.emailHint,
                            prefixIcon: Icon(Icons.email_outlined, size: 22.sp),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return l10n.pleaseEnterEmail;
                            }
                            if (!RegExp(
                              r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
                            ).hasMatch(value)) {
                              return l10n.pleaseEnterValidEmail;
                            }
                            return null;
                          },
                        ),

                        SizedBox(height: 20.h),

                        // Password Field
                        StreamBuilder<bool>(
                          stream: cubit.obscurePasswordStream,
                          initialData: true,
                          builder: (context, snapshot) {
                            return TextFormField(
                              controller: _passwordController,
                              obscureText: snapshot.data ?? true,
                              style: textTheme.bodyLarge,
                              decoration: InputDecoration(
                                labelText: l10n.password,
                                hintText: l10n.enterPassword,
                                prefixIcon: Icon(
                                  Icons.lock_outline_rounded,
                                  size: 22.sp,
                                ),
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    snapshot.data ?? true
                                        ? Icons.visibility_outlined
                                        : Icons.visibility_off_outlined,
                                    size: 22.sp,
                                  ),
                                  onPressed: cubit.togglePasswordVisibility,
                                ),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return l10n.pleaseEnterPassword;
                                }
                                if (value.length < 6) {
                                  return l10n.passwordMinLength;
                                }
                                return null;
                              },
                            );
                          },
                        ),

                        SizedBox(height: 16.h),

                        // Remember Me & Forgot Password
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            StreamBuilder<bool>(
                              stream: cubit.rememberMeStream,
                              initialData: false,
                              builder: (context, snapshot) {
                                return Row(
                                  children: [
                                    SizedBox(
                                      width: 24.w,
                                      height: 24.h,
                                      child: Checkbox(
                                        value: snapshot.data ?? false,
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
                                );
                              },
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
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
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

                        // Login Button
                        BlocBuilder<LoginCubit, LoginState>(
                          builder: (context, state) {
                            final isLoading = state is LoginLoading;
                            return SizedBox(
                              width: double.infinity,
                              height: 56.h,
                              child: ElevatedButton(
                                onPressed: isLoading
                                    ? null
                                    : () {
                                        if (_formKey.currentState!.validate()) {
                                          cubit.login(
                                            _emailController.text.trim(),
                                            _passwordController.text.trim(),
                                          );
                                        }
                                      },
                                child: isLoading
                                    ? SizedBox(
                                        width: 24.w,
                                        height: 24.h,
                                        child: const CircularProgressIndicator(
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

                        // Sign Up Link
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
          ),
        ),
      ),
    );
  }

  void _navigateBasedOnRole(UserRole role) {
    final route = switch (role) {
      UserRole.paramedic => AppRoutes.paramedicShell,
      UserRole.user => AppRoutes.userHome,
      UserRole.admin => null,
    };

    if (route != null) {
      Navigator.pushReplacementNamed(context, route);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Theme.of(context).colorScheme.error,
      ),
    );
  }

  void _showAdminBlockedDialog(String message) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AdminBlockedDialog(message: message),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
