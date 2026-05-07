import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { API_CONFIG, getApiUrl } from "@/config/api.config";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { useGetHospitals } from "@/features/hospitalsManagement/hooks/useGetHospitals";
import { normalizeAmbulance, extractAmbulanceCollection } from "@/features/ambulancesManagement/utils/ambulance.api";
import { userSchema, userEditSchema } from "../schemas/modal.schema";
import type { User } from "../types/users.types";

type AddFormData = z.infer<typeof userSchema>;
type EditFormData = z.infer<typeof userEditSchema>;
type FormData = AddFormData | EditFormData;

interface AmbulanceOption { id: string; name: string; }

interface UseUserFormParams {
  isOpen: boolean;
  mode: "add" | "edit";
  user?: User;
  onSubmit: (user: User) => void;
}

export function useUserForm({ isOpen, mode, user, onSubmit }: UseUserFormParams) {
  const { hospitals, fetchHospitals, isLoading: isHospitalsLoading } = useGetHospitals();
  const [ambulances, setAmbulances] = useState<AmbulanceOption[]>([]);
  const [isAmbulancesLoading, setIsAmbulancesLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(mode === "edit" ? userEditSchema : userSchema) as any,
    defaultValues: {
      name: "", email: "", nationalId: "", gender: undefined,
      age: undefined, password: "", phoneNumber: "",
      role: undefined, hospitalId: undefined, ambulanceId: undefined,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (user && mode === "edit") {
      reset({
        name: user.name,
        email: user.email,
        nationalId: user.nationalId ?? "",
        gender: user.gender,
        age: user.age,
        password: "",
        phoneNumber: user.phoneNumber ?? "",
        role: user.role,
        hospitalId: user.hospitalId ? String(user.hospitalId) : undefined,
        ambulanceId: user.ambulanceId ? String(user.ambulanceId) : undefined,
      });
    } else {
      reset({
        name: "", email: "", nationalId: "", gender: undefined,
        age: undefined, password: "", phoneNumber: "",
        role: undefined, hospitalId: undefined, ambulanceId: undefined,
      });
    }
  }, [user, mode, reset]);

  // Derive selected values for controlled selects
  const selectedRole = (watch("role") as string) || "";
  const selectedGender = (watch("gender") as string) || "";
  const selectedHospitalId = String(watch("hospitalId") || "");
  const selectedAmbulanceId = String(watch("ambulanceId") || "");

  // Fetch dependent data when role changes
  const fetchAmbulances = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;
    setIsAmbulancesLoading(true);
    try {
      const res = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.AMBULANCES.GET_ALL), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const normalized = extractAmbulanceCollection(res.data)
        .map(normalizeAmbulance)
        .filter((x): x is NonNullable<typeof x> => x !== null)
        .map((x) => ({ id: String(x.id), name: x.name }));
      setAmbulances(normalized);
    } catch {
      setAmbulances([]);
    } finally {
      setIsAmbulancesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (selectedRole === "HospitalAdmin") void fetchHospitals();
    if (selectedRole === "AmbulanceDriver") void fetchAmbulances();
  }, [isOpen, selectedRole, fetchHospitals, fetchAmbulances]);

  const handleRoleChange = (value: string) => {
    setValue("role", value as any, { shouldDirty: true, shouldValidate: true });
    if (value !== "HospitalAdmin") setValue("hospitalId", "" as any, { shouldDirty: true });
    if (value !== "AmbulanceDriver") setValue("ambulanceId", "" as any, { shouldDirty: true });
  };

  const submitHandler = handleSubmit((data) => {
    onSubmit({
      id: user?.id,
      name: data.name,
      email: data.email,
      nationalId: data.nationalId,
      gender: data.gender,
      age: data.age,
      password: data.password,
      phoneNumber: data.phoneNumber,
      role: data.role as User["role"],
      hospitalId: data.hospitalId ? Number(data.hospitalId) : undefined,
      ambulanceId: data.ambulanceId ? Number(data.ambulanceId) : undefined,
    });
  });

  return {
    register, errors, watch, setValue,
    submitHandler,
    selectedRole, selectedGender, selectedHospitalId, selectedAmbulanceId,
    handleRoleChange,
    hospitals, isHospitalsLoading,
    ambulances, isAmbulancesLoading,
  };
}
