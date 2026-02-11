const express = require('express');
const router = express.Router();
const Groq = require("groq-sdk");
const auth = require('../middleware/auth');
const Roadmap = require('../models/Roadmap');
const Task = require('../models/Task'); 
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- 1. ROADMAP GENERATOR ---
router.post('/generate', auth, async (req, res) => {
  const { role, duration, hours } = req.body;
  
  try {
    const prompt = `
      Create a detailed learning roadmap for a "${role}".
      Duration: ${duration}. 
      Time Commitment: ${hours} hours/week.
      
      Return a JSON object with this structure:
      {
        "title": "${role} Roadmap",
        "summary": "Brief overview...",
        "salary_range": "$X - $Y",
        "growth_score": 9,
        "steps": [
          {
            "title": "Phase 1: ...",
            "description": "...",
            "duration": "...",
            "resources": ["Topic A", "Topic B"]
          }
        ]
      }
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const roadmapData = JSON.parse(completion.choices[0].message.content);
    res.json(roadmapData);

  } catch (error) {
    console.error("❌ GROQ ERROR:", error);
    res.status(500).json({ msg: "Failed to generate roadmap" });
  }
});

// --- 2. SMART DAILY TASK GENERATOR (STRICT PROGRESSION & NO REPEATS) ---
router.post('/suggest-tasks', auth, async (req, res) => {
  try {
    const { roadmapIds } = req.body;
    if (!roadmapIds || !Array.isArray(roadmapIds)) return res.status(400).json({ msg: "No roadmap selected." });

    // 1. Get Roadmaps
    const roadmaps = await Roadmap.find({ _id: { $in: roadmapIds }, user: req.user.id });
    if (roadmaps.length === 0) return res.status(404).json({ msg: "Roadmaps not found." });

    // 2. Get GLOBAL HISTORY (Completed + Active) to prevent ANY repetition
    const allUserTasks = await Task.find({ user: req.user.id }).select('text');
    const blockedTasks = allUserTasks.map(t => t.text.toLowerCase()); // Blocklist

    // 3. Build Strict Context based on CURRENT ROADMAP STEP
    const roadmapContexts = roadmaps.map((map) => {
      // Find the FIRST step that is NOT completed. This is the "Current Phase".
      const currentStep = map.steps.find(s => !s.completed);
      
      // If all steps are done, focus on "Advanced Mastery"
      const focusTopic = currentStep ? currentStep.title : "Advanced Mastery & Interview Prep";
      const focusDesc = currentStep ? currentStep.description : "You have finished the roadmap. Focus on building complex projects.";

      return {
        id: map._id.toString(),
        role: map.title,
        currentFocus: focusTopic, // <--- FORCE AI TO LOOK HERE
        description: focusDesc
      };
    });

    // 4. Strict Prompt
    const prompt = `
      Act as a strict Coding Bootcamp Instructor.
      I have selected ${roadmapContexts.length} learning paths.
      
      You must generate EXACTLY ONE unique daily task for **EACH** path.

      CONTEXT:
      ${JSON.stringify(roadmapContexts)}

      CRITICAL RULES:
      1. **Strict Progression:** Look at "currentFocus". 
         - If Focus is "CSS", generate a CSS task. DO NOT generate HTML (too easy) or React (too hard).
         - Stick exactly to the topic in "currentFocus".
      2. **Zero Duplicates:** - The user has already done these tasks: ${JSON.stringify(blockedTasks.slice(0, 50))}. 
         - DO NOT repeat anything similar.
      3. **Actionable:** Task must be specific code practice (e.g., "Build a Navbar using Flexbox").
      4. **One-to-One:** Return exactly one task per roadmapId provided.

      OUTPUT FORMAT (JSON Array): 
      [ 
        { "roadmapId": "...", "text": "..." }
      ]
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const rawContent = completion.choices[0].message.content;
    let tasksArray = [];

    // --- PARSING LOGIC ---
    try {
      const parsed = JSON.parse(rawContent);
      
      if (Array.isArray(parsed)) {
        tasksArray = parsed;
      } else if (parsed.tasks) {
        tasksArray = parsed.tasks;
      } else if (parsed.data) {
        tasksArray = parsed.data;
      } else if (parsed.roadmapId || parsed.text) {
        tasksArray = [parsed];
      } else {
        tasksArray = Object.values(parsed).find(v => Array.isArray(v)) || [];
      }
    } catch (e) {
      console.error("JSON Parse Error:", e);
    }

    // 5. SAFETY NET & FALLBACK
    const finalTasks = roadmapIds.map(selectedId => {
      // Find AI task
      let foundTask = tasksArray.find(t => t.roadmapId === selectedId);

      // Check if it exists OR if it is a duplicate (String similarity check)
      const isDuplicate = foundTask && blockedTasks.some(blocked => blocked.includes(foundTask.text.toLowerCase().substring(0, 15)));

      if (!foundTask || isDuplicate) {
        // FALLBACK: Generate a generic task based on the CURRENT STEP
        const map = roadmaps.find(r => r._id.toString() === selectedId);
        const currentStep = map.steps.find(s => !s.completed) || map.steps[map.steps.length - 1];
        
        foundTask = {
          roadmapId: selectedId,
          text: `Practice ${currentStep.title}: Create a small demo using these concepts.`
        };
      }
      
      return {
        roadmapId: selectedId,
        text: foundTask.text
      };
    });

    res.json(finalTasks);

  } catch (error) {
    console.error("❌ TASK ERROR:", error);
    // Generic Fallback
    const fallbackTasks = req.body.roadmapIds.map(id => ({
      roadmapId: id,
      text: "Review your current roadmap milestone."
    }));
    res.json(fallbackTasks);
  }
});

// --- 3. AI TASK TUTOR (GET HELP) ---
router.post('/help', auth, async (req, res) => {
  const { taskText, context } = req.body; 

  try {
    const prompt = `
      You are a Senior Coding Mentor. The student is stuck on this task:
      "${taskText}"
      
      Context: They are learning ${context || "Software Development"}.
      
      Provide a helpful, concise guide.
      1. Explain the "Why" briefly.
      2. Provide a code snippet or command if applicable.
      3. Give a "Pro Tip".
      
      Keep it under 200 words. Use Markdown formatting.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const advice = completion.choices[0].message.content;
    res.json({ advice });

  } catch (error) {
    console.error("❌ HELP ERROR:", error);
    res.status(500).json({ msg: "AI is currently offline." });
  }
});

module.exports = router;