import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCompass, FaTasks, FaChartLine, FaRocket, FaCode, FaServer } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const active = location.pathname;

  const menuItems = [
    { name: "Dashboard", icon: <FaChartLine />, path: "/" },
    { name: "Generate Roadmap", icon: <FaRocket />, path: "/roadmap" }, // New Feature Link!
    { name: "Daily Tasks", icon: <FaTasks />, path: "/tasks" },
  ];

  // Mock Data for "Saved Paths" (We will fetch this from DB later)
  const savedPaths = [
    { name: "MERN Stack", icon: <FaCode /> },
    { name: "DevOps Engineer", icon: <FaServer /> },
  ];

  return (
    <div className="h-screen w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 fixed left-0 top-0 flex flex-col p-5 overflow-y-auto">
      
      {/* Logo */}
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-10 pl-2">
        CareerPath AI
      </h1>

      {/* Main Menu */}
      <div className="mb-8">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4 pl-4">Menu</p>
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                ${active === item.path 
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Paths Section */}
      <div>
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4 pl-4">Your Paths</p>
        <div className="flex flex-col gap-2">
          {savedPaths.map((path) => (
            <button
              key={path.name}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all w-full text-left"
            >
              <span className="text-lg text-purple-400">{path.icon}</span>
              <span className="font-medium">{path.name}</span>
            </button>
          ))}
          
          {/* Add New Path Button */}
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 border border-dashed border-gray-700 hover:border-gray-500 hover:text-gray-300 transition-all w-full mt-2">
            <span className="text-lg">+</span>
            <span className="font-medium text-sm">Add New Path</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;