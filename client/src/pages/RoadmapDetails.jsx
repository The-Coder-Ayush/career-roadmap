import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaRegCircle, FaBookOpen, FaClock, FaTrophy } from "react-icons/fa";
import API_URL from "../config"; // Import Config

const RoadmapDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap();
  }, [id]);

  const fetchRoadmap = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/roadmaps/${id}`, {
        headers: { "x-auth-token": token },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRoadmap(data);
    } catch (err) {
      console.error(err);
      navigate("/dashboard"); // Redirect if not found
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = async (index) => {
    // 1. Optimistic UI Update (Instant feedback)
    const newSteps = [...roadmap.steps];
    newSteps[index].completed = !newSteps[index].completed;
    setRoadmap({ ...roadmap, steps: newSteps });

    // 2. API Call
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/roadmaps/${id}/step/${index}`, {
        method: "PUT",
        headers: { "x-auth-token": token },
      });
      // No need to re-fetch if successful, we already updated UI
    } catch (err) {
      console.error("Error updating step", err);
      fetchRoadmap(); // Revert on error
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Roadmap...</div>;
  if (!roadmap) return null;

  // Calculate Progress
  const completedCount = roadmap.steps.filter(s => s.completed).length;
  const totalCount = roadmap.steps.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen p-6 md:p-12 text-white bg-[#0f172a] relative">
      <div className="max-w-4xl mx-auto">
        
        {/* --- HEADER --- */}
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <FaArrowLeft /> Back to Dashboard
        </button>

        <div className="bg-[#1e293b] border border-white/10 p-8 rounded-3xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{roadmap.title}</h1>
            <p className="text-gray-400 max-w-2xl mb-6">{roadmap.summary}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              <span className="bg-white/5 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <FaClock className="text-cyan-400" /> {roadmap.duration || "Self-Paced"}
              </span>
              <span className="bg-white/5 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <FaBookOpen className="text-purple-400" /> {totalCount} Modules
              </span>
            </div>

            {/* BIG PROGRESS BAR */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Total Progress</span>
                <span className="text-2xl font-bold text-cyan-400">{progress}%</span>
              </div>
              <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* --- STEPS LIST --- */}
        <div className="space-y-4">
          {roadmap.steps.map((step, index) => (
            <div 
              key={index}
              onClick={() => toggleStep(index)}
              className={`group p-6 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                step.completed 
                  ? "bg-green-500/5 border-green-500/20" 
                  : "bg-[#1e293b] border-white/10 hover:border-cyan-500/30"
              }`}
            >
              {/* Checkbox Icon */}
              <div className={`mt-1 text-2xl transition-colors ${step.completed ? "text-green-500" : "text-gray-600 group-hover:text-cyan-400"}`}>
                {step.completed ? <FaCheckCircle /> : <FaRegCircle />}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-2 ${step.completed ? "text-gray-400 line-through" : "text-white"}`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${step.completed ? "text-gray-600" : "text-gray-400"}`}>
                  {step.description}
                </p>
                
                {/* Resources (If any) */}
                {step.resources && step.resources.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {step.resources.map((res, i) => (
                      <span key={i} className="text-xs bg-black/30 text-gray-500 px-2 py-1 rounded border border-white/5">
                        {res}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {progress === 100 && (
          <div className="mt-8 p-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-3xl text-center animate-bounce-in">
            <FaTrophy className="text-5xl text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Roadmap Complete!</h2>
            <p className="text-yellow-200">You have mastered this skill path. Incredible work!</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default RoadmapDetails;