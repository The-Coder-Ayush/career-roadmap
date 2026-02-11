import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMagic, FaClock, FaBriefcase, FaArrowRight, FaBrain, FaSave, FaTrash, FaRedo } from "react-icons/fa";
import API_URL from "../config";

const GenerateRoadmap = () => {
  const navigate = useNavigate();
  
  // States
  const [formData, setFormData] = useState({ role: "", duration: "3 Months", hours: 10 });
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null); // <--- NEW: Holds the AI result temporarily

  // 1. Generate (AI Only, No Save)
  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      setPreviewData(data); // Store in preview, don't save to DB yet!

    } catch (err) {
      console.error(err);
      alert("AI Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Save (Commit to Database)
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/roadmaps`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(previewData)
      });

      const savedMap = await res.json();
      navigate(`/roadmap/${savedMap._id}`); // Go to details

    } catch (err) {
      alert("Failed to save roadmap.");
    }
  };

  // 3. Discard
  const handleDiscard = () => {
    setPreviewData(null);
    setFormData({ role: "", duration: "3 Months", hours: 10 });
  };

  return (
    <div className="min-h-screen p-6 md:p-12 text-white bg-[#0f172a] flex items-center justify-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3">
            <FaMagic className="text-cyan-400" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              AI Career Architect
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            {previewData ? "Review your generated path below." : "Tell us your dream role, and we will build a personalized curriculum."}
          </p>
        </div>

        {/* --- FORM SECTION (Hide if Preview exists) --- */}
        {!previewData && (
          <div className="bg-[#1e293b] border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden animate-fade-in-up">
            
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <FaBrain className="text-4xl text-cyan-400 animate-bounce" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Analyzing Industry Trends...</h2>
                <p className="text-gray-400 max-w-sm">
                  Crafting a path for <span className="text-cyan-400 font-bold">{formData.role}</span>...
                </p>
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                  <FaBriefcase /> Target Role
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Full Stack Developer, Data Scientist..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white text-lg focus:outline-none focus:border-cyan-500 transition-all"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                    <FaClock /> Timeline
                  </label>
                  <select 
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  >
                    <option>1 Month (Crash Course)</option>
                    <option>3 Months (Standard)</option>
                    <option>6 Months (Deep Dive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Hours / Week: <span className="text-cyan-400">{formData.hours}h</span>
                  </label>
                  <input 
                    type="range" 
                    min="2" 
                    max="40" 
                    className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    value={formData.hours}
                    onChange={(e) => setFormData({...formData, hours: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !formData.role}
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-[1.02] text-white shadow-lg transition-all"
              >
                {loading ? "Generating..." : <>Generate Roadmap <FaArrowRight /></>}
              </button>
            </form>
          </div>
        )}

        {/* --- PREVIEW SECTION (Show if Preview exists) --- */}
        {previewData && (
          <div className="bg-[#1e293b] border border-white/10 p-8 rounded-3xl shadow-2xl animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-2">{previewData.title}</h2>
            <p className="text-gray-400 mb-6">{previewData.summary}</p>

            <div className="space-y-3 mb-8">
              {previewData.steps.slice(0, 3).map((step, i) => (
                <div key={i} className="p-4 bg-black/20 rounded-xl border border-white/5">
                  <h4 className="font-bold text-cyan-400 text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              ))}
              {previewData.steps.length > 3 && (
                <p className="text-center text-xs text-gray-500 italic">+ {previewData.steps.length - 3} more steps...</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleDiscard}
                className="py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 flex items-center justify-center gap-2 transition-all"
              >
                <FaRedo /> Discard
              </button>
              <button 
                onClick={handleSave}
                className="py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-500 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-all"
              >
                <FaSave /> Save to Profile
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GenerateRoadmap;