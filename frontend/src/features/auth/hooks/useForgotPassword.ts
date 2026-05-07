import { useState } from "react";
import useEmailStep from "./useEmailStep";
import useOtpStep from "./useOtpStep";
import useResetPasswordStep from "./useResetPasswordStep";

type ForgotPasswordStep = "email" | "otp" | "reset";

export default function useForgotPassword() {
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  // Email step handlers
  function handleEmailSent(emailValue: string) {
    setEmail(emailValue);
    setStep("otp");
  }

  function handleResendEmail() {
    setStep("email");
  }

  function goBackToEmail() {
    setStep("email");
    setToken(""); // Clear token when going back to email step
  }

  // OTP step handlers  
  function handleOtpVerified(tokenValue: string) {
    setToken(tokenValue);
    setStep("reset");
  }

  // Step hooks
  const emailStep = useEmailStep(handleEmailSent);
  const otpStep = useOtpStep(email, handleOtpVerified, handleResendEmail);
  const resetPasswordStep = useResetPasswordStep(email, token);

  return {
    step,
    email,
    // Email step
    emailFormik: emailStep.formik,
    emailLoading: emailStep.isLoading,
    // OTP step
    otpFormik: otpStep.formik,
    otpLoading: otpStep.isLoading,
    resendOtp: otpStep.resendOtp,
    goBackToEmail,
    // Reset password step
    resetFormik: resetPasswordStep.formik,
    resetLoading: resetPasswordStep.isLoading,
    // Overall loading (any step is loading)
    isLoading: emailStep.isLoading || otpStep.isLoading || resetPasswordStep.isLoading,
  };
}
