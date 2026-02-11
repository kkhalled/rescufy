// lib/presentation/features/auth/cubit/register_cubit.dart
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../domain/usecases/register_usecase.dart';
import 'register_state.dart';

class RegisterCubit extends Cubit<RegisterState> {
  final RegisterUseCase registerUseCase;

  RegisterCubit(this.registerUseCase) : super(const RegisterInitial());

  void togglePasswordVisibility() {
    final currentState = state;

    if (currentState is RegisterInitial) {
      emit(
        currentState.copyWith(obscurePassword: !currentState.obscurePassword),
      );
    } else if (currentState is RegisterLoading) {
      emit(
        RegisterLoading(
          obscurePassword: !currentState.obscurePassword,
          obscureConfirmPassword: currentState.obscureConfirmPassword,
          selectedGender: currentState.selectedGender,
        ),
      );
    } else if (currentState is RegisterFailure) {
      emit(
        RegisterFailure(
          currentState.message,
          obscurePassword: !currentState.obscurePassword,
          obscureConfirmPassword: currentState.obscureConfirmPassword,
          selectedGender: currentState.selectedGender,
        ),
      );
    }
  }

  void toggleConfirmPasswordVisibility() {
    final currentState = state;

    if (currentState is RegisterInitial) {
      emit(
        currentState.copyWith(
          obscureConfirmPassword: !currentState.obscureConfirmPassword,
        ),
      );
    } else if (currentState is RegisterLoading) {
      emit(
        RegisterLoading(
          obscurePassword: currentState.obscurePassword,
          obscureConfirmPassword: !currentState.obscureConfirmPassword,
          selectedGender: currentState.selectedGender,
        ),
      );
    } else if (currentState is RegisterFailure) {
      emit(
        RegisterFailure(
          currentState.message,
          obscurePassword: currentState.obscurePassword,
          obscureConfirmPassword: !currentState.obscureConfirmPassword,
          selectedGender: currentState.selectedGender,
        ),
      );
    }
  }

  void setGender(String gender) {
    final currentState = state;

    if (currentState is RegisterInitial) {
      emit(currentState.copyWith(selectedGender: gender));
    } else if (currentState is RegisterLoading) {
      emit(
        RegisterLoading(
          obscurePassword: currentState.obscurePassword,
          obscureConfirmPassword: currentState.obscureConfirmPassword,
          selectedGender: gender,
        ),
      );
    } else if (currentState is RegisterFailure) {
      emit(
        RegisterFailure(
          currentState.message,
          obscurePassword: currentState.obscurePassword,
          obscureConfirmPassword: currentState.obscureConfirmPassword,
          selectedGender: gender,
        ),
      );
    }
  }

  Future<void> register({
    required String fullName,
    required String email,
    required String password,
    required String confirmPassword,
    required String nationalId,
    required String phoneNumber,
    required String age,
    required String gender,
  }) async {
    // Preserve current UI state
    final currentState = state;
    bool obscurePassword = true;
    bool obscureConfirmPassword = true;
    String selectedGender = gender;

    if (currentState is RegisterInitial) {
      obscurePassword = currentState.obscurePassword;
      obscureConfirmPassword = currentState.obscureConfirmPassword;
      selectedGender = currentState.selectedGender;
    }

    emit(
      RegisterLoading(
        obscurePassword: obscurePassword,
        obscureConfirmPassword: obscureConfirmPassword,
        selectedGender: selectedGender,
      ),
    );

    // Parse age
    int parsedAge = 0;
    try {
      parsedAge = int.parse(age);
    } catch (e) {
      emit(
        RegisterFailure(
          'Invalid age format',
          obscurePassword: obscurePassword,
          obscureConfirmPassword: obscureConfirmPassword,
          selectedGender: selectedGender,
        ),
      );
      return;
    }

    final result = await registerUseCase(
      RegisterParams(
        fullName: fullName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        nationalId: nationalId,
        phoneNumber: phoneNumber,
        age: parsedAge,
        gender: selectedGender,
      ),
    );

    result.fold(
      (failure) => emit(
        RegisterFailure(
          failure.message,
          obscurePassword: obscurePassword,
          obscureConfirmPassword: obscureConfirmPassword,
          selectedGender: selectedGender,
        ),
      ),
      (user) => emit(RegisterSuccess(user)),
    );
  }
}
