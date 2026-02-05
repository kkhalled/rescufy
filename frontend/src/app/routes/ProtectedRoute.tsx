import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectRole } from "@/features/auth/store/auth.slice";
import type { Role } from "@/features/auth/types/auth.types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const role = useSelector(selectRole);

  // Check if user is authenticated
  if (!role) {
    return <Navigate to="/signin" replace />;
  }

  // Check if user has required role
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
