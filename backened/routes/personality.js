const express = require('express');
const router = express.Router();
const questions = require('../config/questions');
const { verifyToken } = require('../middleware/auth');

// Get all personality questions
router.get('/', (req, res) => {
  res.json(questions);
});

// Get specific question
router.get('/:id', (req, res) => {
  const question = questions.find((q) => q.id === parseInt(req.params.id));
  if (!question) {
    return res.status(404).json({ message: 'Question not found' });
  }
  res.json(question);
});

module.exports = router;
