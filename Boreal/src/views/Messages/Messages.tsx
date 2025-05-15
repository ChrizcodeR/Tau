import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Filter, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Twitter,
  Search,
  MoreHorizontal 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import MessageList from './MessageList';
import MessageDetail from './MessageDetail';

const Messages: React.FC = () => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  
  const filters = [
    { id: 'all', label: 'All Messages' },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={16} className="text-green-500" /> },
    { id: 'instagram', label: 'Instagram', icon: <Instagram size={16} className="text-pink-500" /> },
    { id: 'facebook', label: 'Facebook', icon: <Facebook size={16} className="text-blue-500" /> },
    { id: 'twitter', label: 'Twitter', icon: <Twitter size={16} className="text-sky-500" /> }
  ];
  
  // Mock messages data
  const messages = [
    {
      id: 1,
      channel: 'whatsapp',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      preview: 'Hi, I\'m interested in your services. Can you tell me more?',
      time: '2m ago',
      unread: true,
      icon: <MessageCircle size={16} className="text-green-500" />
    },
    {
      id: 2,
      channel: 'instagram',
      name: 'Sarah Smith',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      preview: 'Thanks for responding to my DM! I\'d like to discuss...',
      time: '15m ago',
      unread: true,
      icon: <Instagram size={16} className="text-pink-500" />
    },
    {
      id: 3,
      channel: 'facebook',
      name: 'Michael Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      preview: 'Do you have availability next week for a meeting?',
      time: '1h ago',
      unread: false,
      icon: <Facebook size={16} className="text-blue-500" />
    },
    {
      id: 4,
      channel: 'twitter',
      name: 'Emily Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      preview: 'I saw your tweet about the new product launch. Very interested!',
      time: '3h ago',
      unread: false,
      icon: <Twitter size={16} className="text-sky-500" />
    },
    {
      id: 5,
      channel: 'whatsapp',
      name: 'Marketing Team',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      preview: 'Weekly update: We need to discuss the campaign metrics',
      time: '5h ago',
      unread: false,
      icon: <MessageCircle size={16} className="text-green-500" />
    }
  ];
  
  const filteredMessages = activeFilter === 'all'
    ? messages
    : messages.filter(msg => msg.channel === activeFilter);
  
  const handleSelectMessage = (id: number) => {
    setSelectedMessage(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <div className="flex items-center space-x-2">
          <button 
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <Filter size={20} />
          </button>
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search messages..."
              className={`pl-10 pr-4 py-2 rounded-lg text-sm ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-500 focus:border-indigo-500' 
                  : 'bg-gray-50 border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="mb-6 flex overflow-x-auto space-x-2 pb-2">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
              activeFilter === filter.id
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.icon && <span className="mr-2">{filter.icon}</span>}
            {filter.label}
          </button>
        ))}
      </div>

      <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden h-[calc(100vh-220px)]`}>
        <div className="flex h-full">
          <div className={`w-1/3 border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} overflow-y-auto`}>
            <MessageList 
              messages={filteredMessages} 
              onSelectMessage={handleSelectMessage} 
              selectedMessage={selectedMessage}
            />
          </div>
          <div className="w-2/3">
            {selectedMessage ? (
              <MessageDetail messageId={selectedMessage} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="flex justify-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <MessageCircle size={32} className="text-gray-400" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No message selected</h3>
                  <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Select a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Messages;