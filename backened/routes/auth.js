const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middleware/auth');

// Signup
router.post(
  '/signup',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('age').isInt(),
    body('gender').isIn(['male', 'female', 'other']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      user = new User(req.body);
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ token, user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Login
router.post(
  '/login',
  [body('email').isEmail(), body('password').exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(req.body.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Submit Questionnaire
router.post('/questionnaire', verifyToken, async (req, res) => {
  try {
    const { responses } = req.body;
    const { calculateMBTI, scoreBigFive } = require('../config/personalityEngine');

    const mbti = calculateMBTI(responses);
    const traits = scoreBigFive(responses);

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        questionnaireResponses: Object.entries(responses).map(([id, answer]) => ({ questionId: id, answer })),
        personality: { mbti, traits },
      },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
