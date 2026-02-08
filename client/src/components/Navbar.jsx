import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added Link
import { FaSearch, FaBell, FaUserCircle, FaSignOutAlt, FaUser } from "react-icons/fa"; // Added FaUser

const Navbar = () => {
  const navigate = useNavigate();
  // Initialize with a default object to prevent errors if data is missing
  const [user, setUser] = useState({ name: "Student", email: "" });
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      // If no token, redirect to login (Optional security check)
      navigate("/login");
    } else if (storedUser) {
      try {
        // Safely parse the user data
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        // If data is corrupted, clear it
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center bg-[#0f172a] p-4 mb-4 border-b border-white/10">
      
      {/* Search Bar */}
      <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-96 focus-within:border-cyan-500/50 focus-within:bg-black/20 transition-all">
        <FaSearch className="text-gray-400 mr-3" />
        <input 
          type="text" 
          placeholder="Search skills, jobs, or roadmaps..." 
          className="bg-transparent border-none focus:outline-none text-white w-full placeholder-gray-500"
        />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-6">
        
        {/* Notification Bell */}
        <div className="relative cursor-pointer group">
          <FaBell className="text-gray-400 text-xl group-hover:text-white transition-colors" />
          <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 focus:outline-none hover:bg-white/5 p-2 rounded-xl transition-all"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-cyan-400">Pro Member</p>
            </div>
            <FaUserCircle className="text-3xl text-gray-300" />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
              
              {/* User Email Header */}
              <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Signed in as</p>
                <p className="text-sm font-bold text-white truncate">{user.email}</p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                {/* 1. NEW PROFILE LINK */}
                <Link 
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors"
                >
                  <FaUser className="text-cyan-400" /> Your Profile
                </Link>

                {/* 2. LOGOUT BUTTON */}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors border-t border-white/5"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;