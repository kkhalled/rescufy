import z from "zod";

export const ambulanceSchema = z
  .object({
    id: z.string(),
    licensePlate: z
      .string()
      .min(1, "License plate is required")
      .regex(
        /^[A-Za-z]{1,3}[-]?[0-9]{3,4}$/,
        "Invalid license plate format (e.g., ABC-1234)"
      ),
    hospitalId: z.string().min(1, "Hospital selection is required"),
    status: z.enum(["AVAILABLE", "IN_TRANSIT", "BUSY", "MAINTENANCE"]),
    latitude: z
      .number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    longitude: z
      .number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
  });
