import { createBrowserRouter } from "react-router";

import DashBoard from "@/features/dashboard/pages/DashBoard";
import Request from "@/features/requests/pages/Request";
import Users from "@/features/users/pages/Users";
import AdminLayout from "@/app/layouts/AdminLayout";
import SignIn from "@/features/auth/pages/SignIn";
import SignUp from "@/features/auth/pages/SignUp";
import Settings from "@/features/settings/pages/Settings";
import HospitalsManagement from "@/features/hospitals_management/pages/HospitalsManagement";
import AmbulancesManagement from "@/features/ambulances_management/pages/AmbulancesManagement";
import HospitalUserLayout from "../layouts/HospitalUserLayout";
import AmbulanceUserLayout from "../layouts/AmbulanceUserLayout";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/shared/common/NotFound";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashBoard /> },
      { path: "requests", element: <Request /> },
      { path: "hospitals_management", element: <HospitalsManagement /> },
      { path: "ambulances_management", element: <AmbulancesManagement /> },
      { path: "users", element: <Users /> },
      { path: "settings", element: <Settings /> },
    ],
  },

  {
    path: "/hospital_user",
    element: (
      <ProtectedRoute requiredRole="hospital">
        <HospitalUserLayout />
      </ProtectedRoute>
    ),
    children: [],
  },
  {
    path: "/ambulance_user",
    element: (
      <ProtectedRoute requiredRole="ambulance">
        <AmbulanceUserLayout />
      </ProtectedRoute>
    ),
    children: [],
  },

  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
