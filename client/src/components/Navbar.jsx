import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaSearch, FaBell, FaUserCircle, FaSignOutAlt, 
  FaRocket, FaTrophy, FaBars, FaTimes, FaMap, FaTasks, FaChartLine, FaPlus 
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if we are on auth pages
  const isAuthPage = ["/login", "/signup", "/"].includes(location.pathname);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/auth", {
          headers: { "x-auth-token": token },
        });
        const data = await res.json();
        if (data._id) setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  if (isAuthPage) return null;

  return (
    <nav className="bg-[#0f172a] border-b border-white/10 sticky top-0 z-50 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full gap-4">
          
          {/* --- LEFT: LOGO --- */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl text-white hover:text-cyan-400 transition-colors">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <FaRocket />
              </div>
              <span className="text-xl tracking-tight">CareerAI</span>
            </Link>
          </div>

          {/* --- CENTER: SEARCH (Desktop Only) --- */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search for skills, roadmaps, or jobs..." 
                className="w-full bg-[#1e293b] border border-white/10 text-white text-sm rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-[#0f172a] transition-all placeholder-gray-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-xs text-gray-600 border border-gray-700 rounded px-1.5 py-0.5">⌘K</span>
              </div>
            </div>
          </div>

          {/* --- RIGHT: ACTIONS --- */}
          <div className="flex items-center gap-3 md:gap-6">
            
            {/* XP BADGE (Desktop Only) */}
            {user && (
              <div className="hidden md:flex items-center gap-3 bg-[#1e293b] px-4 py-2 rounded-full border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Lvl {user.level || 1}</span>
                  <div className="w-20 h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full transition-all duration-1000" 
                      style={{ width: `${(user.xp || 0) % 100}%` }}
                    ></div>
                  </div>
                </div>
                <FaTrophy className="text-yellow-500 text-lg drop-shadow-lg" />
              </div>
            )}

            {/* Notification Bell */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5">
              <FaBell className="text-xl" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
            </button>

            {/* Profile Dropdown (Desktop) */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)} 
                className="flex items-center gap-3 hover:bg-white/5 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-white/10"
              >
                <FaUserCircle className="text-3xl text-gray-300" />
                <div className="text-left hidden xl:block">
                  <p className="text-sm font-semibold text-white leading-tight">{user?.name || "Guest"}</p>
                  <p className="text-[10px] text-cyan-400 font-bold">PRO MEMBER</p>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-60 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5 animate-fade-in-up">
                  {user && (
                    <div className="px-5 py-4 border-b border-white/5 bg-white/5">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">{user.email}</p>
                    </div>
                  )}
                  <div className="p-2">
                    <Link to="/profile" className="w-full text-left px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl flex items-center gap-3 transition-colors text-sm font-medium">
                      <FaUserCircle /> Your Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl flex items-center gap-3 transition-colors text-sm font-medium"
                    >
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* --- MOBILE HAMBURGER BUTTON --- */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>

          </div>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#0f172a] border-b border-white/10 shadow-2xl z-40 animate-slide-down">
          <div className="p-4 space-y-4">
            
            {/* Mobile Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-3.5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-[#1e293b] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Mobile Nav Links (Matches Sidebar Options) */}
            <div className="space-y-1">
              <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
                <FaMap className="text-cyan-400" /> Dashboard
              </Link>
              <Link to="/tasks" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
                <FaTasks className="text-cyan-400" /> Daily Tasks
              </Link>
              <Link to="/generate-roadmap" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
                <FaPlus className="text-cyan-400" /> New Roadmap
              </Link>
              <Link to="/leaderboard" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
                <FaChartLine className="text-cyan-400" /> Leaderboard
              </Link>
            </div>

            {/* Mobile User Profile */}
            {user && (
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between px-2 mb-4">
                  <div className="flex items-center gap-3">
                    <FaUserCircle className="text-4xl text-gray-400" />
                    <div>
                      <p className="text-white font-bold">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="text-xs font-bold text-cyan-400 block">LVL {user.level}</span>
                    <span className="text-[10px] text-gray-400">{user.xp % 100} / 100 XP</span>
                  </div>
                </div>
                <Link to="/profile" className="w-full py-3 mb-2 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 flex items-center justify-center gap-2">
                   <FaUserCircle /> Your Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl font-bold hover:bg-red-500/20 flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;