import { Link } from "react-router-dom";
import { FaGhost, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] -z-10"></div>

      <div className="relative group">
        <div className="absolute inset-0 bg-cyan-500 blur-[60px] opacity-20 rounded-full group-hover:opacity-30 transition-opacity"></div>
        <FaGhost className="text-9xl text-gray-700 relative z-10 animate-bounce drop-shadow-2xl" />
      </div>
      
      <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-600 to-gray-800 mt-8 tracking-tighter">
        404
      </h1>
      
      <h2 className="text-2xl md:text-4xl font-bold mt-2 text-white flex items-center justify-center gap-3">
        <FaExclamationTriangle className="text-yellow-500" /> Page Not Found
      </h2>
      
      <p className="text-gray-400 mt-6 max-w-md text-lg leading-relaxed">
        Oops! The quest you are looking for has been deleted or never existed. You have wandered into the void.
      </p>

      <Link 
        to="/dashboard" 
        className="mt-10 bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-105 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
      >
        <FaArrowLeft /> Return to Base
      </Link>
    </div>
  );
};

export default NotFound;