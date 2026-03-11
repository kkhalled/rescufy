export interface UpdateProfileRequest {
  fullName: string;
  userName: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SettingsTabType {
  profile: "profile";
  password: "password";
}

export type ActiveTab = "profile" | "password";