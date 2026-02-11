import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRocket, FaPlus, FaFire, FaTrophy, FaChartLine, FaArrowRight, FaGamepad, FaMap, FaTrash } from "react-icons/fa";
import API_URL from "../config";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const userRes = await fetch(`${API_URL}/auth`, { headers: { "x-auth-token": token } });
      const userData = await userRes.json();
      setUser(userData);

      const mapRes = await fetch(`${API_URL}/roadmaps`, { headers: { "x-auth-token": token } });
      const mapData = await mapRes.json();
      setRoadmaps(mapData);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // --- DELETE FUNCTION ---
  const handleDeleteRoadmap = async (e, id) => {
    e.preventDefault(); // Stop Link from redirecting
    if (!window.confirm("Are you sure you want to delete this roadmap? This cannot be undone.")) return;

    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/roadmaps/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": token }
      });
      // Remove from UI immediately
      setRoadmaps(roadmaps.filter(map => map._id !== id));
    } catch (err) {
      alert("Failed to delete roadmap");
    }
  };

  if (loading) return <div className="text-white text-center mt-20 animate-pulse">Loading Command Center...</div>;

  const nextLevelXp = user.level * 100 + 100; 
  const progressPercent = (user.xp % 100); 

  return (
    <div className="min-h-screen p-6 md:p-12 text-white bg-[#0f172a] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* --- HUD --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gradient-to-r from-[#1e293b] to-[#0f172a] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name.split(' ')[0]}!</h1>
                  <p className="text-gray-400 text-sm">Ready to level up your career today?</p>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Current Level</div>
                  <div className="text-4xl font-black text-cyan-400">{user.level}</div>
                </div>
              </div>
              <div className="bg-black/40 rounded-full h-4 w-full overflow-hidden border border-white/5 relative group">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-1000 relative" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <div className="flex justify-between mt-2 text-xs font-bold text-gray-500">
                <span>{user.xp} XP</span>
                <span>Next Level: {Math.ceil(user.xp / 100) * 100} XP</span>
              </div>
            </div>
            <FaGamepad className="absolute -bottom-6 -right-6 text-9xl text-white/5 rotate-12" />
          </div>

          <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-orange-500/30 transition-all">
            <FaFire className="text-3xl text-orange-500 animate-pulse mb-4" />
            <div className="text-4xl font-black text-white mb-1">{user.streak || 0}</div>
            <div className="text-xs font-bold text-orange-400 uppercase tracking-widest">Day Streak</div>
          </div>
        </div>

        {/* --- ROADMAPS --- */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3"><FaMap className="text-purple-400" /> Active Roadmaps</h2>
            <Link to="/generate-roadmap" className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-400/10 px-4 py-2 rounded-lg"><FaPlus /> New Path</Link>
          </div>

          {roadmaps.length === 0 ? (
            <div className="text-center py-16 bg-[#1e293b] border border-white/10 rounded-3xl border-dashed">
              <h3 className="text-xl font-bold text-gray-300">No active quests</h3>
              <p className="text-gray-500 mb-6">Generate your first AI learning roadmap.</p>
              <Link to="/generate-roadmap" className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold transition-all">Generate Roadmap</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmaps.map((map) => {
                const totalSteps = map.steps.length;
                const completedSteps = map.steps.filter(s => s.completed).length;
                const percent = Math.round((completedSteps / totalSteps) * 100);

                return (
                  <Link 
                    to={`/roadmap/${map._id}`} 
                    key={map._id}
                    className="group bg-[#1e293b] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all relative overflow-hidden block"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-600"></div>
                    
                    {/* Header with Delete Button */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold truncate pr-4 flex-1">{map.title}</h3>
                      <button 
                        onClick={(e) => handleDeleteRoadmap(e, map._id)} 
                        className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors z-20 relative"
                        title="Delete Roadmap"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">{map.summary}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-cyan-400">{percent}% Complete</span>
                        <span className="text-gray-500">{completedSteps}/{totalSteps} Steps</span>
                      </div>
                      <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* --- ACTIONS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/tasks" className="bg-gradient-to-br from-purple-900/40 to-purple-600/10 border border-purple-500/20 p-6 rounded-2xl flex items-center justify-between group hover:border-purple-500/50 transition-all">
            <div><h3 className="text-xl font-bold text-white mb-1">Daily Missions</h3></div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center"><FaTrophy className="text-purple-400 text-xl" /></div>
          </Link>

          <Link to="/leaderboard" className="bg-gradient-to-br from-yellow-900/40 to-yellow-600/10 border border-yellow-500/20 p-6 rounded-2xl flex items-center justify-between group hover:border-yellow-500/50 transition-all">
            <div><h3 className="text-xl font-bold text-white mb-1">Leaderboard</h3></div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center"><FaChartLine className="text-yellow-400 text-xl" /></div>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;