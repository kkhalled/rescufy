import { createBrowserRouter } from "react-router-dom";


import Ambulances from "@/features/Ambulances/pages/Ambulances";
import DashBoard from "@/features/dashboard/pages/DashBoard";
import Hospitals from "@/features/hospitals/pages/Hospitals";
import Request from "@/features/requests/pages/Request";
import Users from "@/features/users/pages/Users";
import AdminLayout from "@/app/layouts/AdminLayout";

import SignIn from "@/features/auth/pages/SignIn";
import SignUp from "@/features/auth/pages/SignUp";
import Settings from "@/features/settings/pages/Settings";



const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashBoard /> },
      { path: "requests", element: <Request /> },
      { path: "hospitals", element: <Hospitals /> },
      { path: "ambulances", element: <Ambulances /> },
      { path: "users", element: <Users /> },
      { path: "settings", element: <Settings /> },

    ],
  },

  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

export default router;
