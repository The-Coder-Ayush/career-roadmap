// This file automatically selects the correct API URL
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const API_URL = isLocal 
  ? "http://localhost:5000/api" 
  : "https://career-roadmap-tri3.onrender.com/api"; // Updated with your actual Render Backend URL

export default API_URL;
