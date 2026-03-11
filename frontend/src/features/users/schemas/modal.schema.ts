import z from "zod";

const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character");

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email format").min(1, "Email is required"),
  password: passwordValidation,
  phoneNumber: z.string().min(1, "Phone number is required"),
  role: z.enum(["Admin", "HospitalAdmin", "Paramedic", "AmbulanceDriver"], {
    message: "Role selection is required",
  }),
  hospitalId: z.string().optional(),
});

export const userEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email format").min(1, "Email is required"),
  password: passwordValidation.optional().or(z.literal("")),
  phoneNumber: z.string().min(1, "Phone number is required"),
  role: z.enum(["Admin", "HospitalAdmin", "Paramedic", "AmbulanceDriver"], {
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
