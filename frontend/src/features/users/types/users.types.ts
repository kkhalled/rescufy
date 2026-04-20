export type UserRole = "Admin" | "HospitalAdmin" | "Paramedic" | "SuperAdmin" | "AmbulanceDriver";
export type UserGender = "Male" | "Female";

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  nationalId?: string;
  gender?: UserGender;
  age?: number;
  phoneNumber?: string | null;
  roles?: UserRole[];
  role?: UserRole; // Keep for backward compatibility
  isBanned?: boolean;
  hospitalId?: number; // For HospitalAdmin assignment
}

export type UserLegacy = User;
