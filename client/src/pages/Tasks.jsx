import { useState, useEffect } from "react";
import { FaCheckCircle, FaRegCircle, FaMagic, FaLightbulb, FaTimes, FaRobot, FaTrash, FaMap } from "react-icons/fa";
import ReactMarkdown from 'react-markdown'; 
import LevelUpModal from "../components/LevelUpModal"; 
import BadgeModal from "../components/BadgeModal"; 
import API_URL from "../config"; // Import Config

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmaps, setSelectedRoadmaps] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  // Helper Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  // Gamification States
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);
  
  // Badge State
  const [showBadge, setShowBadge] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const tasksRes = await fetch(`${API_URL}/tasks`, { headers: { "x-auth-token": token } });
        const tasksData = await tasksRes.json();
        setTasks(tasksData);

        const mapsRes = await fetch(`${API_URL}/roadmaps`, { headers: { "x-auth-token": token } });
        const mapsData = await mapsRes.json();
        setRoadmaps(mapsData);
        if (mapsData.length > 0) setSelectedRoadmaps(mapsData.map(m => m._id));

        // Get initial user level
        const userRes = await fetch(`${API_URL}/auth`, { headers: { "x-auth-token": token } });
        const userData = await userRes.json();
        if(userData) setCurrentLevel(userData.level);

      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // --- ACTIONS ---

  const toggleRoadmapSelection = (id) => {
    if (selectedRoadmaps.includes(id)) setSelectedRoadmaps(selectedRoadmaps.filter(r => r !== id));
    else setSelectedRoadmaps([...selectedRoadmaps, id]);
  };

  const handleGenerate = async () => {
    if (selectedRoadmaps.length === 0) return alert("Please select at least one roadmap!");
    setGenerating(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/ai/suggest-tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ roadmapIds: selectedRoadmaps })
      });
      const newTasksData = await res.json();

      const savedTasks = [];
      for (const taskItem of newTasksData) {
        const saveRes = await fetch(`${API_URL}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-auth-token": token },
          body: JSON.stringify({ text: taskItem.text, roadmap: taskItem.roadmapId || selectedRoadmaps[0] })
        });
        savedTasks.push(await saveRes.json());
      }
      setTasks([...savedTasks, ...tasks]);
    } catch (err) { console.error("Generation Error:", err); alert("Failed to generate tasks."); } finally { setGenerating(false); }
  };

  const toggleTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "x-auth-token": token },
      });
      const data = await res.json(); 

      setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: !t.isCompleted } : t));

      // 1. Check Level Up
      if (data.userLevel > currentLevel) {
        setNewLevel(data.userLevel);
        setCurrentLevel(data.userLevel);
        setShowLevelUp(true);
      }

      // 2. Check New Badge
      if (data.newBadge && data.newBadge.id) {
        setEarnedBadge(data.newBadge.id); 
        setShowBadge(true);
      }

    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE", headers: { "x-auth-token": token } });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) { console.error(err); }
  };

  const askAI = async (taskText) => {
    setModalOpen(true);
    setModalLoading(true);
    setModalContent(""); 
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/ai/help`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ taskText, context: "Programming" })
      });
      const data = await res.json();
      setModalContent(data.advice);
    } catch (err) { setModalContent("Failed to get help."); } finally { setModalLoading(false); }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Mission Control...</div>;

  return (
    <div className="min-h-screen p-4 md:p-12 text-white bg-[#0f172a] relative">
      
      {/* --- MODALS --- */}
      {showLevelUp && <LevelUpModal newLevel={newLevel} onClose={() => setShowLevelUp(false)} />}
      
      {showBadge && <BadgeModal badgeKey={earnedBadge} onClose={() => setShowBadge(false)} />}

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3"><FaMagic className="text-cyan-400" /> Daily Mission Control</h1>
          <p className="text-gray-400">Select roadmaps to generate a mixed daily schedule.</p>
        </div>

        <div className="bg-[#1e293b] border border-white/10 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><FaMap className="text-cyan-400" /> Select Active Roadmaps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {roadmaps.map(map => {
              const isSelected = selectedRoadmaps.includes(map._id);
              return (
                <button
                  key={map._id}
                  onClick={() => toggleRoadmapSelection(map._id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${isSelected ? "bg-cyan-900/20 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]" : "bg-black/20 border-white/10 text-gray-400 hover:bg-white/5"}`}
                >
                  <span className="truncate font-medium">{map.title}</span>
                  {isSelected && <FaCheckCircle className="text-cyan-400" />}
                </button>
              );
            })}
          </div>
          <button onClick={handleGenerate} disabled={generating || selectedRoadmaps.length === 0} className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${generating ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-105 shadow-lg shadow-cyan-500/20 text-white"}`}>
            {generating ? "Generating..." : <><FaMagic /> Generate Daily Plan ({selectedRoadmaps.length})</>}
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Your Active Quests</h2>
          {tasks.length === 0 ? <div className="text-center py-10 text-gray-500 bg-white/5 rounded-2xl border border-white/5 border-dashed">No active tasks.</div> : tasks.map((task) => (
            <div key={task._id} className={`group bg-[#1e293b] border border-white/10 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center gap-4 transition-all hover:border-cyan-500/50 ${task.isCompleted ? "opacity-50" : ""}`}>
              <div className="flex items-start gap-4 flex-1">
                <button onClick={() => toggleTask(task._id)} className="text-2xl mt-1 text-gray-500 hover:text-green-400 transition-colors shrink-0">
                  {task.isCompleted ? <FaCheckCircle className="text-green-500" /> : <FaRegCircle />}
                </button>
                <p className={`text-lg break-words ${task.isCompleted ? "line-through text-gray-500" : "text-white"}`}>{task.text}</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                {!task.isCompleted && <button onClick={() => askAI(task.text)} className="flex-1 md:flex-none text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all"><FaLightbulb /> Help</button>}
                <button onClick={() => deleteTask(task._id)} className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all"><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Helper Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-[#1e293b] border border-white/20 rounded-2xl w-[95%] md:max-w-2xl max-h-[85vh] flex flex-col relative shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-xl font-bold flex items-center gap-2 text-cyan-400"><FaRobot /> AI Mentor</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white p-2"><FaTimes className="text-xl" /></button>
            </div>
            <div className="p-6 overflow-y-auto text-gray-300 leading-relaxed custom-scrollbar">
              {modalLoading ? <p className="animate-pulse text-center">Analyzing...</p> : <div className="prose prose-invert max-w-none"><ReactMarkdown>{modalContent}</ReactMarkdown></div>}
            </div>
            <div className="p-4 border-t border-white/10 text-right bg-[#1e293b] rounded-b-2xl">
              <button onClick={() => setModalOpen(false)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl font-bold">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;