// lib/presentation/features/auth/views/reset_password_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/presentation/auth/cubit/reset_password/reset_password_cubit.dart';

class ResetPasswordScreen extends StatefulWidget {
  const ResetPasswordScreen({super.key});

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final args =
          ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
      context.read<ResetPasswordCubit>().initialize(
        context: context,
        formKey: _formKey,
        email: args['email'],
        otp: args['otp'],
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final cubit = context.read<ResetPasswordCubit>();

    return Scaffold(
      appBar: AppBar(title: const Text('Reset Password')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 24.w, vertical: 32.h),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Icon Container
                Center(
                  child: Container(
                    width: 120.w,
                    height: 120.h,
                    decoration: BoxDecoration(
                      color: colorScheme.primary.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.lock_open_rounded,
                      size: 60.sp,
                      color: colorScheme.primary,
                    ),
                  ),
                ),

                SizedBox(height: 40.h),

                // Title
                Text('Create New Password', style: textTheme.displaySmall),

                SizedBox(height: 12.h),

                // Description
                Text(
                  'Your new password must be different from previously used passwords.',
                  style: textTheme.bodyLarge?.copyWith(
                    color: textTheme.bodySmall?.color,
                    height: 1.5,
                  ),
                ),

                SizedBox(height: 40.h),

                // New Password Field
                StreamBuilder<bool>(
                  stream: cubit.obscurePasswordStream,
                  initialData: true,
                  builder: (context, snapshot) {
                    return TextFormField(
                      controller: _newPasswordController,
                      obscureText: snapshot.data ?? true,
                      style: textTheme.bodyLarge,
                      decoration: InputDecoration(
                        labelText: 'New Password',
                        hintText: 'Enter new password',
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
                      validator: cubit.validateNewPassword,
                    );
                  },
                ),

                SizedBox(height: 24.h),

                // Confirm Password Field
                StreamBuilder<bool>(
                  stream: cubit.obscureConfirmPasswordStream,
                  initialData: true,
                  builder: (context, snapshot) {
                    return TextFormField(
                      controller: _confirmPasswordController,
                      obscureText: snapshot.data ?? true,
                      style: textTheme.bodyLarge,
                      decoration: InputDecoration(
                        labelText: 'Confirm Password',
                        hintText: 'Re-enter password',
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
                          onPressed: cubit.toggleConfirmPasswordVisibility,
                        ),
                      ),
                      validator: (value) => cubit.validateConfirmPassword(
                        newPassword: _newPasswordController.text,
                        confirmPassword: value,
                      ),
                    );
                  },
                ),

                SizedBox(height: 16.h),

                // Password Requirements
                Container(
                  padding: EdgeInsets.all(16.w),
                  decoration: BoxDecoration(
                    color: colorScheme.primary.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(12.r),
                    border: Border.all(
                      color: colorScheme.primary.withOpacity(0.1),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Password must contain:',
                        style: textTheme.labelLarge?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      SizedBox(height: 8.h),
                      _buildRequirement('At least 8 characters', textTheme),
                      _buildRequirement(
                        'One uppercase letter (A-Z)',
                        textTheme,
                      ),
                      _buildRequirement(
                        'One lowercase letter (a-z)',
                        textTheme,
                      ),
                      _buildRequirement('One number (0-9)', textTheme),
                    ],
                  ),
                ),

                SizedBox(height: 40.h),

                // Update Button
                StreamBuilder<bool>(
                  stream: cubit.isLoadingStream,
                  initialData: false,
                  builder: (context, snapshot) {
                    final isLoading = snapshot.data ?? false;
                    return SizedBox(
                      width: double.infinity,
                      height: 56.h,
                      child: ElevatedButton(
                        onPressed: isLoading
                            ? null
                            : () {
                                cubit.resetPassword(
                                  newPassword: _newPasswordController.text
                                      .trim(),
                                );
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
                                'Update Password',
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
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRequirement(String text, TextTheme textTheme) {
    return Padding(
      padding: EdgeInsets.only(top: 4.h),
      child: Row(
        children: [
          Icon(
            Icons.check_circle_outline,
            size: 16.sp,
            color: textTheme.bodySmall?.color,
          ),
          SizedBox(width: 8.w),
          Text(text, style: textTheme.bodySmall),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }
}
