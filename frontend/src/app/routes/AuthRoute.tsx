import { Navigate } from "react-router";
import { useAuth } from "../provider/AuthContext";
import Loading from './../../shared/common/Loading';

export default function AuthRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loading />;

  if (!user) return <>{children}</>;

  const role = user.Role;

  const roleRoutes: Record<string, string> = {
    SuperAdmin: "/admin",
    Admin: "/admin",
    hospitaladmin: "/hospital_user",
  };

  const redirectPath = roleRoutes[role];

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
