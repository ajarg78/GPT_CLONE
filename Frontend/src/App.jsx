import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './Components/Layout';
import ChatSession from './components/ChatSession';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/chat/:sessionId" element={<ChatSession />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;