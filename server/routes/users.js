const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // <--- 1. ADD THIS IMPORT
const User = require('../models/User');
require('dotenv').config();

// @route   POST /api/users
// @desc    Register a user
router.post('/', async (req, res) => {
  // ... (Keep your existing Register logic here) ...
  // (I am hiding it to save space, but DO NOT DELETE your existing register code)
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get top 10 users
router.get('/leaderboard', async (req, res) => {
  // ... (Keep your existing Leaderboard logic here) ...
  try {
    const topUsers = await User.find().sort({ xp: -1 }).limit(10).select('name xp level date');
    res.json(topUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- 2. ADD THIS NEW ROUTE HERE ---
// @route   PUT /api/users/profile
// @desc    Update User Details (Name/Email)
router.put('/profile', auth, async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.user.id);
    
    if (name) user.name = name;
    // Note: We are allowing email updates without verification for simplicity
    if (email) user.email = email;

    await user.save();
    res.json(user); // Return updated user
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ... existing imports
// const Task = require('../models/Task');
// const Roadmap = require('../models/Roadmap');
// Make sure these are imported at the top!

// @route   PUT /api/users/password
// @desc    Change Password
router.put('/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    // 1. Get user with password (since we might have excluded it in query)
    const user = await User.findById(req.user.id);
    
    // 2. Check Current Password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect current password' });
    }

    // 3. Hash New Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    res.json({ msg: 'Password updated successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/users/account
// @desc    Delete User & All Data (Danger Zone)
router.delete('/account', auth, async (req, res) => {
  try {
    // 1. Delete Roadmaps
    const Roadmap = require('../models/Roadmap'); // Ensure imported
    await Roadmap.deleteMany({ user: req.user.id });

    // 2. Delete Tasks
    const Task = require('../models/Task'); // Ensure imported
    await Task.deleteMany({ user: req.user.id });

    // 3. Delete User
    await User.findByIdAndDelete(req.user.id);

    res.json({ msg: 'Account deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;