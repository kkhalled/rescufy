import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { API_CONFIG, getApiUrl } from "@/config/api.config";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { normalizeAmbulance, extractAmbulanceCollection } from "@/features/ambulances_management/utils/ambulance.api";
import { useGetHospitals } from "@/features/hospitals_management/hooks/useGetHospitals";
import type { User } from "../types/users.types";

type UserFormRole =
  | "Admin"
  | "HospitalAdmin"
  | "Paramedic"
  | "AmbulanceDriver"
  | "SuperAdmin";
type UserFormGender = "Male" | "Female";

type FormWatch = (field: "role" | "gender" | "hospitalId" | "ambulanceId") => unknown;
type FormSetValue = (
  field: "role" | "gender" | "hospitalId" | "ambulanceId",
  value: string,
  options?: {
    shouldDirty?: boolean;
    shouldValidate?: boolean;
  },
) => void;

interface UseUserFormModalLogicParams {
  isOpen: boolean;
  mode: "add" | "edit";
  user?: User;
  watch: FormWatch;
  setValue: FormSetValue;
}

interface ModalAmbulanceOption {
  id: string;
  name: string;
}

const ROLE_SELECT_VALUE_MAP: Record<string, UserFormRole> = {
  admin: "Admin",
  hospitaladmin: "HospitalAdmin",
  paramedic: "Paramedic",
  ambulancedriver: "AmbulanceDriver",
  superadmin: "SuperAdmin",
  "system superadmin": "SuperAdmin",
};

const normalizeRoleForSelect = (value: unknown): UserFormRole | "" => {
  if (typeof value !== "string") return "";
  const normalized = value.trim().toLowerCase();
  return ROLE_SELECT_VALUE_MAP[normalized] || "";
};

const normalizeGenderForSelect = (value: unknown): UserFormGender | "" => {
  if (typeof value !== "string") return "";
  const normalized = value.trim().toLowerCase();
  if (normalized === "male") return "Male";
  if (normalized === "female") return "Female";
  return "";
};

export function useUserFormModalLogic({
  isOpen,
  mode,
  user,
  watch,
  setValue,
}: UseUserFormModalLogicParams) {
  const {
    hospitals,
    fetchHospitals,
    isLoading: isHospitalsLoading,
  } = useGetHospitals();
  const [ambulances, setAmbulances] = useState<ModalAmbulanceOption[]>([]);
  const [isAmbulancesLoading, setIsAmbulancesLoading] = useState(false);

  const selectedRole =
    normalizeRoleForSelect(watch("role")) ||
    (mode === "edit"
      ? normalizeRoleForSelect(
          user?.roles && user.roles.length > 0 ? user.roles[0] : user?.role,
        )
      : "");

  const selectedGender =
    normalizeGenderForSelect(watch("gender")) ||
    (mode === "edit" ? normalizeGenderForSelect(user?.gender) : "");

  const selectedHospitalId = String(watch("hospitalId") || "");
  const selectedAmbulanceId = String(watch("ambulanceId") || "");

  const fetchAmbulances = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setAmbulances([]);
      return;
    }

    setIsAmbulancesLoading(true);

    try {
      const response = await axios.get(
        getApiUrl(API_CONFIG.ENDPOINTS.AMBULANCES.GET_ALL),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Fetched ambulances:", response.data);

      const normalized = extractAmbulanceCollection(response.data)
        .map(normalizeAmbulance)
        .filter((item): item is NonNullable<ReturnType<typeof normalizeAmbulance>> => item !== null)
        .map((item) => ({ id: String(item.id), name: item.name }));

      setAmbulances(normalized);
    } catch {
      setAmbulances([]);
    } finally {
      setIsAmbulancesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (selectedRole === "HospitalAdmin") {
      void fetchHospitals();
    }

    if (selectedRole === "AmbulanceDriver") {
      void fetchAmbulances();
    }
  }, [isOpen, selectedRole, fetchHospitals, fetchAmbulances]);

  const handleRoleChange = (value: string) => {
    setValue("role", value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (value !== "HospitalAdmin") {
      setValue("hospitalId", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    if (value !== "AmbulanceDriver") {
      setValue("ambulanceId", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return {
    hospitals,
    isHospitalsLoading,
    ambulances,
    isAmbulancesLoading,
    selectedRole,
    selectedGender,
    selectedHospitalId,
    selectedAmbulanceId,
    handleRoleChange,
  };
}