import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Sun, Moon, Search, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} border-b border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center md:hidden">
          <button
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="relative flex-1 max-w-md mx-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="search"
            className={`block w-full pl-10 pr-3 py-2 rounded-lg text-sm ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-500 focus:border-indigo-500' 
                : 'bg-gray-50 border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="Search..."
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-full relative hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleNotifications}
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>
            
            {showNotifications && (
              <motion.div 
                className={`absolute right-0 mt-2 w-80 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className={`px-4 py-3 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} border-b border-gray-200 dark:border-gray-700 cursor-pointer`}
                    >
                      <p className="text-sm font-medium">New message from client #{i}</p>
                      <p className="text-xs text-gray-500 mt-1">5 min ago</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 text-center border-t border-gray-200 dark:border-gray-700">
                  <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;