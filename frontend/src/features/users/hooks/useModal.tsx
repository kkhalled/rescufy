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
      password: "",
      phoneNumber: "",
      role: undefined,
      hospitalId: "",
    },
  });

  useEffect(() => {
    if (user && mode === "edit") {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        phoneNumber: user.phoneNumber || "",
        role: (user.roles && user.roles.length > 0 ? user.roles[0] : user.role) as any,
        hospitalId: user.hospitalId ? String(user.hospitalId) : "",
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: undefined,
        hospitalId: "",
      });
    }
  }, [user, mode, reset]);

  const submitHandler = handleSubmit((data) => {
    const userData: User = {
      ...(mode === "edit" && user?.id ? { id: user.id } : {}),
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: data.role as any,
      ...(data.password ? { password: data.password } : {}),
      ...(data.hospitalId ? { hospitalId: Number(data.hospitalId) } : {}),
    };
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
