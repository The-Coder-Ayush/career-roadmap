import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Login failed");
      }

      // CRITICAL STEP: Save the token FIRST
      localStorage.setItem("token", data.token);

      // THEN redirect
      navigate("/");
      window.location.reload(); // Force refresh to update Navbar
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f172a] text-white">
      <div className="bg-white/5 p-8 rounded-2xl border border-white/10 w-96 backdrop-blur-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-sm text-center border border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex items-center bg-black/30 rounded-lg px-4 py-3 border border-white/10 focus-within:border-cyan-400 transition-colors">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email Address"
              className="bg-transparent border-none focus:outline-none text-white w-full"
              required
            />
          </div>
          <div className="flex items-center bg-black/30 rounded-lg px-4 py-3 border border-white/10 focus-within:border-cyan-400 transition-colors">
            <FaLock className="text-gray-400 mr-3" />
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              className="bg-transparent border-none focus:outline-none text-white w-full"
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 py-3 rounded-lg font-bold transition-all flex justify-center items-center gap-2">
            <FaSignInAlt /> Login
          </button>
        </form>
        
        <p className="mt-4 text-center text-gray-400 text-sm">
          Don't have an account? <Link to="/register" className="text-cyan-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;