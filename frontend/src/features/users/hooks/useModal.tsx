import type { User } from "../types/users.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, userEditSchema } from "../schemas/modal.schema";
import { useEffect } from "react";
import type { z } from "zod";





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
      hospitalId: undefined,
      ambulanceId: undefined,
    },
  });

  useEffect(() => {
    if (user && mode === "edit") {
      

      reset({
        name: user.name,
        email: user.email,
        nationalId: typeof user.nationalId === "string" ? user.nationalId : "",
        gender: user.gender,
        age:user.age,
        password: "",
        phoneNumber: user.phoneNumber || "",
        role: user.role,
        hospitalId: user.hospitalId ? String(user.hospitalId) : undefined,
        ambulanceId: user.ambulanceId ? String(user.ambulanceId) : undefined,
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
        hospitalId: undefined,
        ambulanceId: undefined,
      });
    }
  }, [user, mode, reset]);

  const submitHandler = handleSubmit((data) => {
    const userData: User = {
      name: data.name,
      id: user?.id,
      email: data.email,
      nationalId: data.nationalId,
      gender: data.gender,
      age: data.age,
      phoneNumber: data.phoneNumber,
      role: data.role,
      hospitalId: data.hospitalId ? Number(data.hospitalId) : undefined,
      ambulanceId: data.ambulanceId ? Number(data.ambulanceId) : undefined,
    };

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
      if (editData.ambulanceId) {
        userData.ambulanceId = Number(editData.ambulanceId);
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
