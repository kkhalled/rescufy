import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../../components/SideBar";
import { Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavBar";
import { useMediaQuery } from "../../shared/hooks/useMediaQuery";
import Footer from "@/components/Footer";

export default function AdminLayout() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const [isExpanded,setIsExpanded]=useState(false);

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
            transition={{ duration: 0.01 }}
            className="fixed inset-0 bg-black/10 z-40 backdrop-blur-xs"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <SideBar isOpen={sidebarOpen} onClose={closeSidebar} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ltr:ml-10 md:rtl:mr-10">
        <AdminNavbar onMenuClick={toggleSidebar} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

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