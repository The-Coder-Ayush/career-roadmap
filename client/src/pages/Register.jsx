import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  const [error, setError] = useState("");

  const { name, email, password } = formData;

  // Update state when user types
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Form Submit
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // 1. Send data to backend
      // Note: Make sure your backend route is correct (usually /api/users for register)
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      // 2. Check for errors (like "User already exists")
      if (!response.ok) {
        throw new Error(data.msg || "Registration failed");
      }

      // 3. SUCCESS: Save token and redirect
      if (data.token) {
        localStorage.setItem("token", data.token);
        // Also save user info for the Navbar to see immediately
        localStorage.setItem("user", JSON.stringify({ name: name, email: email }));
        
        alert("Registration Successful! Welcome aboard 🚀");
        navigate("/"); // Go to Dashboard
        window.location.reload(); // Refresh to update Navbar
      } else {
        // Fallback if no token is sent (shouldn't happen with your backend)
        navigate("/login");
      }

    } catch (err) {
      console.error("Registration Error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f172a] text-white p-4">
      
      {/* Card Container */}
      <div className="bg-white/5 p-8 rounded-2xl border border-white/10 w-full max-w-md backdrop-blur-lg shadow-2xl">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Create Account
          </h2>
          <p className="text-gray-400 mt-2">Join us to build your AI career path</p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-6 text-sm text-center border border-red-500/50 flex items-center justify-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* Name Field */}
          <div className="group">
            <div className="flex items-center bg-black/30 rounded-xl px-4 py-3 border border-white/10 group-focus-within:border-cyan-500/50 group-focus-within:bg-black/50 transition-all">
              <FaUser className="text-gray-400 mr-3 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Full Name"
                className="bg-transparent border-none focus:outline-none text-white w-full placeholder-gray-500"
                required
                minLength="2"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="group">
            <div className="flex items-center bg-black/30 rounded-xl px-4 py-3 border border-white/10 group-focus-within:border-cyan-500/50 group-focus-within:bg-black/50 transition-all">
              <FaEnvelope className="text-gray-400 mr-3 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Email Address"
                className="bg-transparent border-none focus:outline-none text-white w-full placeholder-gray-500"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="group">
            <div className="flex items-center bg-black/30 rounded-xl px-4 py-3 border border-white/10 group-focus-within:border-cyan-500/50 group-focus-within:bg-black/50 transition-all">
              <FaLock className="text-gray-400 mr-3 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Password (Min 6 chars)"
                className="bg-transparent border-none focus:outline-none text-white w-full placeholder-gray-500"
                required
                minLength="6"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            <FaUserPlus /> Register Now
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-8 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline transition-colors">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;