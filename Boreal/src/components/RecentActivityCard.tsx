import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface Activity {
  id: number;
  channel: string;
  icon: React.ReactNode;
  message: string;
  time: string;
  status: 'read' | 'unread';
}

interface RecentActivityCardProps {
  activities: Activity[];
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-5 h-full`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div 
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 rounded-lg ${
              activity.status === 'unread' 
                ? theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-50' 
                : theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } ${
              activity.status === 'unread' 
                ? 'border-l-4 border-indigo-500' 
                : ''
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                {activity.icon}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{activity.message}</p>
                  {activity.status === 'unread' && (
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  )}
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.channel}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityCard;