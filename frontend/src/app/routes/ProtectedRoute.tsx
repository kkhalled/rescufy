import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/provider/AuthContext";
import type { Role } from "@/features/auth/types/auth.types";
import Loading from "@/shared/common/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/signin" replace />;
  } else {
  }

  // Check if user has required role
  if (requiredRole) {
    const userRole = user.Role;
    
    // Allow SuperAdmin to access Admin routes
    if (requiredRole === "Admin" && (userRole === "SuperAdmin" || userRole === "Admin")) {
      // Access granted
    } else if (requiredRole === "hospitaladmin" && userRole === "hospitaladmin") {
      // Access granted  
    } else {
      return <Navigate to="/signin" replace />;
    }
  }

  return <>{children}</>;
}
