import express from "express";
import cors from "cors";
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import { router as sessionsRouter } from "./Routes/sessions.js";
import messagesRouter from "./Routes/messages.js";

app.use('/api/sessions', sessionsRouter);
app.use('/api/messages', messagesRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ChatGPT Clone Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(` Backend server running on http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
});