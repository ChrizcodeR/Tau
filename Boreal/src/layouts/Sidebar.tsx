import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Instagram,
  MessageCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { theme } = useTheme();
  
  const sidebarVariants = {
    open: { width: '240px' },
    closed: { width: '64px' }
  };
  
  const links = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    { to: '/agents', icon: <Users size={20} />, label: 'Agents' },
    { to: '/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' }
  ];

  const activeClass = theme === 'dark' 
    ? 'bg-indigo-900 text-white' 
    : 'bg-indigo-100 text-indigo-800';
  
  const inactiveClass = theme === 'dark' 
    ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
    : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-800';

  return (
    <motion.aside
      className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-r border-gray-200 dark:border-gray-700 flex flex-col z-20`}
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30
      }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="text-indigo-600 dark:text-indigo-400" />
              <h1 className="ml-2 font-bold text-lg truncate">SocialDash</h1>
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={toggleSidebar} 
          className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      
      <nav className="flex-1 pt-4">
        <ul className="space-y-1 px-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-md transition-colors duration-150 ${isActive ? activeClass : inactiveClass}`
                }
              >
                {link.icon}
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      className="ml-3 truncate"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
        <div className={`flex items-center ${!isOpen && 'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
            <span className="text-xs font-medium">JD</span>
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="ml-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;