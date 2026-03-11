import { createBrowserRouter } from "react-router";

import DashBoard from "@/features/dashboard/pages/DashBoard";
import HospitalDashboard from "@/features/dashboard/pages/HospitalDashboard";
import Request from "@/features/requests/pages/Request";
import HospitalRequests from "@/features/requests/pages/HospitalRequests";
import HospitalRequestDetails from "@/features/request-details/pages/HospitalRequestDetails";
import HospitalProfile from "@/features/hospitals_management/pages/HospitalProfile";
import Users from "@/features/users/pages/Users";
import AdminLayout from "@/app/layouts/AdminLayout";
import SignIn from "@/features/auth/pages/SignIn";
import SignUp from "@/features/auth/pages/SignUp";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import ResetPassword from "@/features/auth/pages/ResetPassword";
import Settings from "@/features/settings/pages/Settings";
import HospitalsManagement from "@/features/hospitals_management/pages/HospitalsManagement";
import AmbulancesManagement from "@/features/ambulances_management/pages/AmbulancesManagement";
import HospitalUserLayout from "../layouts/HospitalUserLayout";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/shared/common/NotFound";
import Audits from "@/features/audits/Audits";
import RequestDetails from "@/features/request-details/pages/RequestDetails";
import AuthRoute from "./AuthRoute";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="Admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashBoard /> },
      { path: "requests", element: <Request /> },
      { path: "hospitals_management", element: <HospitalsManagement /> },
      { path: "ambulances_management", element: <AmbulancesManagement /> },
      { path: "users", element: <Users /> },
      { path: "audits", element: <Audits /> },
      { path: "settings", element: <Settings /> },
      { path: "request_details/:id", element: <RequestDetails /> },
    ],
  },

  {
    path: "/hospital_user",
    element: (
      <ProtectedRoute requiredRole="hospitaladmin">
        <HospitalUserLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HospitalDashboard /> },
      { path: "requests", element: <HospitalRequests /> },
      { path: "request_details/:id", element: <HospitalRequestDetails /> },
      { path: "profile", element: <HospitalProfile /> },
      { path: "settings", element: <Settings /> },
    ],
  },

  {
    path: "/signin",
    element: (
      <AuthRoute>
        <SignIn />
      </AuthRoute>
    ),
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: (
      <AuthRoute>
        <SignIn />
      </AuthRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
