import { Link } from "react-router-dom";
import { FaRocket, FaGamepad, FaBrain, FaTrophy, FaArrowRight, FaCode, FaChartLine } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <FaRocket className="text-white text-sm" />
          </div>
          <span>Career<span className="text-cyan-400">AI</span></span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2 rounded-lg font-bold text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-6 py-2 rounded-lg font-bold bg-white text-black hover:bg-gray-200 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-cyan-400 mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          v2.0 is now live with Gamification!
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Turn your Career Goals into a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Video Game
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop guessing what to learn next. Generate personalized AI roadmaps, complete daily quests, earn XP, and level up your real-world skills.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/Signup" 
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-105 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            Start Your Quest <FaArrowRight />
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-[#1e293b] border border-white/10 hover:bg-white/5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            Resume Game
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-12">
          <div>
            <div className="text-3xl font-bold text-white mb-1">10k+</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">50k+</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Quests Done</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">120+</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Skills Tracked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">User Rating</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-[#1e293b]/50 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-cyan-500/30 transition-all group">
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaBrain className="text-2xl text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Roadmap Generator</h3>
            <p className="text-gray-400 leading-relaxed">
              Tell us your dream role (e.g. "React Developer"), and our AI builds a step-by-step curriculum tailored just for you.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#1e293b]/50 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-cyan-500/30 transition-all group">
            <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaGamepad className="text-2xl text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Gamified Learning</h3>
            <p className="text-gray-400 leading-relaxed">
              Earn XP for every task. Maintain daily streaks. Unlock badges. Compete on the leaderboard. Making learning addictive.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#1e293b]/50 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-cyan-500/30 transition-all group">
            <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaTrophy className="text-2xl text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Daily Tasks</h3>
            <p className="text-gray-400 leading-relaxed">
              Don't know what to do today? Click "Generate" and get 3 specific, actionable tasks based on your current progress.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-gray-500 text-sm">
        <p>© 2026 CareerAI. Build your future, one pixel at a time.</p>
      </footer>

    </div>
  );
};

export default Home;