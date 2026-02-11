import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaRocket } from "react-icons/fa";
import API_URL from "../config"; // Import Config

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        // Force a page reload or navigate to update the Navbar state immediately
        navigate("/dashboard");
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Server error. Check if backend is running.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
            <FaRocket className="text-3xl text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Login to continue your journey</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="relative group">
            <FaEnvelope className="absolute left-4 top-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email Address"
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
              required
            />
          </div>

          <div className="relative group">
            <FaLock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
              required
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-[1.02] transition-all py-3.5 rounded-xl font-bold text-white shadow-lg mt-2">
            Log In
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account? <Link to="/signup" className="text-cyan-400 font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;