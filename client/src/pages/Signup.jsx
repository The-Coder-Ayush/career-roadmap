import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaRocket } from "react-icons/fa";
import API_URL from "../config"; // Import Config

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "" 
  });

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Register User
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // Save token and redirect
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.msg || "Registration failed");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      alert("Server Error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
            <FaRocket className="text-3xl text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join CareerAI and start your journey</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Name Field */}
          <div className="relative group">
            <FaUser className="absolute left-4 top-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Full Name"
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
              required
            />
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
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
              minLength="6"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="relative group">
            <FaLock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              placeholder="Confirm Password"
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all py-3.5 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/20 mt-2"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;