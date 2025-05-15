import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video,
  Smile,
  MessageCircle, 
  Instagram, 
  Facebook, 
  Twitter
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MessageDetailProps {
  messageId: number;
}

interface MessageType {
  id: number;
  sender: 'user' | 'customer';
  text: string;
  time: string;
}

const MessageDetail: React.FC<MessageDetailProps> = ({ messageId }) => {
  const { theme } = useTheme();
  const [newMessage, setNewMessage] = useState('');
  
  // Mock customer data based on messageId
  const getCustomerData = () => {
    const customers = [
      {
        id: 1,
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        channel: 'whatsapp',
        icon: <MessageCircle size={16} className="text-green-500" />,
        status: 'online'
      },
      {
        id: 2,
        name: 'Sarah Smith',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        channel: 'instagram',
        icon: <Instagram size={16} className="text-pink-500" />,
        status: 'offline'
      },
      {
        id: 3,
        name: 'Michael Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        channel: 'facebook',
        icon: <Facebook size={16} className="text-blue-500" />,
        status: 'offline'
      },
      {
        id: 4,
        name: 'Emily Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
        channel: 'twitter',
        icon: <Twitter size={16} className="text-sky-500" />,
        status: 'offline'
      },
      {
        id: 5,
        name: 'Marketing Team',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        channel: 'whatsapp',
        icon: <MessageCircle size={16} className="text-green-500" />,
        status: 'offline'
      }
    ];
    
    return customers.find(c => c.id === messageId) || customers[0];
  };
  
  const customer = getCustomerData();
  
  // Mock conversation
  const messages: MessageType[] = [
    {
      id: 1,
      sender: 'customer',
      text: 'Hi, I\'m interested in your services. Can you tell me more?',
      time: '10:32 AM'
    },
    {
      id: 2,
      sender: 'user',
      text: 'Hello! Thanks for reaching out. I\'d be happy to tell you more about our services. What specific aspects are you interested in?',
      time: '10:35 AM'
    },
    {
      id: 3,
      sender: 'customer',
      text: 'I\'m looking for social media management and content creation. What are your rates?',
      time: '10:37 AM'
    },
    {
      id: 4,
      sender: 'user',
      text: 'We offer comprehensive social media management packages starting at $500/month, which includes strategy, content creation, and analytics. Would you like me to send you our detailed pricing brochure?',
      time: '10:40 AM'
    },
    {
      id: 5,
      sender: 'customer',
      text: 'Yes, that would be great. Also, do you have any case studies of similar businesses you\'ve worked with?',
      time: '10:42 AM'
    }
  ];
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    // In a real app, you would send this message to your backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
        <div className="flex items-center">
          <div className="relative">
            <img 
              src={customer.avatar} 
              alt={customer.name} 
              className="w-10 h-10 rounded-full"
            />
            <div className="absolute -right-1 -bottom-1 p-1 rounded-full bg-white dark:bg-gray-800">
              {customer.icon}
            </div>
            {customer.status === 'online' && (
              <span className="absolute top-0 right-0 block w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">{customer.name}</h3>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {customer.status === 'online' ? 'Online' : 'Last seen recently'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <Phone size={20} />
          </button>
          <button className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <Video size={20} />
          </button>
          <button className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 ${theme === 'dark' ? 'bg-gray-850' : 'bg-gray-50'}`}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[75%] mb-4 ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
          >
            <div className={`p-3 rounded-lg ${
              message.sender === 'user'
                ? 'bg-indigo-600 text-white'
                : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
            }`}>
              <p className="text-sm">{message.text}</p>
            </div>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}>
              {message.time}
            </p>
          </motion.div>
        ))}
      </div>
      
      {/* Input */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <form onSubmit={handleSendMessage} className="flex items-center">
          <button 
            type="button"
            className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <Paperclip size={20} className="text-gray-500" />
          </button>
          <div className="flex-1 mx-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className={`w-full px-4 py-2 rounded-full ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-500 focus:border-indigo-500'
                  : 'bg-gray-100 border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
          </div>
          <button
            type="button"
            className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <Smile size={20} className="text-gray-500" />
          </button>
          <button
            type="submit"
            className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 ml-2"
          >
            <Send size={20} className="text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageDetail;