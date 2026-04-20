import 'package:flutter_bloc/flutter_bloc.dart';
import 'register_state.dart';

class RegisterCubit extends Cubit<RegisterState> {
  RegisterCubit() : super(const RegisterState());

  void onNameChanged(String value) {
    emit(
      state.copyWith(
        name: value,
        nameError: state.showValidation ? _validateName(value) : null,
        clearNameError: !state.showValidation,
      ),
    );
  }

  void onEmailChanged(String value) {
    emit(
      state.copyWith(
        email: value,
        emailError: state.showValidation ? _validateEmail(value) : null,
        clearEmailError: !state.showValidation,
      ),
    );
  }

  void onUserNameChanged(String value) {
    emit(
      state.copyWith(
        userName: value,
        userNameError: state.showValidation ? _validateUserName(value) : null,
        clearUserNameError: !state.showValidation,
      ),
    );
  }

  void onPasswordChanged(String value) {
    emit(
      state.copyWith(
        password: value,
        passwordError: state.showValidation ? _validatePassword(value) : null,
        clearPasswordError: !state.showValidation,
      ),
    );
  }

  void onNationalIdChanged(String value) {
    emit(
      state.copyWith(
        nationalId: value,
        nationalIdError: state.showValidation
            ? _validateNationalId(value)
            : null,
        clearNationalIdError: !state.showValidation,
      ),
    );
  }

  void onAgeChanged(String value) {
    emit(
      state.copyWith(
        age: value,
        ageError: state.showValidation ? _validateAge(value) : null,
        clearAgeError: !state.showValidation,
      ),
    );
  }

  void togglePasswordVisibility() {
    emit(state.copyWith(obscurePassword: !state.obscurePassword));
  }

  void setGender(String gender) {
    emit(
      state.copyWith(
        gender: gender,
        genderError: state.showValidation ? _validateGender(gender) : null,
        clearGenderError: !state.showValidation,
      ),
    );
  }

  bool validate() {
    final nameError = _validateName(state.name);
    final emailError = _validateEmail(state.email);
    final userNameError = _validateUserName(state.userName);
    final passwordError = _validatePassword(state.password);
    final nationalIdError = _validateNationalId(state.nationalId);
    final ageError = _validateAge(state.age);
    final genderError = _validateGender(state.gender);

    emit(
      state.copyWith(
        nameError: nameError,
        emailError: emailError,
        userNameError: userNameError,
        passwordError: passwordError,
        nationalIdError: nationalIdError,
        ageError: ageError,
        genderError: genderError,
        showValidation: true,
      ),
    );

    return nameError == null &&
        emailError == null &&
        userNameError == null &&
        passwordError == null &&
        nationalIdError == null &&
        ageError == null &&
        genderError == null;
  }

  String? _validateName(String value) {
    if (value.trim().isEmpty) {
      return 'Please enter your name';
    }
    return null;
  }

  String? _validateEmail(String value) {
    if (value.trim().isEmpty) {
      return 'Please enter your email';
    }
    if (!RegExp(r'^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value.trim())) {
      return 'Please enter a valid email';
    }
    return null;
  }

  String? _validateUserName(String value) {
    if (value.trim().isEmpty) {
      return 'Please enter your user name';
    }
    return null;
  }

  String? _validatePassword(String value) {
    if (value.isEmpty) {
      return 'Please enter a password';
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  }

  String? _validateNationalId(String value) {
    if (value.trim().isEmpty) {
      return 'Please enter your national ID';
    }
    return null;
  }

  String? _validateAge(String value) {
    if (value.trim().isEmpty) {
      return 'Please enter your age';
    }
    final parsedAge = int.tryParse(value.trim());
    if (parsedAge == null || parsedAge < 1 || parsedAge > 120) {
      return 'Please enter a valid age';
    }
    return null;
  }

  String? _validateGender(String value) {
    if (value.isEmpty) {
      return 'Please select your gender';
    }
    return null;
  }
}
