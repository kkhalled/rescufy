import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/presentation/auth/cubit/auth/auth_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/auth/auth_state.dart';
import '../cubit/register/register_cubit.dart';
import '../cubit/register/register_state.dart';

class SignupScreen extends StatelessWidget {
  const SignupScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

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
                backgroundColor: colorScheme.error,
              ),
            );
          }
        },
        child: BlocBuilder<RegisterCubit, RegisterState>(
          builder: (context, registerState) {
            final cubit = context.read<RegisterCubit>();
            return SafeArea(
              child: Column(
                children: [
                  Padding(
                    padding: EdgeInsets.all(24.w),
                    child: Row(
                      children: [
                        IconButton(
                          onPressed: () => Navigator.of(context).pop(),
                          icon: const Icon(
                            Icons.arrow_back_rounded,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(width: 12.w),
                        Text(
                          'Sign Up',
                          style: textTheme.headlineMedium?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    child: Container(
                      margin: EdgeInsets.symmetric(horizontal: 24.w),
                      padding: EdgeInsets.all(24.w),
                      decoration: BoxDecoration(
                        color: theme.cardTheme.color,
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(24.r),
                          topRight: Radius.circular(24.r),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.3),
                            blurRadius: 20,
                            offset: const Offset(0, -5),
                          ),
                        ],
                      ),
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Create your account',
                              style: textTheme.headlineMedium,
                            ),
                            SizedBox(height: 28.h),
                            _buildTextField(
                              label: 'Name',
                              hint: 'Enter your full name',
                              icon: Icons.person_outline_rounded,
                              textTheme: textTheme,
                              initialValue: registerState.name,
                              errorText: registerState.nameError,
                              onChanged: cubit.onNameChanged,
                            ),
                            SizedBox(height: 20.h),
                            _buildTextField(
                              label: 'Email',
                              hint: 'example@email.com',
                              icon: Icons.email_outlined,
                              keyboardType: TextInputType.emailAddress,
                              textTheme: textTheme,
                              initialValue: registerState.email,
                              errorText: registerState.emailError,
                              onChanged: cubit.onEmailChanged,
                            ),
                            SizedBox(height: 20.h),
                            _buildTextField(
                              label: 'User Name',
                              hint: 'Choose a username',
                              icon: Icons.alternate_email_rounded,
                              textTheme: textTheme,
                              initialValue: registerState.userName,
                              errorText: registerState.userNameError,
                              onChanged: cubit.onUserNameChanged,
                            ),
                            SizedBox(height: 20.h),
                            _buildTextField(
                              label: 'Password',
                              hint: 'Create a password',
                              icon: Icons.lock_outline_rounded,
                              obscureText: registerState.obscurePassword,
                              textTheme: textTheme,
                              initialValue: registerState.password,
                              errorText: registerState.passwordError,
                              onChanged: cubit.onPasswordChanged,
                              suffixIcon: IconButton(
                                icon: Icon(
                                  registerState.obscurePassword
                                      ? Icons.visibility_outlined
                                      : Icons.visibility_off_outlined,
                                  size: 22.sp,
                                ),
                                onPressed: cubit.togglePasswordVisibility,
                              ),
                            ),
                            SizedBox(height: 20.h),
                            _buildTextField(
                              label: 'National ID',
                              hint: 'Enter your national ID',
                              icon: Icons.badge_outlined,
                              textTheme: textTheme,
                              initialValue: registerState.nationalId,
                              errorText: registerState.nationalIdError,
                              onChanged: cubit.onNationalIdChanged,
                            ),
                            SizedBox(height: 20.h),
                            _buildTextField(
                              label: 'Age',
                              hint: 'Enter your age',
                              icon: Icons.calendar_today_outlined,
                              keyboardType: TextInputType.number,
                              textTheme: textTheme,
                              initialValue: registerState.age,
                              errorText: registerState.ageError,
                              onChanged: cubit.onAgeChanged,
                            ),
                            SizedBox(height: 20.h),
                            DropdownButtonFormField<String>(
                              initialValue: registerState.gender.isEmpty
                                  ? null
                                  : registerState.gender,
                              style: textTheme.bodyLarge,
                              decoration: InputDecoration(
                                labelText: 'Gender',
                                hintText: 'Select your gender',
                                errorText: registerState.genderError,
                                prefixIcon: Icon(
                                  Icons.wc_outlined,
                                  size: 22.sp,
                                ),
                              ),
                              items: const [
                                DropdownMenuItem(
                                  value: 'male',
                                  child: Text('Male'),
                                ),
                                DropdownMenuItem(
                                  value: 'female',
                                  child: Text('Female'),
                                ),
                              ],
                              onChanged: (value) {
                                if (value != null) {
                                  cubit.setGender(value);
                                }
                              },
                            ),
                            SizedBox(height: 32.h),
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

                                            context.read<AuthCubit>().register(
                                              name: registerState.name.trim(),
                                              email: registerState.email.trim(),
                                              userName: registerState.userName
                                                  .trim(),
                                              password: registerState.password
                                                  .trim(),
                                              nationalId: registerState
                                                  .nationalId
                                                  .trim(),
                                              age: registerState.parsedAge!,
                                              gender: registerState.gender,
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
                                            'Sign Up',
                                            style: textTheme.labelLarge
                                                ?.copyWith(
                                                  fontSize: 16.sp,
                                                  fontWeight: FontWeight.w600,
                                                  color: Colors.white,
                                                ),
                                          ),
                                  ),
                                );
                              },
                            ),
                            SizedBox(height: 16.h),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required String hint,
    required IconData icon,
    required TextTheme textTheme,
    String? initialValue,
    String? errorText,
    ValueChanged<String>? onChanged,
    TextInputType? keyboardType,
    bool obscureText = false,
    Widget? suffixIcon,
  }) {
    return TextFormField(
      initialValue: initialValue,
      onChanged: onChanged,
      keyboardType: keyboardType,
      obscureText: obscureText,
      style: textTheme.bodyLarge,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: Icon(icon),
        errorText: errorText,
        suffixIcon: suffixIcon,
      ),
    );
  }
}
