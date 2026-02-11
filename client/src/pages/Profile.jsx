import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaEnvelope, FaEdit, FaSave, FaTimes, FaLock, FaFire, FaMedal, FaUserShield, FaTrash, FaExclamationTriangle, FaKey } from "react-icons/fa";
import API_URL from "../config"; // Import Config

// Define Badge Visuals
const BADGE_META = {
  EARLY_BIRD: { label: "Early Bird", color: "text-green-400", bg: "bg-green-500/10", icon: "🐦" },
  TASK_ROOKIE: { label: "Task Rookie", color: "text-blue-400", bg: "bg-blue-500/10", icon: "📝" },
  TASK_MASTER: { label: "Task Master", color: "text-yellow-400", bg: "bg-yellow-500/10", icon: "🏆" },
  STREAK_WARRIOR: { label: "Streak Warrior", color: "text-orange-500", bg: "bg-orange-500/10", icon: "🔥" },
  LEVEL_5_BOSS: { label: "Level 5 Boss", color: "text-purple-400", bg: "bg-purple-500/10", icon: "👑" }
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Form States
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passData, setPassData] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  
  // Feedback States
  const [passMessage, setPassMessage] = useState({ type: "", text: "" });
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/auth`, {
        headers: { "x-auth-token": token },
      });
      const data = await res.json();
      setUser(data);
      setFormData({ name: data.name, email: data.email });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- 1. UPDATE PROFILE ---
  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser); 
        setIsEditingProfile(false); 
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  // --- 2. CHANGE PASSWORD ---
  const handleChangePass = async (e) => {
    e.preventDefault();
    
    // Validation
    if (passData.newPassword !== passData.confirmNewPassword) {
      setPassMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }
    if (passData.newPassword.length < 6) {
        setPassMessage({ type: "error", text: "Password must be at least 6 characters." });
        return;
    }

    setPassLoading(true);
    setPassMessage({ type: "", text: "" });

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/users/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ 
            currentPassword: passData.currentPassword, 
            newPassword: passData.newPassword 
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.msg || "Failed to update password");
      
      setPassMessage({ type: "success", text: "Password updated successfully!" });
      setPassData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      
      // Close modal after short delay on success
      setTimeout(() => {
        setIsChangingPassword(false);
        setPassMessage({ type: "", text: "" });
      }, 1500);

    } catch (err) {
      setPassMessage({ type: "error", text: err.message });
    } finally {
      setPassLoading(false);
    }
  };

  // --- 3. DELETE ACCOUNT ---
  const handleDeleteAccount = async () => {
    const confirm = window.prompt("Type 'DELETE' to confirm account deletion. This cannot be undone.");
    if (confirm !== "DELETE") return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/users/account`, {
        method: "DELETE",
        headers: { "x-auth-token": token }
      });

      if (res.ok) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err) {
      alert("Failed to delete account");
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Profile...</div>;

  const userBadges = user.badges || [];

  return (
    <div className="min-h-screen p-4 md:p-12 text-white bg-[#0f172a] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>
      
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* --- HERO SECTION --- */}
        <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-purple-600"></div>

          {/* Avatar */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl md:text-5xl font-bold shadow-2xl shadow-cyan-500/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#0f172a] p-2 rounded-full border border-white/10">
              <span className="bg-yellow-500 text-black text-[10px] md:text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                LVL {user.level}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left space-y-2 min-w-0 w-full">
            <h1 className="text-2xl md:text-4xl font-bold truncate px-2 md:px-0">{user.name}</h1>
            <p className="text-gray-400 text-sm md:text-base flex items-center justify-center md:justify-start gap-2 truncate px-2 md:px-0">
              <FaEnvelope /> {user.email}
            </p>
            
            {/* XP Bar */}
            <div className="mt-4 max-w-md mx-auto md:mx-0 px-2 md:px-0">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-cyan-400">Current XP: {user.xp}</span>
                <span className="text-gray-500">Next Level: {(Math.floor(user.xp / 100) + 1) * 100}</span>
              </div>
              <div className="w-full bg-black/40 h-2 md:h-3 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full transition-all duration-1000" 
                  style={{ width: `${user.xp % 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="absolute top-3 right-3 md:top-6 md:right-6 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 md:p-3 rounded-xl transition-all z-20"
            title="Edit Details"
          >
            <FaEdit className="text-lg md:text-xl" />
          </button>
        </div>

        {/* --- STATS & BADGES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Stats Column */}
          <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2">
              <FaFire className="text-orange-500" /> Career Stats
            </h3>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-white/5 p-2 md:p-4 rounded-2xl flex flex-col items-center justify-center min-h-[90px] hover:bg-white/10 transition-colors">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{user.xp}</div>
                <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider text-center leading-tight">Total XP</div>
              </div>
              <div className="bg-white/5 p-2 md:p-4 rounded-2xl flex flex-col items-center justify-center min-h-[90px] hover:bg-white/10 transition-colors">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{user.level}</div>
                <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider text-center leading-tight">Current Level</div>
              </div>
              <div className="bg-white/5 p-2 md:p-4 rounded-2xl flex flex-col items-center justify-center min-h-[90px] hover:bg-white/10 transition-colors">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{user.streak || 0}</div>
                <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider text-center leading-tight">Day Streak</div>
              </div>
              <div className="bg-white/5 p-2 md:p-4 rounded-2xl flex flex-col items-center justify-center min-h-[90px] hover:bg-white/10 transition-colors">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{userBadges.length}</div>
                <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider text-center leading-tight break-all">Badges</div>
              </div>
            </div>
          </div>

          {/* Badges Column */}
          <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2">
              <FaMedal className="text-yellow-400" /> Trophy Case
            </h3>
            <div className="space-y-3">
              {Object.keys(BADGE_META).map((badgeId) => {
                const isUnlocked = userBadges.includes(badgeId);
                const badge = BADGE_META[badgeId];
                
                return (
                  <div key={badgeId} className={`flex items-center gap-3 md:gap-4 p-3 rounded-2xl border transition-all ${
                    isUnlocked 
                      ? `${badge.bg} border-white/5` 
                      : "bg-black/20 border-transparent opacity-50"
                  }`}>
                    <div className={`text-xl md:text-2xl shrink-0 ${isUnlocked ? "" : "grayscale"}`}>
                      {isUnlocked ? badge.icon : <FaLock className="text-gray-600 text-base md:text-lg" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-bold text-sm ${isUnlocked ? "text-white" : "text-gray-500"} truncate`}>
                        {badge.label}
                      </h4>
                      <p className="text-[10px] md:text-xs text-gray-500 truncate">
                        {isUnlocked ? "Unlocked!" : "Locked"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- ACCOUNT ACTIONS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            {/* Security Box */}
            <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                    <FaUserShield className="text-cyan-400" /> Account Security
                </h3>
                <p className="text-gray-400 mb-6 text-sm">Update your password to keep your account safe.</p>
                <button 
                    onClick={() => setIsChangingPassword(true)}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-cyan-600/20 px-6 py-3 rounded-xl font-bold transition-all"
                >
                    <FaKey /> Change Password
                </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-red-400">
                    <FaExclamationTriangle /> Danger Zone
                </h3>
                <p className="text-gray-400 mb-6 text-sm">
                    Deleting your account is permanent. This cannot be undone.
                </p>
                <button 
                    onClick={handleDeleteAccount}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 px-6 py-3 rounded-xl font-bold transition-all"
                >
                    <FaTrash /> Delete My Account
                </button>
            </div>
        </div>

        {/* --- EDIT PROFILE MODAL --- */}
        {isEditingProfile && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-lg relative shadow-2xl animate-fade-in-up">
              
              <button 
                onClick={() => setIsEditingProfile(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
              >
                <FaTimes className="text-xl" />
              </button>

              <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
                <FaEdit className="text-cyan-400" /> Edit Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleSaveProfile} 
                  className="w-full md:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-105 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                >
                  <FaSave /> Save Changes
                </button>
              </div>

            </div>
          </div>
        )}

        {/* --- CHANGE PASSWORD MODAL --- */}
        {isChangingPassword && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-lg relative shadow-2xl animate-fade-in-up">
              
              <button 
                onClick={() => {
                    setIsChangingPassword(false);
                    setPassMessage({ type: "", text: "" });
                    setPassData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
                }} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
              >
                <FaTimes className="text-xl" />
              </button>

              <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
                <FaLock className="text-cyan-400" /> Change Password
              </h3>

              <form onSubmit={handleChangePass} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Current Password</label>
                  <input 
                    type="password" 
                    required
                    value={passData.currentPassword}
                    onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passData.newPassword}
                    onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passData.confirmNewPassword}
                    onChange={(e) => setPassData({...passData, confirmNewPassword: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                {passMessage.text && (
                  <div className={`text-sm p-3 rounded-lg flex items-center gap-2 ${passMessage.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                    {passMessage.text}
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={passLoading}
                    className="w-full md:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-105 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                  >
                    {passLoading ? "Updating..." : <><FaSave /> Update Password</>}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;