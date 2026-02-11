import { useState, useEffect } from "react";
import { FaTrophy, FaMedal, FaCrown, FaUserAstronaut } from "react-icons/fa";
import API_URL from "../config"; // Import Config

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_URL}/users/leaderboard`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading Ranks...</div>;

  return (
    <div className="min-h-screen p-6 md:p-12 text-white bg-[#0f172a] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <FaCrown className="text-yellow-400" /> Hall of Fame
          </h1>
          <p className="text-gray-400">Top learners on CareerAI</p>
        </div>

        {/* --- TOP 3 PODIUM (Desktop) --- */}
        {users.length >= 3 && (
          <div className="hidden md:flex justify-center items-end gap-6 mb-16">
            
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#1e293b] border-4 border-gray-400 flex items-center justify-center text-2xl font-bold mb-2 shadow-lg relative">
                {users[1].name.charAt(0)}
                <div className="absolute -bottom-3 bg-gray-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">2nd</div>
              </div>
              <p className="font-bold text-gray-300">{users[1].name}</p>
              <p className="text-cyan-400 text-sm">{users[1].xp} XP</p>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-8">
              <FaCrown className="text-yellow-400 text-3xl mb-2 animate-bounce" />
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-yellow-200 flex items-center justify-center text-4xl font-bold mb-2 shadow-yellow-500/50 shadow-2xl relative">
                {users[0].name.charAt(0)}
                <div className="absolute -bottom-3 bg-yellow-400 text-black text-xs font-bold px-3 py-0.5 rounded-full">1st</div>
              </div>
              <p className="font-bold text-xl text-yellow-400">{users[0].name}</p>
              <p className="text-white font-bold">{users[0].xp} XP</p>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#1e293b] border-4 border-orange-700 flex items-center justify-center text-2xl font-bold mb-2 shadow-lg relative">
                {users[2].name.charAt(0)}
                <div className="absolute -bottom-3 bg-orange-700 text-black text-xs font-bold px-2 py-0.5 rounded-full">3rd</div>
              </div>
              <p className="font-bold text-orange-400">{users[2].name}</p>
              <p className="text-cyan-400 text-sm">{users[2].xp} XP</p>
            </div>

          </div>
        )}

        {/* --- FULL LIST --- */}
        <div className="bg-[#1e293b] border border-white/10 rounded-3xl overflow-hidden">
          {users.map((user, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                index < 3 ? "bg-white/5" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold ${
                  index === 0 ? "bg-yellow-500 text-black" :
                  index === 1 ? "bg-gray-400 text-black" :
                  index === 2 ? "bg-orange-700 text-white" :
                  "bg-[#0f172a] text-gray-500"
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-xs text-gray-500">Level {user.level || 1}</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-cyan-400">{user.xp} XP</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;