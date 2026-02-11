const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Roadmap = require('../models/Roadmap');
const User = require('../models/User'); // <--- Import User
const { checkBadges } = require('../utils/gamification'); // <--- Import Game Engine
const Groq = require("groq-sdk");
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// @route   GET /api/roadmaps
// @desc    Get all roadmaps for user
router.get('/', auth, async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user.id }).sort({ date: -1 });
    res.json(roadmaps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/roadmaps/:id
// @desc    Get specific roadmap
router.get('/:id', auth, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) return res.status(404).json({ msg: 'Roadmap not found' });
    if (roadmap.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    res.json(roadmap);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Roadmap not found' });
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/roadmaps
// @desc    Create a roadmap (Usually called by AI route, but here for manual)
router.post('/', auth, async (req, res) => {
  try {
    const { title, summary, steps, duration } = req.body;
    const newRoadmap = new Roadmap({
      title,
      summary,
      steps,
      duration,
      user: req.user.id
    });
    const roadmap = await newRoadmap.save();
    res.json(roadmap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/roadmaps/:id/step/:index
// @desc    Toggle Step & Award XP
router.put('/:id/step/:index', auth, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) return res.status(404).json({ msg: 'Roadmap not found' });
    if (roadmap.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    const index = parseInt(req.params.index);
    if (index < 0 || index >= roadmap.steps.length) return res.status(400).json({ msg: 'Invalid step index' });

    // Toggle Status
    const isNowComplete = !roadmap.steps[index].completed;
    roadmap.steps[index].completed = isNowComplete;
    await roadmap.save();

    // --- GAMIFICATION LOGIC ---
    const user = await User.findById(req.user.id);
    
    // Award 50 XP for a Roadmap Step (Big Achievement)
    if (isNowComplete) {
      user.xp += 50;
    } else {
      user.xp = Math.max(0, user.xp - 50); // Remove XP if unchecked
    }

    // Recalculate Level
    user.level = Math.floor(user.xp / 100) + 1;
    await user.save();

    // Check Badges (Pass '0' for totalTasks if you don't want to query tasks here, or query them)
    // For simplicity, we just check Level badges here
    const newBadge = await checkBadges(req.user.id, 0); 
    // Note: To check "Scholar" badge (Roadmap Completed), we would need more logic here.

    res.json({ roadmap, userXp: user.xp, userLevel: user.level, newBadge });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/roadmaps/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) return res.status(404).json({ msg: 'Roadmap not found' });
    if (roadmap.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Roadmap.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Roadmap removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;