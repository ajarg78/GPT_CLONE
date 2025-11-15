import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { 
  MessageSquare, 
  Zap, 
  Shield, 
  Database,
  Lightbulb,
  Rocket
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { createSession } = useSessions();

  const startNewChat = async () => {
    try {
      const data = await createSession();
      navigate(`/chat/${data.sessionId}`);
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Responses",
      description: "Get instant AI-powered answers to your questions with real-time processing",
      color: "text-yellow-500"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Structured Data",
      description: "View answers in clean, organized tables with detailed insights and analysis",
      color: "text-blue-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Session Management",
      description: "Keep track of all your conversations with automatic session history",
      color: "text-green-500"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Smart Analysis",
      description: "Get intelligent insights and recommendations based on your data",
      color: "text-purple-500"
    }
  ];

  const exampleQuestions = [
    "Show me sales data for last quarter",
    "Analyze user engagement metrics",
    "Compare product performance",
    "Generate marketing campaign report"
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 overflow-y-auto">
      <div className="text-center max-w-4xl w-full">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20  from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Rocket className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            ChatGPT Clone
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience AI-powered conversations with structured data insights. 
            Ask anything and get intelligent responses with detailed analysis.
          </p>

          <button
            onClick={startNewChat}
            className=" from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
          >
            <MessageSquare size={24} />
            Start New Chat
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
            >
              <div className={`${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Example Questions */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Try asking me...
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  startNewChat();
                  // In a real app, you might pre-fill this question
                }}
                className="p-4 text-left bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
              >
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {question}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Built with React, Node.js, and TailwindCSS • Fully responsive design
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;