import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router";

import AdminLayout from "@/app/layouts/AdminLayout";
import HospitalUserLayout from "../layouts/HospitalUserLayout";
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";
import Loading from "@/shared/common/Loading";
import Analytics from "@/features/analytics/pages/Analytics";

const DashBoard = lazy(() => import("@/features/dashboard/pages/DashBoard"));
const HospitalDashboard = lazy(
  () => import("@/features/hospital_dashboard/pages/HospitalDashboard"),
);
const Request = lazy(() => import("@/features/requests/pages/Request"));
const HospitalRequests = lazy(
  () => import("@/features/requests/pages/HospitalRequests"),
);
const HospitalRequestDetails = lazy(
  () => import("@/features/request-details/pages/HospitalRequestDetails"),
);
const HospitalProfile = lazy(
  () => import("@/features/hospitals_management/pages/HospitalProfile"),
);
const AdminHospitalProfile = lazy(
  () => import("@/features/hospitals_management/pages/AdminHospitalProfile"),
);
const Users = lazy(() => import("@/features/users/pages/Users"));
const SignIn = lazy(() => import("@/features/auth/pages/SignIn"));
const ForgotPassword = lazy(
  () => import("@/features/auth/pages/ForgotPassword"),
);
const ResetPassword = lazy(() => import("@/features/auth/pages/ResetPassword"));
const Settings = lazy(() => import("@/features/settings/pages/Settings"));
const HospitalsManagement = lazy(
  () => import("@/features/hospitals_management/pages/HospitalsManagement"),
);
const AmbulancesManagement = lazy(
  () => import("@/features/ambulances_management/pages/AmbulancesManagement"),
);
const AmbulanceProfile = lazy(
  () => import("@/features/ambulances_management/pages/AmbulanceProfile"),
);

const RequestDetails = lazy(
  () => import("@/features/request-details/pages/RequestDetails"),
);
const NotFound = lazy(() => import("@/shared/common/NotFound"));

const withLoading = (element: ReactNode) => (
  <Suspense fallback={<Loading />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      
      <ProtectedRoute requiredRole="Admin">
        <AdminLayout />
      </ProtectedRoute>
     
    ),
    children: [
      { index: true, element: withLoading(<DashBoard />) },
      { path: "requests", element: withLoading(<Request />) },
      {
        path: "hospitals_management",
        element: withLoading(<HospitalsManagement />),
      },
      {
        path: "hospitals_management/:id",
        element: withLoading(<AdminHospitalProfile />),
      },
      {
        path: "ambulances_management",
        element: withLoading(<AmbulancesManagement />),
      },
      {
        path: "ambulances_management/:id",
        element: withLoading(<AmbulanceProfile />),
      },
      { path: "users", element: withLoading(<Users />) },

      { path: "settings", element: withLoading(<Settings />) },
      { path: "analytics", element: withLoading(<Analytics />) },
      {
        path: "requests/:id",
        element: withLoading(<RequestDetails />),
      },
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
      { index: true, element: withLoading(<HospitalDashboard />) },
      { path: "requests", element: withLoading(<HospitalRequests />) },
      {
        path: "requests/:id",
        element: withLoading(<HospitalRequestDetails />),
      },
      { path: "profile", element: withLoading(<HospitalProfile />) },
      { path: "settings", element: withLoading(<Settings />) },
    ],
  },

  {
    path: "/signin",
    element: <AuthRoute>{withLoading(<SignIn />)}</AuthRoute>,
  },

  {
    path: "/forgot-password",
    element: withLoading(<ForgotPassword />),
  },
  {
    path: "/reset-password",
    element: withLoading(<ResetPassword />),
  },
  {
    path: "/",
    element: <AuthRoute>{withLoading(<SignIn />)}</AuthRoute>,
  },
  {
    path: "*",
    element: withLoading(<NotFound />),
  },
]);

export default router;
