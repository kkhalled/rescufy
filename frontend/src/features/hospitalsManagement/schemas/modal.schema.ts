import z from "zod";

export const hospitalSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1, "Hospital name is required"),
    address: z.string().min(1, "Address is required"),
    contactPhone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[\d\s\-+()]+$/, "Invalid phone number format"),
    latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
    longitude: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
    availableBeds: z.number().int().min(0, "Available beds cannot be negative"),
    bedCapacity: z.number().int().positive("Bed capacity must be greater than 0"),
    availableICU: z.number().int().min(0, "Available ICU beds cannot be negative"),
    icuCapacity: z.number().int().min(0, "ICU capacity cannot be negative"),
    apiStatus: z.number().int().min(0),
    startingPrice: z.number().min(0, "Starting price cannot be negative"),
  })
  .refine((data) => data.availableBeds <= data.bedCapacity, {
    message: "Available beds cannot exceed bed capacity",
    path: ["availableBeds"],
  })
  .refine((data) => data.availableICU <= data.icuCapacity, {
    message: "Available ICU cannot exceed ICU capacity",
    path: ["availableICU"],
  });
