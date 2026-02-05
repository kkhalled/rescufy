import { Outlet } from "react-router-dom";

export default function HospitalUserLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-22">
        {/* Main Content with top padding for fixed navbar */}
        <main className="flex-1 pt-20 md:pt-24 pb-6 px-4 md:px-8 lg:px-12 overflow-y-auto">
          <Outlet />
          <h2 className="text-2xl font-bold text-white">Hospital User </h2>
        </main>
      </div>
    </div>
  );
}
