import 'package:equatable/equatable.dart';

abstract class VerifyResetOtpState extends Equatable {
  const VerifyResetOtpState();

  @override
  List<Object?> get props => [];
}

class VerifyResetOtpInitial extends VerifyResetOtpState {
  const VerifyResetOtpInitial();
}

class VerifyResetOtpLoading extends VerifyResetOtpState {
  final String email;

  const VerifyResetOtpLoading(this.email);

  @override
  List<Object?> get props => [email];
}

class VerifyResetOtpSuccess extends VerifyResetOtpState {
  final String email;
  final String otp;

  const VerifyResetOtpSuccess(this.email, this.otp);

  @override
  List<Object?> get props => [email, otp];
}

class VerifyResetOtpFailure extends VerifyResetOtpState {
  final String message;
  final String email;

  const VerifyResetOtpFailure(this.message, this.email);

  @override
  List<Object?> get props => [message, email];
}
