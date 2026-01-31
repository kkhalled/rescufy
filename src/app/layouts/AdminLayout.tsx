import SideBar from "@/app/layouts/SideBar";
// import AdminNavbar from "@/app/layouts/AdminNavbar";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavBar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col ">
        <AdminNavbar />
        <main className="flex-1 py-6 md:py-8 px-12 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
