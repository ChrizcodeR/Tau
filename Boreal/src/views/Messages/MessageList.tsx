import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface Message {
  id: number;
  channel: string;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread: boolean;
  icon: React.ReactNode;
}

interface MessageListProps {
  messages: Message[];
  onSelectMessage: (id: number) => void;
  selectedMessage: number | null;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  onSelectMessage,
  selectedMessage
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {messages.length > 0 ? (
        messages.map((message) => (
          <motion.div
            key={message.id}
            whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)' }}
            className={`p-4 cursor-pointer ${
              selectedMessage === message.id
                ? theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-50'
                : ''
            }`}
            onClick={() => onSelectMessage(message.id)}
          >
            <div className="flex items-center">
              <div className="relative flex-shrink-0">
                <img 
                  src={message.avatar} 
                  alt={message.name} 
                  className="w-10 h-10 rounded-full"
                />
                <div className="absolute -right-1 -bottom-1 p-1 rounded-full bg-white dark:bg-gray-800">
                  {message.icon}
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className={`text-sm font-medium truncate ${message.unread ? 'font-semibold' : ''}`}>
                    {message.name}
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {message.time}
                  </p>
                </div>
                <p className={`text-sm truncate mt-1 ${
                  message.unread 
                    ? theme === 'dark' ? 'text-white' : 'text-gray-900 font-medium' 
                    : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {message.preview}
                </p>
              </div>
            </div>
            {message.unread && (
              <div className="flex justify-end mt-1">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              </div>
            )}
          </motion.div>
        ))
      ) : (
        <div className="p-4 text-center">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No messages found
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageList;