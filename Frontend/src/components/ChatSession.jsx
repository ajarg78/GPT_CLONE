import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Send, Bot, User, Copy, Check } from 'lucide-react';

const ChatSession = () => {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  useEffect(() => {
    // Load session history
    const loadSessionHistory = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to load session history');
        }
        const history = await response.json();
        setMessages(history);
      } catch (error) {
        console.error('Error loading session history:', error);
      }
    };

    if (sessionId) {
      loadSessionHistory();
    }
  }, [sessionId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = input;
    setInput('');

    try {
      const response = await fetch(`/api/sessions/${sessionId}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const newMessage = await response.json();
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      const errorMessage = {
        id: Date.now().toString(),
        question: userMessage,
        answer: {
          description: "Sorry, I encountered an error while processing your request. Please try again."
        },
        timestamp: new Date().toISOString(),
        feedback: null,
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitFeedback = async (messageId, feedback) => {
    try {
      await fetch(`/api/messages/${messageId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback,
          sessionId
        }),
      });

      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, feedback } : msg
      ));
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const TableView = ({ table }) => (
    <div className="overflow-x-auto my-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <table className="min-w-full bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {table.headers.map((header, index) => (
              <th 
                key={index} 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {table.rows.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {row.map((cell, cellIndex) => (
                <td 
                  key={cellIndex} 
                  className="px-4 py-3 text-sm text-gray-900 dark:text-white"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <Bot size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
            <p>Ask a question to begin chatting with the AI assistant.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="space-y-6">
              {/* User Message */}
              <div className="flex gap-4 group">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-blue-500 text-white rounded-2xl rounded-tl-none px-4 py-3 inline-block">
                    {message.question}
                  </div>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex gap-4 group">
                <div className="w-8 h-8  from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className={`rounded-2xl rounded-tl-none px-4 py-3 ${
                    message.isError 
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {message.answer?.table && <TableView table={message.answer.table} />}
                    {message.answer?.description && (
                      <div className="text-gray-700 dark:text-gray-300">
                        {message.answer.description.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-2 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-1">
                        <button
                          onClick={() => submitFeedback(message.id, 'like')}
                          className={`p-2 rounded-lg transition-colors ${
                            message.feedback === 'like' 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                              : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}
                          title="Like this response"
                        >
                          <ThumbsUp size={16} />
                        </button>
                        <button
                          onClick={() => submitFeedback(message.id, 'dislike')}
                          className={`p-2 rounded-lg transition-colors ${
                            message.feedback === 'dislike' 
                              ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' 
                              : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}
                          title="Dislike this response"
                        >
                          <ThumbsDown size={16} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(
                          message.answer?.description || 
                          JSON.stringify(message.answer?.table, null, 2), 
                          message.id
                        )}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors ml-auto"
                        title="Copy response"
                      >
                        {copiedMessageId === message.id ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 from-purple-500 to-pink-500 rounded-full flex items-center justify-center ">
              <Bot size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 inline-block">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <form onSubmit={sendMessage} className="flex gap-4 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[60px] max-h-[200px]"
              disabled={isLoading}
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 "
          >
            <Send size={20} />
            Send
          </button>
        </form>
        
        {/* Helper Text */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          The AI assistant will respond with structured data and analysis based on your questions
        </div>
      </div>
    </div>
  );
};

export default ChatSession;