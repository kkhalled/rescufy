import z from "zod";

const STATUS_VALUES = ["Available", "Transiting", "Busy", "Maintenance"] as const;



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
    status: z.enum(STATUS_VALUES, "Invalid status value"),
  });
