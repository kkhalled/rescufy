import z from "zod";

export const ambulanceSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1, "Name is required"),
    ambulanceNumber: z.string().min(1, "Ambulance number is required"),
    vehicleInfo: z.string().min(1, "Vehicle info is required"),
    driverPhone: z.string().min(1, "Driver phone is required"),
    driverId: z.string().optional(),
    driverName: z.string().optional(),
    paramedicId: z.string().optional(),
    ambulancePointId: z.string().optional(),
    startingPrice: z.number().min(0, "Starting price must be 0 or more"),
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
