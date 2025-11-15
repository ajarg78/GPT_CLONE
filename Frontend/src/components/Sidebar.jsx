import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { 
  X, 
  MessageSquare, 
  User,
  Clock,
  Plus,
  Trash2
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { sessions, loading, error, createSession } = useSessions();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNewChat = async () => {
    try {
      const data = await createSession();
      navigate(`/chat/${data.sessionId}`);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const clearAllSessions = () => {
    // This would typically call an API endpoint to clear sessions
    // For now, we'll just reload the page which will reset to initial state
    window.location.reload();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-3 p-3 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors group"
          >
            <Plus size={20} />
            <span className="font-medium">New chat</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg lg:hidden"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 text-sm">
              Failed to load sessions
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              No recent chats
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 mb-3">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Recent chats
                </h3>
                {sessions.length > 0 && (
                  <button
                    onClick={clearAllSessions}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
                    title="Clear all chats"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  to={`/chat/${session.id}`}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors group ${
                    location.pathname === `/chat/${session.id}`
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <MessageSquare size={18} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {session.title}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Clock size={12} />
                      {formatDate(session.lastActivity)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="w-8 h-8  from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                User Account
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Free Plan
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
