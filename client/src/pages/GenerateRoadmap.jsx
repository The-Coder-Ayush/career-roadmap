import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMagic, FaSpinner, FaRocket, FaClock, FaBrain } from "react-icons/fa";

const GenerateRoadmap = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [duration, setDuration] = useState("3 months");
  const [hours, setHours] = useState("10");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    // 1. Get the Token
    const token = localStorage.getItem("token");
    
    // 2. specific check: If no token, force login
    if (!token) {
      alert("You must be logged in to generate a roadmap.");
      navigate("/login");
      return;
    }

    if (!role.trim()) {
      alert("Please enter a role (e.g., Frontend Developer)");
      return;
    }

    setLoading(true);

    try {
      // 3. Send the request WITH the token in headers
      const response = await fetch("http://localhost:5000/api/ai/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-auth-token": token // <--- THIS WAS MISSING
        },
        body: JSON.stringify({ role, duration, hours }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to generate roadmap");
      }

      // 4. Success! Go to the view page
      navigate(`/roadmap/${data._id}`);

    } catch (error) {
      console.error("AI Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 mb-4 border border-white/5">
            <FaBrain className="text-4xl text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            AI Career Architect
          </h1>
          <p className="text-gray-400 text-lg">
            Design your personalized learning path in seconds.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          
          {/* Role Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">Dream Role</label>
            <div className="relative group">
              <FaRocket className="absolute left-4 top-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, Data Scientist..." 
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-black/40 transition-all placeholder-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 ml-1">Timeline</label>
              <div className="relative group">
                <FaClock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
                >
                  <option value="1 month">1 Month (Crash Course)</option>
                  <option value="3 months">3 Months (Standard)</option>
                  <option value="6 months">6 Months (Deep Dive)</option>
                </select>
              </div>
            </div>

            {/* Hours Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 ml-1">Hours / Week</label>
              <div className="relative group">
                <span className="absolute left-4 top-3.5 text-gray-500 font-bold group-focus-within:text-purple-400 transition-colors">H</span>
                <input 
                  type="number" 
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  min="1"
                  max="40"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:bg-black/40 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all py-4 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <FaSpinner className="animate-spin text-2xl" /> : <FaMagic className="text-xl" />}
            {loading ? "Designing Your Future..." : "Generate Roadmap"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default GenerateRoadmap;