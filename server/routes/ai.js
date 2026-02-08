const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require('../middleware/auth');
const Roadmap = require('../models/Roadmap');
const Task = require('../models/Task');
require('dotenv').config();

// --- 1. KEY ROTATION ---
const apiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
].filter(key => key);

const getGenAI = () => {
  if (apiKeys.length === 0) {
    console.error("❌ CRITICAL: No API Keys found in .env file.");
    throw new Error("API Key Missing");
  }
  const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
  return new GoogleGenerativeAI(randomKey);
};

// --- HELPER: ROBUST JSON CLEANER ---
const cleanAndParseJSON = (text) => {
  try {
    // 1. Remove markdown code blocks (```json ... ```)
    // We replace them with empty strings to handle the edges
    let clean = text.replace(/```json/g, '').replace(/```/g, '');

    // 2. Find the FIRST '{' and the LAST '}'
    // This fixes the bug where it was cutting off the JSON too early
    const firstOpen = clean.indexOf('{');
    const lastClose = clean.lastIndexOf('}');

    if (firstOpen !== -1 && lastClose !== -1) {
      // Extract exactly from the first { to the last }
      clean = clean.substring(firstOpen, lastClose + 1);
      
      // 3. Attempt to parse
      return JSON.parse(clean);
    }
    
    throw new Error("No JSON object found in response");
  } catch (e) {
    console.error("❌ JSON Parse Failed. Raw Text from AI:", text);
    throw new Error("AI response was not valid JSON.");
  }
};

// --- 2. ROADMAP GENERATOR ---
router.post('/generate', auth, async (req, res) => {
  const { role, duration, hours } = req.body;
  console.log(`🤖 Generating Roadmap for: ${role}`);

  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro" });

    const prompt = `
      Create a detailed learning roadmap for a "${role}".
      Duration: ${duration}. 
      Time Commitment: ${hours} hours/week.
      
      CRITICAL INSTRUCTION:
      Return ONLY a raw JSON object. Do not use Markdown.
      
      REQUIRED JSON STRUCTURE (Use these exact keys):
      {
        "title": "${role} Professional Roadmap",
        "summary": "Overview...",
        "salary_range": "$X - $Y",
        "growth_score": 9,
        "steps": [
          {
            "title": "Phase 1: ...",
            "description": "...",
            "duration": "...",
            "resources": ["Resource 1", "Resource 2"] 
          }
        ]
      }
      (Note: Use 'resources' array for links/topics. Do NOT use 'tools_and_resources' or 'topics'.)
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const roadmapData = cleanAndParseJSON(text);

    const newRoadmap = new Roadmap({ user: req.user.id, ...roadmapData });
    const savedRoadmap = await newRoadmap.save();
    console.log("✅ Roadmap Saved Successfully");
    res.json(savedRoadmap);

  } catch (error) {
    console.error("❌ SERVER ERROR in /generate:", error.message);
    res.status(500).json({ msg: "Failed to generate roadmap." });
  }
});


// --- 3. DAILY TASK GENERATOR ---
router.post('/suggest-tasks', auth, async (req, res) => {
  try {
    const { roadmapIds } = req.body;
    if (!roadmapIds || !Array.isArray(roadmapIds)) return res.status(400).json({ msg: "No roadmap selected." });

    const roadmaps = await Roadmap.find({ _id: { $in: roadmapIds }, user: req.user.id });
    if (roadmaps.length === 0) return res.status(404).json({ msg: "Roadmaps not found." });

    const perspectives = [
      "BUILDER MODE: Focus strictly on writing code.",
      "DEBUGGER MODE: Focus on testing and fixing.",
      "ARCHITECT MODE: Focus on structure/diagrams.",
      "TEACHER MODE: Explain complex concepts.",
      "PROJECT MODE: Build a tangible feature."
    ];
    const currentPerspective = perspectives[Math.floor(Math.random() * perspectives.length)];

    const roadmapContexts = await Promise.all(roadmaps.map(async (map) => {
      const currentStep = map.steps.find(s => !s.completed);
      
      const allTasks = await Task.find({ user: req.user.id, roadmap: map._id })
        .sort({ createdAt: -1 }).limit(50).select('text');
      const ignoreList = allTasks.map(t => t.text).join(" || ");

      const finishedCount = await Task.countDocuments({ user: req.user.id, roadmap: map._id, isCompleted: true });
      const virtualDay = Math.floor(finishedCount / 3) + 1;

      return {
        id: map._id,
        title: map.title,
        currentTopic: currentStep ? currentStep.title : "Final Review",
        virtualDay: `Day ${virtualDay}`,
        ignoreList: ignoreList || "None",
      };
    }));

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro" });

    const prompt = `
      Act as a Coding Mentor.
      User Context: ${JSON.stringify(roadmapContexts)}
      
      **CURRENT PERSPECTIVE:** "${currentPerspective}"

      INSTRUCTIONS:
      1. **Topic:** User is on "${roadmapContexts[0].currentTopic}" (Progress: ${roadmapContexts[0].virtualDay}).
      2. **Strict Anti-Repetition:** Do NOT generate tasks similar to: ${roadmapContexts[0].ignoreList}.
      3. **Actionable:** Tasks must be "Create...", "Write...", "Debug...".
      4. **Quantity:** Exactly 3 unique tasks.

      RETURN FORMAT:
      Return ONLY a raw JSON array.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const tasksArray = cleanAndParseJSON(text);
    res.json(tasksArray);

  } catch (error) {
    console.error("❌ AI TASK ERROR:", error.message);
    res.json([{
      roadmapId: req.body.roadmapIds[0],
      text: `Practical Exercise: Write code to implement the current concept from scratch.`
    }]); 
  }
});

module.exports = router;