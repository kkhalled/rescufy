import { Navigate } from "react-router-dom";

import { useAuth } from "@/app/provider/AuthContext";

import type { Role } from "@/features/auth/types/auth.types";

import Loading from "@/shared/common/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
      />
    );
  }

  if (
    !allowedRoles.includes(user.Role)
  ) {
    return (
      <Navigate
        to="/signin"
        replace
      />
    );
  }

  return <>{children}</>;
}