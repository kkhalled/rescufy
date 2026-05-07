import { Navigate } from "react-router-dom";

import { useAuth } from "../provider/AuthContext";

import Loading from "@/shared/common/Loading";

export default function AuthRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <>{children}</>;
  }

  switch (user.Role) {
    case "SuperAdmin":
    case "Admin":
      return (
        <Navigate
          to="/admin"
          replace
        />
      );

    case "hospitaladmin":
      return (
        <Navigate
          to="/hospital"
          replace
        />
      );

    default:
      return (
        <Navigate
          to="/signin"
          replace
        />
      );
  }
}