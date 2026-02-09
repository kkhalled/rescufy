import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/provider/AuthContext";
import type { Role } from "@/features/auth/types/auth.types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Check if user has required role
  if (requiredRole && user.Role.toLowerCase() !== requiredRole) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
