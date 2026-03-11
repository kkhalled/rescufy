import { useState } from "react";
import SideBar from "../../shared/common/SideBar";
import { Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "../../shared/common/AdminNavBar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <SideBar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 md:ltr:ml-22 md:rtl:mr-22">
        <AdminNavbar onMenuClick={toggleSidebar} />

        {/* Main Content with top padding for fixed navbar */}
        <main className="flex-1 pt-20 md:pt-24 pb-6 px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
