import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaMap, FaSpinner, FaDownload } from "react-icons/fa";
import RoadmapDisplay from "../components/RoadmapDisplay";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const RoadmapDetail = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  
  // Ref to capture the specific content we want to print
  const printRef = useRef();

  // --- 1. Fetch Roadmap ---
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/roadmaps/${id}`, {
          headers: { "x-auth-token": token },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || "Failed to load roadmap");
        setRoadmap(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [id]);

  // --- 2. Handle Step Toggle ---
  const handleToggle = async (stepIndex) => {
    try {
      const token = localStorage.getItem("token");
      const updatedSteps = [...roadmap.steps];
      updatedSteps[stepIndex].completed = !updatedSteps[stepIndex].completed;
      setRoadmap({ ...roadmap, steps: updatedSteps });

      await fetch(`http://localhost:5000/api/roadmaps/${id}/step/${stepIndex}`, {
        method: "PUT",
        headers: { "x-auth-token": token },
      });
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // --- 3. Handle PDF Download ---
  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    setIsExporting(true);

    try {
      // Create canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        backgroundColor: "#0f172a", // Dark background match
        useCORS: true
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Calculate dimensions to fit A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${roadmap.title.replace(/\s+/g, "_")}_Roadmap.pdf`);

    } catch (err) {
      console.error("PDF Export failed", err);
      alert("Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-cyan-400"><FaSpinner className="animate-spin text-4xl" /></div>;
  if (error) return <div className="text-center mt-20 text-red-400"><h2>Error</h2><p>{error}</p><Link to="/" className="text-white underline block mt-4">Back to Dashboard</Link></div>;
  if (!roadmap) return null;

  return (
    <div className="min-h-screen text-white p-8">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <FaArrowLeft /> Back to Dashboard
        </Link>
        
        {/* DOWNLOAD BUTTON */}
        <button 
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition-all text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50"
        >
          {isExporting ? <FaSpinner className="animate-spin" /> : <FaDownload />}
          {isExporting ? "Generating..." : "Download PDF"}
        </button>
      </div>

      {/* --- CONTENT TO PRINT (Wrapped in Ref) --- */}
      <div ref={printRef} className="p-4 md:p-8 bg-[#0f172a]"> {/* Added padding/bg for clean print */}
        
        {/* Header Card */}
        <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 mb-12 backdrop-blur-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400"><FaMap /></span>
                {roadmap.title}
              </h1>
              <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">{roadmap.summary}</p>
            </div>
            
            <div className="text-right bg-black/20 p-6 rounded-xl border border-white/5 min-w-[200px]">
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Est. Salary</div>
              <div className="text-3xl font-mono text-green-400 font-bold">{roadmap.salary_range}</div>
              <div className="text-xs text-gray-500 mt-2">
                Growth Score: <span className="text-yellow-400 font-bold">{roadmap.growth_score}/10</span> 🚀
              </div>
            </div>
          </div>
        </div>

        {/* The Timeline Display */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-white mb-12">Your Career Path 🚀</h3>
          <RoadmapDisplay steps={roadmap.steps} onToggle={handleToggle} />
        </div>
        
        {/* Footer for PDF */}
        <div className="text-center text-gray-600 mt-12 text-sm">
          Generated by AI Career Architect
        </div>
      </div>

    </div>
  );
};

export default RoadmapDetail;