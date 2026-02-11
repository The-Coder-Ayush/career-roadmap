import { useEffect } from "react";
import Confetti from "react-confetti"; // Reuse your confetti
import { FaTimes, FaMedal } from "react-icons/fa";

// Reuse badge metadata for consistent colors/icons
const BADGE_META = {
  EARLY_BIRD: { label: "Early Bird", color: "text-green-400", bg: "bg-green-500/20", icon: "🐦", desc: "Completed a task before 9 AM!" },
  TASK_ROOKIE: { label: "Task Rookie", color: "text-blue-400", bg: "bg-blue-500/20", icon: "📝", desc: "Completed your first 5 tasks." },
  TASK_MASTER: { label: "Task Master", color: "text-yellow-400", bg: "bg-yellow-500/20", icon: "🏆", desc: "Completed 25 tasks. You're unstoppable!" },
  STREAK_WARRIOR: { label: "Streak Warrior", color: "text-orange-500", bg: "bg-orange-500/20", icon: "🔥", desc: "Maintained a 3-day streak." },
  LEVEL_5_BOSS: { label: "Level 5 Boss", color: "text-purple-400", bg: "bg-purple-500/20", icon: "👑", desc: "Reached Level 5. A true legend." }
};

const BadgeModal = ({ badgeKey, onClose }) => {
  const badge = BADGE_META[badgeKey] || { label: "New Badge", color: "text-white", bg: "bg-gray-500", icon: "🏅", desc: "You unlocked a new achievement!" };

  useEffect(() => {
    // Play a "success" sound
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"); 
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio blocked"));
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <Confetti recycle={false} numberOfPieces={300} colors={['#FFD700', '#FFA500', '#ffffff']} />

      <div className="relative bg-[#1e293b] border-2 border-yellow-400/50 p-8 rounded-3xl text-center max-w-sm w-full shadow-[0_0_50px_rgba(250,204,21,0.2)] animate-bounce-in">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <FaTimes className="text-xl" />
        </button>

        {/* Glowing Icon Background */}
        <div className={`w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center text-6xl shadow-2xl ${badge.bg} ${badge.color} border-4 border-[#1e293b] outline outline-4 outline-yellow-500/30`}>
          {badge.icon}
        </div>

        <h2 className="text-gray-400 uppercase tracking-widest text-sm font-bold mb-2">Achievement Unlocked</h2>
        <h1 className={`text-3xl font-black text-white mb-3 ${badge.color}`}>{badge.label}</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">{badge.desc}</p>

        <button 
          onClick={onClose}
          className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:scale-105 text-white font-bold py-3 rounded-xl shadow-lg transition-all"
        >
          Awesome!
        </button>

      </div>
    </div>
  );
};

export default BadgeModal;