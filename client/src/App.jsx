import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GenerateRoadmap from "./pages/GenerateRoadmap";
import RoadmapDetail from "./pages/RoadmapDetail"; // <--- IMPORT THE NEW PAGE
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks"; 
// This component handles the layout logic
const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      {!isAuthPage && <Sidebar />}
      <div className={`flex-1 ${!isAuthPage ? 'ml-64' : 'ml-0'}`}>
        {!isAuthPage && <Navbar />}
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/roadmap" element={<GenerateRoadmap />} />
            
            {/* THIS IS THE MISSING ROUTE */}
            <Route path="/roadmap/:id" element={<RoadmapDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;