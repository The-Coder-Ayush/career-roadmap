import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaCheckCircle, FaRegCircle, FaTasks, FaMagic, FaSpinner, FaLayerGroup } from "react-icons/fa";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmapIds, setSelectedRoadmapIds] = useState([]); 
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const tasksRes = await fetch("http://localhost:5000/api/tasks", {
          headers: { "x-auth-token": token },
        });
        const tasksData = await tasksRes.json();
        setTasks(tasksData);

        const mapsRes = await fetch("http://localhost:5000/api/roadmaps", {
          headers: { "x-auth-token": token },
        });
        const mapsData = await mapsRes.json();
        setRoadmaps(mapsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleRoadmapSelection = (id) => {
    setSelectedRoadmapIds(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      return [...prev, id];
    });
  };

  // --- ADD TASK (Manual) ---
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Manual tasks don't have a specific roadmap linked (or we could let user choose)
    await saveTask(input, null); 
    setInput("");
  };

  // --- SAVE TASK HELPER ---
  const saveTask = async (text, roadmapId = null) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-auth-token": token 
        },
        body: JSON.stringify({ text, roadmapId }), // Sending roadmapId to DB
      });
      const newTask = await response.json();
      setTasks(prev => [newTask, ...prev]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // --- GENERATE AI TASKS ---
  const handleGenerateAiTasks = async () => {
    if (selectedRoadmapIds.length === 0) {
      alert("Please select at least one roadmap to focus on today.");
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:5000/api/ai/suggest-tasks", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-auth-token": token 
        },
        body: JSON.stringify({ roadmapIds: selectedRoadmapIds })
      });

      const data = await response.json();

      if (!response.ok) {
        // Now handling errors gracefully without crashing
        alert(data.msg || "Failed to generate tasks");
        return;
      }

      // The AI now returns objects: { text: "Do X", roadmapId: "123" }
      // We save them with their ID so the AI remembers them next time!
      for (const item of data) {
        await saveTask(item.text, item.roadmapId);
      }

      alert(`✨ Generated ${data.length} tasks tailored to your progress!`);

    } catch (error) {
      console.error("AI Gen Error:", error);
      alert("Could not generate tasks. Check console for details.");
    } finally {
      setGenerating(false);
    }
  };

  const handleToggle = async (id) => {
    const updatedTasks = tasks.map(t => t._id === id ? { ...t, isCompleted: !t.isCompleted } : t);
    setTasks(updatedTasks);
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/tasks/${id}`, { method: "PUT", headers: { "x-auth-token": token } });
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/tasks/${id}`, { method: "DELETE", headers: { "x-auth-token": token } });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) { console.error(error); }
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <span className="bg-cyan-500/20 p-2 rounded-xl text-cyan-400"><FaTasks /></span>
            Smart Daily Manager
          </h1>
          <p className="text-gray-400">AI remembers your last task and plans the next step.</p>
        </div>

        {/* AI GENERATOR SECTION */}
        <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 mb-10 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <FaLayerGroup className="text-cyan-400" />
            <h3 className="font-bold text-lg">Select Focus Areas for Today:</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {roadmaps.length === 0 && <p className="text-gray-500 text-sm">No roadmaps found.</p>}
            
            {roadmaps.map(map => {
              const isSelected = selectedRoadmapIds.includes(map._id);
              // Count how many tasks are completed for this roadmap (optional visual)
              const completedSteps = map.steps.filter(s => s.completed).length;
              
              return (
                <div 
                  key={map._id}
                  onClick={() => toggleRoadmapSelection(map._id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between
                    ${isSelected 
                      ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]" 
                      : "bg-black/20 border-white/5 hover:bg-white/5"
                    }
                  `}
                >
                  <div>
                    <h4 className={`font-bold ${isSelected ? "text-cyan-300" : "text-gray-400"}`}>{map.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Current Step: <span className="text-gray-300">{map.steps.find(s => !s.completed)?.title || "Done"}</span>
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${isSelected ? "bg-cyan-500 border-cyan-500" : "border-gray-500"}
                  `}>
                    {isSelected && <FaCheckCircle className="text-black text-sm" />}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleGenerateAiTasks}
            disabled={generating || roadmaps.length === 0 || selectedRoadmapIds.length === 0}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? <FaSpinner className="animate-spin text-xl" /> : <FaMagic className="text-xl" />}
            {generating ? "Reviewing History & Generating Tasks..." : "Generate Next Logical Tasks"}
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Your Schedule</h3>
          
          <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
             <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a custom task..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
            />
            <button type="submit" disabled={!input.trim()} className="bg-gray-700 hover:bg-gray-600 px-6 rounded-lg font-bold transition-colors">
              <FaPlus />
            </button>
          </form>

          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your schedule is clear.</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${task.isCompleted ? "bg-green-500/5 border-green-500/20 opacity-60" : "bg-white/5 border-white/10"}`}>
                <div className="flex items-center gap-4 flex-1">
                  <button onClick={() => handleToggle(task._id)} className={`text-xl transition-all ${task.isCompleted ? "text-green-500" : "text-gray-500 hover:text-cyan-400"}`}>
                    {task.isCompleted ? <FaCheckCircle /> : <FaRegCircle />}
                  </button>
                  <span className={`${task.isCompleted ? "line-through text-gray-500" : "text-white"}`}>{task.text}</span>
                </div>
                <button onClick={() => handleDelete(task._id)} className="text-gray-600 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100"><FaTrash /></button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Tasks;