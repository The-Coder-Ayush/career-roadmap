const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Return Token
    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ... existing imports and login route ...
const auth = require('../middleware/auth'); // Import middleware

// @route   GET /api/auth/user
// @desc    Get user data (Load User)
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    // Find user by ID (from token) but exclude password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/auth/delete
// @desc    Delete User and their Roadmaps
// @access  Private
router.delete('/delete', auth, async (req, res) => {
  try {
    // 1. Delete all roadmaps belonging to this user
    // Note: You need to require Roadmap model at the top if not there
    // const Roadmap = require('../models/Roadmap'); 
    
    // 2. Delete the user
    await User.findByIdAndDelete(req.user.id);
    
    res.json({ msg: 'Account Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;