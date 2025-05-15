import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const ChannelDistributionChart: React.FC = () => {
  const { theme } = useTheme();
  
  // Placeholder for chart data
  const channels = [
    { name: 'WhatsApp', value: 45, color: '#25D366' },
    { name: 'Instagram', value: 25, color: '#E1306C' },
    { name: 'Facebook', value: 18, color: '#1877F2' },
    { name: 'Twitter', value: 12, color: '#1DA1F2' }
  ];
  
  const total = channels.reduce((acc, channel) => acc + channel.value, 0);
  
  // Calculate bar heights based on container height (300px)
  const maxHeight = 250;
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-end justify-around">
        {channels.map((channel, index) => {
          const height = (channel.value / 100) * maxHeight;
          
          return (
            <div key={index} className="flex flex-col items-center">
              <motion.div 
                className="rounded-t-lg w-16 md:w-20"
                style={{ 
                  backgroundColor: channel.color,
                  height: 0 
                }}
                animate={{ height }}
                transition={{ 
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: index * 0.1
                }}
              />
              <div className="mt-2 text-center">
                <p className="text-xs font-medium">{channel.name}</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {channel.value}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Total Messages</p>
            <p className="text-xl font-bold">1,248</p>
          </div>
          <div>
            <p className="text-sm font-medium">Active Channels</p>
            <p className="text-xl font-bold">4</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelDistributionChart;