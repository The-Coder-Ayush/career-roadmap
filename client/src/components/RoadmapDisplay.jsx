import { motion } from "framer-motion";
import { FaClock, FaBookOpen, FaTrophy, FaCheck, FaExternalLinkAlt } from "react-icons/fa";

// Accept 'onToggle' function to handle clicks
const RoadmapDisplay = ({ steps, onToggle }) => {
  return (
    <div className="relative max-w-4xl mx-auto py-10 px-4">
      
      {/* Central Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent opacity-30"></div>

      <div className="space-y-12">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isCompleted = step.completed === true; 

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative flex items-center md:justify-between ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              
              {/* --- CONTENT CARD --- */}
              <div className="ml-12 md:ml-0 md:w-[45%]">
                <div className={`p-6 rounded-2xl border backdrop-blur-md shadow-xl transition-all duration-300 group
                  ${isCompleted 
                    ? "bg-green-500/10 border-green-500/50 shadow-green-500/20" 
                    : "bg-white/5 border-white/10 hover:border-cyan-500/30" 
                  }
                `}>
                  
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider
                      ${isCompleted ? "bg-green-500/20 text-green-400" : (isLast ? "bg-yellow-500/20 text-yellow-300" : "bg-cyan-500/20 text-cyan-300")}
                    `}>
                      {isCompleted ? "COMPLETED" : (isLast ? "Goal Reached" : `Phase 0${index + 1}`)}
                    </span>
                    <div className="flex items-center text-gray-400 text-xs gap-1">
                      <FaClock /> {step.duration}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-xl font-bold mb-2 transition-colors ${isCompleted ? "text-green-400" : "text-white group-hover:text-cyan-400"}`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* --- SMART RESOURCE LINKS (UPDATED) --- */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                    {step.resources && step.resources.map((res, i) => {
                      // Create a Smart Search URL
                      const searchQuery = encodeURIComponent(`${res} ${step.title} tutorial`);
                      const searchUrl = `https://www.google.com/search?q=${searchQuery}`;

                      return (
                        <a 
                          key={i} 
                          href={searchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] bg-black/30 px-3 py-1.5 rounded-full text-gray-300 border border-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/50 transition-all cursor-pointer group/link"
                        >
                          <FaBookOpen className="text-purple-400 group-hover/link:text-cyan-300" /> 
                          {res}
                          <FaExternalLinkAlt className="opacity-0 group-hover/link:opacity-100 text-[8px] ml-1 transition-opacity" />
                        </a>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* --- INTERACTIVE CENTER ICON --- */}
              <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                <button 
                  onClick={() => onToggle && onToggle(index)}
                  disabled={!onToggle}
                  className={`w-10 h-10 rounded-full border-4 border-[#0f172a] shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 flex items-center justify-center transition-all duration-300 hover:scale-110
                    ${isCompleted 
                      ? "bg-green-500 text-black scale-110" 
                      : (isLast ? "bg-yellow-500 text-black" : "bg-gray-700 text-white hover:bg-cyan-500")}
                  `}
                >
                   {isCompleted ? <FaCheck /> : (isLast ? <FaTrophy size={14} /> : <span className="text-xs font-bold">{index + 1}</span>)}
                </button>
              </div>

              <div className="hidden md:block md:w-[45%]" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapDisplay;