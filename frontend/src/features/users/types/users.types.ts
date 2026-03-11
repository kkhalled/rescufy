export type UserRole = "Admin" | "HospitalAdmin" | "Paramedic" | "SuperAdmin" | "AmbulanceDriver";

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string | null;
  roles?: UserRole[];
  role?: UserRole; // Keep for backward compatibility
  isBanned?: boolean;
  hospitalId?: number; // For HospitalAdmin assignment
}

export type UserLegacy = User;
