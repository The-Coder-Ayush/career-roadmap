import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { FaTrophy, FaTimes, FaRocket } from "react-icons/fa";

const LevelUpModal = ({ newLevel, onClose }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Play Sound Effect on Mount
  useEffect(() => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3"); // Free success sound
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play failed (user interaction needed)"));

    // Handle Resize for Confetti
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      
      {/* Full Screen Confetti */}
      <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />

      <div className="relative bg-[#1e293b] border-2 border-yellow-400/50 p-8 rounded-3xl text-center max-w-md w-full shadow-[0_0_50px_rgba(250,204,21,0.3)] transform scale-100 animate-bounce-in">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <FaTimes className="text-xl" />
        </button>

        {/* Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-500/40">
          <FaTrophy className="text-5xl text-white drop-shadow-md" />
        </div>

        {/* Text */}
        <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">LEVEL UP!</h2>
        <p className="text-gray-400 mb-6">You are now</p>
        
        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8 drop-shadow-lg filter">
          LEVEL {newLevel}
        </div>

        {/* Button */}
        <button 
          onClick={onClose}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:scale-105 text-white font-bold py-4 rounded-xl shadow-lg transition-transform flex items-center justify-center gap-2"
        >
          <FaRocket /> Keep Grinding
        </button>

      </div>
    </div>
  );
};

export default LevelUpModal;