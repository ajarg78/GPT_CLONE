import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar  from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Open sidebar"
                >
                  <Menu size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              )}
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                ChatGPT Clone
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <span className="text-yellow-500">☀️</span>
                ) : (
                  <span className="text-gray-600">🌙</span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;