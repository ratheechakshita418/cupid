const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Like a user
router.post('/:userId/like', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    currentUser.matches.push({
      userId: req.params.userId,
      status: 'like',
    });
    await currentUser.save();

    // Check for mutual like (match)
    const likedUser = await User.findById(req.params.userId);
    const hasLikedBack = likedUser.matches.some(
      (m) => m.userId.toString() === req.userId && m.status === 'like'
    );

    if (hasLikedBack) {
      currentUser.matches[currentUser.matches.length - 1].status = 'match';
      likedUser.matches.find((m) => m.userId.toString() === req.userId).status = 'match';
      await currentUser.save();
      await likedUser.save();
    }

    res.json({ message: 'Like recorded', match: hasLikedBack });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dislike a user
router.post('/:userId/dislike', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    currentUser.matches.push({
      userId: req.params.userId,
      status: 'dislike',
    });
    await currentUser.save();
    res.json({ message: 'User disliked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Report a user
router.post('/:userId/report', verifyToken, async (req, res) => {
  try {
    // Implement reporting logic (e.g., flag user, notify admins)
    res.json({ message: 'User reported' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
