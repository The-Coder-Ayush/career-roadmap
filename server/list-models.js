const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function checkModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    console.log("Checking available models...");
    const modelResponse = await genAI.getGenerativeModel({ model: "gemini-pro" }); // Dummy init
    
    // This is the specific command to list all models
    // We need to bypass the helper to get the raw list if the helper fails, 
    // but let's try the direct list method first if available in your version.
    
    // Using the generic fetch to list models
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("\n✅ AVAILABLE MODELS:");
      data.models.forEach(m => {
        // Only show models that support 'generateContent'
        if (m.supportedGenerationMethods.includes("generateContent")) {
          console.log(`- ${m.name.replace("models/", "")}`);
        }
      });
    } else {
      console.log("❌ No models found. Error:", data);
    }

  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
  }
}

checkModels();