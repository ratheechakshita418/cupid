const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { verifyToken } = require('../middleware/auth');

// Send a message
router.post('/send', verifyToken, async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const message = new Message({
      senderId: req.userId,
      recipientId,
      content,
      conversationId: `${req.userId}-${recipientId}`,
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get conversation
router.get('/:recipientId', verifyToken, async (req, res) => {
  try {
    const conversationId = [req.userId, req.params.recipientId].sort().join('-');
    const messages = await Message.find({ conversationId }).sort('createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark messages as read
router.put('/read/:recipientId', verifyToken, async (req, res) => {
  try {
    const conversationId = [req.userId, req.params.recipientId].sort().join('-');
    await Message.updateMany(
      { conversationId, recipientId: req.userId, read: false },
      { read: true }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
