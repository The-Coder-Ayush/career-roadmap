import { Link, useLocation } from "react-router-dom";
import { FaMap, FaTasks, FaPlus, FaRocket, FaCog, FaChartLine } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  // Helper to check active link
  const isActive = (path) => location.pathname === path;

  // Define menu items
  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <FaMap /> },
    { path: "/tasks", name: "Daily Tasks", icon: <FaTasks /> },
    { path: "/generate-roadmap", name: "New Roadmap", icon: <FaPlus /> },
    { path: "/leaderboard", name: "Leaderboard", icon: <FaChartLine /> },
  ];

  return (
    // Hidden on Mobile (md:hidden), Visible on Desktop (md:flex)
    // Fixed position, below the Navbar (top-20), full height
    <aside className="hidden md:flex flex-col w-64 bg-[#0f172a] border-r border-white/10 fixed left-0 top-20 h-[calc(100vh-5rem)] p-4 z-40">
      
      <div className="space-y-2">
        <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Main Menu
        </p>

        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              isActive(item.path)
                ? "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className={`text-lg ${isActive(item.path) ? "text-cyan-400" : "text-gray-500"}`}>
              {item.icon}
            </span>
            {item.name}
          </Link>
        ))}
      </div>

      {/* Bottom Section (Optional) */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <Link 
          to="/profile" 
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <FaCog className="text-lg" />
          Settings
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;