const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Discover potential matches
router.get('/discover', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const potentialMatches = await User.find({
      _id: { $ne: req.userId },
      gender: currentUser.interestedIn === 'both' ? { $in: ['male', 'female'] } : currentUser.interestedIn,
      age: {
        $gte: currentUser.preferences?.ageRange?.min || 18,
        $lte: currentUser.preferences?.ageRange?.max || 100,
      },
    }).limit(10);

    // Calculate compatibility for each match
    const { calculateCompatibility } = require('../config/personalityEngine');
    const matchesWithCompatibility = potentialMatches.map(user => {
      const compatibility = currentUser.personality && user.personality
        ? calculateCompatibility(currentUser.personality, user.personality)
        : 50;
      return { ...user.toObject(), compatibility };
    });

    res.json(matchesWithCompatibility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user matches
router.get('/matches', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('matches.userId');
    res.json(user.matches || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
