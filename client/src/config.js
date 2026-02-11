// This file automatically selects the correct API URL
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const API_URL = isLocal 
  ? "http://localhost:5000/api" 
  : "https://your-careerai-backend.onrender.com/api"; // You will update this URL after deploying the backend

export default API_URL;