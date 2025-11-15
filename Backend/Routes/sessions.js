import express from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockSessions = JSON.parse(fs.readFileSync(path.join(__dirname, "../Data/mockSessions.json"), "utf8"));
const mockResponses = JSON.parse(fs.readFileSync(path.join(__dirname, "../Data/mockResponses.json"), "utf8"));

const router = express.Router();

// In-memory storage (replace with database in production)
let sessionStore = [...mockSessions.initialSessions];
let chatHistory = {};

// Initialize chat history for default sessions
mockSessions.initialSessions.forEach(session => {
  chatHistory[session.id] = [];
});

// Start new chat session
router.post('/', (req, res) => {
  const sessionId = uuidv4();
  const newSession = {
    id: sessionId,
    title: `Chat ${sessionStore.length + 1}`,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString()
  };

  sessionStore.unshift(newSession);
  chatHistory[sessionId] = [];

  res.json({ sessionId, session: newSession });
});

// Get all sessions
router.get('/', (req, res) => {
  // Sort sessions by last activity (most recent first)
  const sortedSessions = sessionStore.sort((a, b) =>
    new Date(b.lastActivity) - new Date(a.lastActivity)
  );
  res.json(sortedSessions);
});

// Get session history
router.get('/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const history = chatHistory[sessionId] || [];
  res.json(history);
});

// Ask question in session
router.post('/:sessionId/ask', (req, res) => {
  const { sessionId } = req.params;
  const { question } = req.body;
  
  if (!chatHistory[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  // Update session last activity and title if it's the first message
  const session = sessionStore.find(s => s.id === sessionId);
  if (session) {
    session.lastActivity = new Date().toISOString();
    
    // Generate title from first question if it's a new session
    if (chatHistory[sessionId].length === 0 && question) {
      session.title = question.length > 30 
        ? question.substring(0, 30) + '...' 
        : question;
    }
  }
  
  // Get random mock response
  const randomResponse = mockResponses.responses[
    Math.floor(Math.random() * mockResponses.responses.length)
  ];
  
  const chatMessage = {
    id: uuidv4(),
    question,
    answer: randomResponse.answer,
    timestamp: new Date().toISOString(),
    feedback: null
  };
  
  chatHistory[sessionId].push(chatMessage);
  
  res.json(chatMessage);
});

export { router, chatHistory };
