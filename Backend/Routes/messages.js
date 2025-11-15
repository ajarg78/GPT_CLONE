import express from "express";
import { chatHistory } from "./sessions.js";

const router = express.Router();

// Submit feedback for a message
router.post('/:messageId/feedback', (req, res) => {
  const { messageId } = req.params;
  const { feedback, sessionId } = req.body;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }
  
  if (chatHistory[sessionId]) {
    const message = chatHistory[sessionId].find(msg => msg.id === messageId);
    if (message) {
      message.feedback = feedback;
      return res.json({ success: true, message: 'Feedback submitted successfully' });
    }
  }
  
  res.status(404).json({ error: 'Message not found' });
});

// Get message by ID (optional - for future use)
router.get('/:messageId', (req, res) => {
  const { messageId } = req.params;
  const { sessionId } = req.query;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }
  
  if (chatHistory[sessionId]) {
    const message = chatHistory[sessionId].find(msg => msg.id === messageId);
    if (message) {
      return res.json(message);
    }
  }
  
  res.status(404).json({ error: 'Message not found' });
});

export default router;
