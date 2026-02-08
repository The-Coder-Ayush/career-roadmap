import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaMap, FaArrowRight, FaTrash } from "react-icons/fa";

const Dashboard = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [user, setUser] = useState({ name: "User" });

  useEffect(() => {
    // 1. Get User Info
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // 2. Fetch Saved Roadmaps
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/roadmaps", {
        headers: { "x-auth-token": token },
      });
      const data = await response.json();
      if (response.ok) setRoadmaps(data);
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
    }
  };

  // Optional: Delete Function
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this roadmap?")) return;
    
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5000/api/roadmaps/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": token },
      });
      // Refresh list after delete
      setRoadmaps(roadmaps.filter(r => r._id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name} 👋</h1>
          <p className="text-gray-400">Here are your saved career paths.</p>
        </div>
        <Link 
          to="/roadmap" 
          className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105"
        >
          <FaPlus /> New Roadmap
        </Link>
      </div>

      {/* Stats Cards (Optional visual flair) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="text-4xl mb-2">🚀</div>
          <div className="text-2xl font-bold">{roadmaps.length}</div>
          <div className="text-gray-400 text-sm">Active Roadmaps</div>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-gray-400 text-sm">Steps Completed</div>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="text-4xl mb-2">💎</div>
          <div className="text-2xl font-bold">Pro</div>
          <div className="text-gray-400 text-sm">Plan Status</div>
        </div>
      </div>

      {/* Saved Roadmaps Grid */}
      <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-2">Your Career Paths</h2>
      
      {roadmaps.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
          <FaMap className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No roadmaps found.</p>
          <Link to="/roadmap" className="text-cyan-400 hover:underline mt-2 inline-block">
            Create your first one now &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((map) => (
            <div key={map._id} className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 hover:border-cyan-500/50 transition-all group relative">
              
              <div className="flex justify-between items-start mb-4">
                <div className="bg-cyan-500/10 text-cyan-400 p-3 rounded-lg">
                  <FaMap size={24} />
                </div>
                <button 
                  onClick={() => handleDelete(map._id)}
                  className="text-gray-600 hover:text-red-400 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                {map.title}
              </h3>
              
              <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                {map.summary}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-xs text-gray-500 font-mono">
                  {new Date(map.createdAt).toLocaleDateString()}
                </span>
                <Link 
                  to={`/roadmap/${map._id}`} 
                  className="text-sm font-bold flex items-center gap-1 text-cyan-400 hover:gap-2 transition-all"
                >
                  View Path <FaArrowRight />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;