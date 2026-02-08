const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware to protect routes
const Roadmap = require('../models/Roadmap'); // Your Database Model

// @route   POST /api/roadmaps/save
// @desc    Save a generated roadmap
// @access  Private (Logged in users only)
router.post('/save', auth, async (req, res) => {
  try {
    // Debugging: See who is trying to save
    console.log("💾 Attempting to save for user:", req.user);

    // 1. Safety Check: Ensure user is logged in
    if (!req.user || (!req.user.id && !req.user._id)) {
      return res.status(401).json({ msg: "User not authenticated properly." });
    }

    // Handle different token structures (id vs _id)
    const userId = req.user.id || req.user._id;

    const { title, summary, salary_range, growth_score, steps } = req.body;

    const newRoadmap = new Roadmap({
      user: userId,
      title,
      summary,
      salary_range,
      growth_score,
      steps
    });

    const roadmap = await newRoadmap.save();
    console.log("✅ Roadmap Saved to DB!");
    res.json(roadmap);

  } catch (err) {
    console.error("❌ Database Save Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/roadmaps
// @desc    Get all roadmaps for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    // Find roadmaps belonging to this user and sort by newest first
    const roadmaps = await Roadmap.find({ user: userId }).sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/roadmaps/:id
// @desc    Get a single roadmap by ID (For the View Path page)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    // 1. Check if roadmap exists
    if (!roadmap) {
      return res.status(404).json({ msg: 'Roadmap not found' });
    }

    // 2. Check if the logged-in user owns this roadmap
    // (Prevents users from seeing other people's data)
    const userId = req.user.id || req.user._id;
    
    if (roadmap.user.toString() !== userId) {
      return res.status(401).json({ msg: 'Not authorized to view this roadmap' });
    }

    res.json(roadmap);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Roadmap not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/roadmaps/:id
// @desc    Delete a roadmap
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ msg: 'Roadmap not found' });
    }

    // Check user ownership
    const userId = req.user.id || req.user._id;
    
    if (roadmap.user.toString() !== userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await roadmap.deleteOne();
    res.json({ msg: 'Roadmap removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/roadmaps/:id/step/:stepIndex
// @desc    Toggle completion status of a specific step
router.put('/:id/step/:stepIndex', auth, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    // Security checks
    if (!roadmap) return res.status(404).json({ msg: 'Roadmap not found' });
    if (roadmap.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    // Toggle the specific step
    const index = parseInt(req.params.stepIndex);
    if (index >= 0 && index < roadmap.steps.length) {
      roadmap.steps[index].completed = !roadmap.steps[index].completed; // Flip true/false
      await roadmap.save();
      return res.json(roadmap);
    } else {
      return res.status(400).json({ msg: 'Invalid step index' });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;