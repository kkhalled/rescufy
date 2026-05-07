import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../../shared/common/SideBar";
import { Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "../../shared/common/AdminNavBar";
import { useMediaQuery } from "../../shared/hooks/useMediaQuery";
import Footer from "@/shared/common/Footer";

export default function AdminLayout() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);

  const location = useLocation();

  // 👇 يخلي الحالة sync مع الشاشة
  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const closeSidebar = () => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">

      {/* Overlay (mobile only) */}
      <AnimatePresence>
        {sidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <SideBar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ltr:ml-10 md:rtl:mr-10">
        <AdminNavbar onMenuClick={toggleSidebar} />

        <main className="flex-1 pt-20 md:pt-24 pb-6 md:px-10 lg:px-5  overflow-y-auto">
          
          <AnimatePresence mode="wait">
            <motion.div  
              key={location.pathname}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              
              transition={{ duration: 1 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>

        </main>
        <Footer/>
      </div>
    </div>
  );
}