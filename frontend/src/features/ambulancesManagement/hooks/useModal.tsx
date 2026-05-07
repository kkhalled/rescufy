import type { Ambulance } from "../types/ambulances.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ambulanceSchema } from "../schemas/modal.schema";
import { useEffect } from "react";
import type { z } from "zod";

type AmbulanceFormData = z.infer<typeof ambulanceSchema>;

interface AmbulanceFormModalProps {
  onSubmit: (ambulance: Ambulance) => void | Promise<void>;
  ambulance?: Ambulance;
  mode: "add" | "edit";
}

export default function useModal({
  onSubmit,
  ambulance,
  mode,
}: AmbulanceFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AmbulanceFormData>({
    resolver: zodResolver(ambulanceSchema) as any,
    defaultValues: {
      id: "",
      name: "",
      ambulanceNumber: "",
      vehicleInfo: "",
      driverPhone: "",
      driverId: "",
      driverName: "",
      paramedicId: "",
      ambulancePointId: "",
      startingPrice: 0,
      status: "Available",
      
    },
  });

  useEffect(() => {
    console.log("Ambulance in useModal changed:", ambulance);

    if (ambulance && mode === "edit") {
          console.log("Ambulance in useModal changed:", ambulance.status);

       reset({
        id: ambulance.id,
        name: ambulance.name,
        ambulanceNumber: ambulance.ambulanceNumber,
        vehicleInfo: ambulance.vehicleInfo,
        driverPhone: ambulance.driverPhone,
        driverId: ambulance.driverId ?? "",
        driverName: ambulance.driverName ?? "",
        paramedicId: ambulance.paramedicId ?? "",
        ambulancePointId:
          ambulance.ambulancePointId === null ? "" : String(ambulance.ambulancePointId),
        startingPrice: ambulance.startingPrice,
        status: ambulance?.status,
      });

      
    } else {
      reset({
        id: String(Date.now()),
        name: "",
        ambulanceNumber: "",
        vehicleInfo: "",
        driverPhone: "",
        driverId: "",
        driverName: "",
        paramedicId: "",
        ambulancePointId: "",
        startingPrice: 0,
        status: "Available",
      });
    }
  }, [ambulance, mode, reset]);

  const submitHandler = handleSubmit(async (data) => {
    const normalizedName = data.name.trim();
    const normalizedNumber = data.ambulanceNumber.trim().toUpperCase();
    const normalizedPointId = data.ambulancePointId?.trim() || "";
    const parsedPointId = Number(normalizedPointId);
    const ambulancePointId =
      normalizedPointId && Number.isFinite(parsedPointId) ? parsedPointId : null;

    await onSubmit({
      id: data.id?.trim() || String(Date.now()),
      name: normalizedName,
      ambulanceNumber: normalizedNumber,
      vehicleInfo: data.vehicleInfo.trim(),
      driverPhone: data.driverPhone.trim(),
      driverId: data.driverId?.trim() || null,
      paramedicId: data.paramedicId?.trim() || null,
      driverName: data.driverName?.trim() || null,
      startingPrice: Number.isFinite(data.startingPrice) ? data.startingPrice : 0,
      ambulancePointId,
      licensePlate: normalizedNumber,
      hospitalId: ambulancePointId === null ? "0" : String(ambulancePointId),
      status: data.status,
      latitude: mode === "edit" && ambulance ? ambulance.latitude : 0,
      longitude: mode === "edit" && ambulance ? ambulance.longitude : 0,
    });
  });

  return {
    register,
    submitHandler,
    errors,
    watch,
    setValue,
  };
}
