const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');
const { checkBadges } = require('../utils/gamification'); // Import Badge Engine

// @route   GET /api/tasks
// @desc    Get all tasks for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ date: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { text, roadmap } = req.body;
    
    const newTask = new Task({
      text,
      roadmap, // Optional: link to a specific roadmap
      user: req.user.id
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/tasks/:id
// @desc    Toggle Task Completion (Triggers XP, Streak, and Badges)
router.put('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    // Verify user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // 1. Toggle Task Status
    const isNowComplete = !task.isCompleted;
    task.isCompleted = isNowComplete;
    await task.save();

    // --- GAMIFICATION LOGIC ---
    const user = await User.findById(req.user.id);
    
    // 2. Handle XP
    if (isNowComplete) {
      user.xp += 10;
    } else {
      user.xp = Math.max(0, user.xp - 10); // Prevent negative XP
    }

    // 3. Handle Streak (Only if completing a task)
    if (isNowComplete) {
      const today = new Date();
      const lastDate = user.lastActiveDate ? new Date(user.lastActiveDate) : null;

      // Reset time to midnight for accurate day comparison
      today.setHours(0,0,0,0);
      if (lastDate) lastDate.setHours(0,0,0,0);

      if (!lastDate) {
        // First ever task
        user.streak = 1;
        user.lastActiveDate = new Date();
      } else if (today.getTime() === lastDate.getTime()) {
        // Already active today, do nothing to streak
      } else if (today.getTime() - lastDate.getTime() === 86400000) {
        // Last active was yesterday (86400000 ms = 24 hours), Increment!
        user.streak += 1;
        user.lastActiveDate = new Date();
      } else {
        // Missed a day (or more), Reset to 1
        user.streak = 1;
        user.lastActiveDate = new Date();
      }
    }

    // 4. Recalculate Level (e.g., Level 2 at 100 XP)
    user.level = Math.floor(user.xp / 100) + 1;
    
    // Save User Stats
    await user.save();

    // 5. Check for New Badges
    const totalTasks = await Task.countDocuments({ user: req.user.id, isCompleted: true });
    const newBadge = await checkBadges(req.user.id, totalTasks);

    // Return everything to frontend
    res.json({ 
      task, 
      userLevel: user.level, 
      userXp: user.xp, 
      streak: user.streak,
      newBadge // Will be null if no badge, or an object if unlocked
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    // Verify user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;