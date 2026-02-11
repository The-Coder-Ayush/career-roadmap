import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar"; // Import Sidebar
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import GenerateRoadmap from "./pages/GenerateRoadmap";
import Tasks from "./pages/Tasks";
import RoadmapDetails from "./pages/RoadmapDetails";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";


// Layout Wrapper to handle Sidebar logic
const AppLayout = ({ children }) => {
  const location = useLocation();
  // Hide Sidebar on Login/Signup
  const isAuthPage = ["/", "/login", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* 1. Navbar (Fixed Top) */}
      {!isAuthPage && <Navbar />}

      <div className="flex">
        {/* 2. Sidebar (Fixed Left - Desktop Only) */}
        {!isAuthPage && <Sidebar />}

        {/* 3. Main Content Area */}
        {/* 'md:ml-64' pushes content right on desktop to make room for Sidebar */}
        {/* 'w-full' ensures it takes remaining width */}
        <main className={`flex-1 transition-all duration-300 ${!isAuthPage ? "md:ml-64" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
         
          
          {/* Protected Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generate-roadmap" element={<GenerateRoadmap />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/roadmap/:id" element={<RoadmapDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;