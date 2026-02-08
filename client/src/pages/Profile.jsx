import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaSignOutAlt, FaTrash, FaSpinner, FaCalendarAlt } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/user", {
          headers: { "x-auth-token": token },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          // If token is invalid, log out
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error loading user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // 2. Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload(); // Clear state
  };

  // 3. Handle Delete Account
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This will delete all your generated roadmaps permanently.")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/delete", {
        method: "DELETE",
        headers: { "x-auth-token": token },
      });

      if (response.ok) {
        alert("Account deleted.");
        handleLogout();
      }
    } catch (error) {
      console.error("Error deleting account", error);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-cyan-400"><FaSpinner className="animate-spin text-4xl" /></div>;

  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-2xl mx-auto">
        
        <h1 className="text-3xl font-bold mb-8 border-b border-white/10 pb-4">My Profile</h1>

        {/* User Info Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 backdrop-blur-lg">
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg shadow-cyan-500/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-gray-400 flex items-center gap-2 mt-1">
                <FaEnvelope className="text-sm" /> {user?.email}
              </p>
              <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                <FaCalendarAlt className="text-xs" /> Member since {new Date(user?.date).toLocaleDateString()}
              </p>
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/5 py-4 rounded-xl transition-all font-bold"
          >
            <FaSignOutAlt /> Sign Out
          </button>
          
          <button 
            onClick={handleDeleteAccount}
            className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-4 rounded-xl transition-all font-bold"
          >
            <FaTrash /> Delete Account
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;