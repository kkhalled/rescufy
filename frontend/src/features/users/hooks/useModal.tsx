import type { User } from "../types/users.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, userEditSchema } from "../schemas/modal.schema";
import { useEffect } from "react";
import type { z } from "zod";

const ROLE_VALUE_MAP: Record<string, User["role"]> = {
  admin: "Admin",
  hospitaladmin: "HospitalAdmin",
  paramedic: "Paramedic",
  ambulancedriver: "AmbulanceDriver",
  superadmin: "SuperAdmin",
  "system superadmin": "SuperAdmin",
};

const normalizeRoleValue = (value: unknown): User["role"] | undefined => {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  return ROLE_VALUE_MAP[normalized];
};

const normalizeGenderValue = (value: unknown): User["gender"] | undefined => {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === "male") return "Male";
  if (normalized === "female") return "Female";
  return undefined;
};

type UserAddFormData = z.infer<typeof userSchema>;
type UserEditFormData = z.infer<typeof userEditSchema>;
type UserFormData = UserAddFormData | UserEditFormData;

interface UserFormModalProps {
  onSubmit: (user: User) => void;
  user?: User;
  mode: "add" | "edit";
}

export default function useModal({ onSubmit, user, mode }: UserFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(mode === "edit" ? userEditSchema : userSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      nationalId: "",
      gender: undefined,
      age: undefined,
      password: "",
      phoneNumber: "",
      role: undefined,
      hospitalId: "",
    },
  });

  useEffect(() => {
    if (user && mode === "edit") {
      const normalizedRoleFromArray =
        user.roles && user.roles.length > 0
          ? normalizeRoleValue(user.roles[0])
          : undefined;
      const normalizedRole =
        normalizedRoleFromArray || normalizeRoleValue(user.role);

      reset({
        name: user.name,
        email: user.email,
        nationalId: typeof user.nationalId === "string" ? user.nationalId : "",
        gender: normalizeGenderValue(user.gender),
        age: typeof user.age === "number" && Number.isFinite(user.age) ? user.age : undefined,
        password: "",
        phoneNumber: typeof user.phoneNumber === "string" ? user.phoneNumber : "",
        role: normalizedRole as any,
        hospitalId: user.hospitalId ? String(user.hospitalId) : "",
      });
    } else {
      reset({
        name: "",
        email: "",
        nationalId: "",
        gender: undefined,
        age: undefined,
        password: "",
        phoneNumber: "",
        role: undefined,
        hospitalId: "",
      });
    }
  }, [user, mode, reset]);

  const submitHandler = handleSubmit((data) => {
    const normalizedPhoneNumber =
      typeof data.phoneNumber === "string" ? data.phoneNumber.trim() : "";
    const normalizedRole = data.role as User["role"] | undefined;

    const userData: User = {
      ...(mode === "edit" && user?.id ? { id: user.id } : {}),
      ...(mode === "edit" && typeof user?.isBanned === "boolean"
        ? { isBanned: user.isBanned }
        : {}),
      name: data.name,
      email: data.email,
      role: normalizedRole,
      ...(normalizedRole ? { roles: [normalizedRole] } : {}),
      ...(data.password ? { password: data.password } : {}),
      ...(data.hospitalId ? { hospitalId: Number(data.hospitalId) } : {}),
    };

    if (mode === "add") {
      userData.phoneNumber = normalizedPhoneNumber;
    } else {
      userData.phoneNumber = normalizedPhoneNumber || null;
    }

    if (mode === "add") {
      const addData = data as UserAddFormData;
      userData.nationalId = addData.nationalId;
      userData.gender = addData.gender;
      userData.age = addData.age;
    } else {
      const editData = data as UserEditFormData;
      if (typeof editData.nationalId === "string") {
        userData.nationalId = editData.nationalId;
      }
      if (editData.gender) userData.gender = editData.gender;
      if (typeof editData.age === "number" && Number.isFinite(editData.age)) {
        userData.age = editData.age;
      }
    }

    onSubmit(userData);
  });

  return {
    register,
    submitHandler,
    errors,
    reset,
    watch,
    setValue,
  };
}
