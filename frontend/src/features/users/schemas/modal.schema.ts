import z from "zod";

const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character");

const nationalIdValidation = z
  .string()
  .regex(/^\d{14}$/, "National ID must be exactly 14 digits");

const ageValidation = z
  .coerce
  .number()
  .int("Age must be a whole number")
  .min(1, "Age must be at least 1")
  .max(120, "Age must be at most 120");

const ageEditValidation = z
  .coerce
  .number()
  .int("Age must be a whole number")
  .min(0, "Age must be at least 0")
  .max(120, "Age must be at most 120");

const genderValidation = z.enum(["Male", "Female"], {
  message: "Gender selection is required",
});

const addUserRoles = [
  "Admin",
  "HospitalAdmin",
  "Paramedic",
  "AmbulanceDriver",
] as const;

const editUserRoles = [...addUserRoles, "SuperAdmin"] as const;

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email format").min(1, "Email is required"),
  nationalId: nationalIdValidation,
  gender: genderValidation,
  age: ageValidation,
  password: passwordValidation,
  phoneNumber: z.string().min(1, "Phone number is required"),
  role: z.enum(addUserRoles, {
    message: "Role selection is required",
  }),
  hospitalId: z.string().optional(),
});

export const userEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email format").min(1, "Email is required"),
  nationalId: nationalIdValidation.optional().or(z.literal("")),
  gender: genderValidation.optional(),
  age: ageEditValidation.optional(),
  password: passwordValidation.optional().or(z.literal("")),
  phoneNumber: z.string().min(1, "Phone number is required").optional().or(z.literal("")),
  role: z.enum(editUserRoles, {
    message: "Role selection is required",
  }),
  hospitalId: z.string().optional(),
});

// Legacy schema for backward compatibility
export const userLegacySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
  role: z.string().min(1, "Role selection is required"),
});
