// lib/presentation/features/auth/views/forgot_password_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../cubit/forgot_password/forgot_password_cubit.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ForgotPasswordCubit>().initialize(
        context: context,
        formKey: _formKey,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final cubit = context.read<ForgotPasswordCubit>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Forgot Password'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: cubit.navigateBack,
        ),
      ),
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
                      Icons.lock_reset_rounded,
                      size: 60.sp,
                      color: colorScheme.primary,
                    ),
                  ),
                ),

                SizedBox(height: 40.h),

                // Title
                Text('Reset Password', style: textTheme.displaySmall),

                SizedBox(height: 12.h),

                // Description
                Text(
                  'Enter your email address and we\'ll send you a verification code to reset your password.',
                  style: textTheme.bodyLarge?.copyWith(
                    color: textTheme.bodySmall?.color,
                    height: 1.5,
                  ),
                ),

                SizedBox(height: 40.h),

                // Email Field
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  style: textTheme.bodyLarge,
                  decoration: InputDecoration(
                    labelText: 'Email Address',
                    hintText: 'example@email.com',
                    prefixIcon: Icon(Icons.email_outlined, size: 22.sp),
                  ),
                  validator: cubit.validateEmail,
                ),

                SizedBox(height: 40.h),

                // Send Button
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
                            : () => cubit.sendOtp(_emailController.text.trim()),
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
                                'Send Verification Code',
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

                SizedBox(height: 24.h),

                // Back to Login
                Center(
                  child: TextButton(
                    onPressed: cubit.navigateBack,
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.symmetric(
                        horizontal: 16.w,
                        vertical: 8.h,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.arrow_back, size: 18.sp),
                        SizedBox(width: 4.w),
                        Text(
                          'Back to Login',
                          style: textTheme.labelLarge?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }
}
