// client/src/components/Layout.jsx

import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // <--- Import your existing Sidebar

const Layout = () => {
  const token = localStorage.getItem("token");

  // Protect the route
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      {/* The Sidebar sits here */}
      <Sidebar />

      {/* The Page Content sits here */}
      <main className="flex-1 p-0 md:p-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;