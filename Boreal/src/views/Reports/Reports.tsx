import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  LineChart, 
  Download, 
  Calendar,
  Filter
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../../components/StatCard';

const Reports: React.FC = () => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('week');
  
  // Mock stats data
  const stats = [
    { 
      title: 'Total Messages', 
      value: '12,548', 
      change: '+8.2%', 
      icon: <BarChart3 size={20} className="text-indigo-600 dark:text-indigo-400" />,
      color: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
    { 
      title: 'Average Response Time', 
      value: '1m 12s', 
      change: '-14s', 
      icon: <LineChart size={20} className="text-teal-600 dark:text-teal-400" />,
      color: 'bg-teal-100 dark:bg-teal-900/30'
    },
    { 
      title: 'Resolution Rate', 
      value: '92%', 
      change: '+3.5%', 
      icon: <BarChart3 size={20} className="text-green-600 dark:text-green-400" />,
      color: 'bg-green-100 dark:bg-green-900/30'
    },
    { 
      title: 'Customer Satisfaction', 
      value: '4.8/5', 
      change: '+0.2', 
      icon: <BarChart3 size={20} className="text-purple-600 dark:text-purple-400" />,
      color: 'bg-purple-100 dark:bg-purple-900/30'
    }
  ];
  
  // Mock performance data by channel
  const channelPerformance = [
    { 
      channel: 'WhatsApp', 
      messages: 5840,
      responseTime: '58s',
      satisfaction: 4.7
    },
    { 
      channel: 'Instagram', 
      messages: 3210,
      responseTime: '1m 24s',
      satisfaction: 4.5
    },
    { 
      channel: 'Facebook', 
      messages: 2450,
      responseTime: '1m 02s',
      satisfaction: 4.8
    },
    { 
      channel: 'Twitter', 
      messages: 1048,
      responseTime: '1m 35s',
      satisfaction: 4.2
    }
  ];
  
  // Mock top performing agents
  const topAgents = [
    {
      id: 1,
      name: 'James Chen',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      messages: 1245,
      responseTime: '32s',
      satisfaction: 4.9
    },
    {
      id: 2,
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      messages: 952,
      responseTime: '45s',
      satisfaction: 4.8
    },
    {
      id: 3,
      name: 'Maria Garcia',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      messages: 824,
      responseTime: '51s',
      satisfaction: 4.7
    }
  ];
  
  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Item animation
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold">Analytics & Reports</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Insights and performance metrics
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar size={18} />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`rounded-md py-2 px-3 text-sm ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          <button className={`p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
            <Download size={18} />
          </button>
        </motion.div>
      </div>
      
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-5`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Message Volume By Channel</h2>
          <button className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <Filter size={18} />
          </button>
        </div>
        
        <div className="h-64">
          {/* Placeholder for chart */}
          <div className="w-full h-full flex items-center justify-center">
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
              <BarChart3 size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-sm">Chart visualization would appear here</p>
              <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Showing data for {timeRange === 'week' ? 'this week' : timeRange}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          variants={itemVariants}
          className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-5`}
        >
          <h2 className="text-lg font-semibold mb-4">Channel Performance</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Messages
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Resp. Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Satisfaction
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {channelPerformance.map((channel, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      {channel.channel}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {channel.messages.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {channel.responseTime}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full" 
                            style={{ width: `${(channel.satisfaction / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{channel.satisfaction}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-5`}
        >
          <h2 className="text-lg font-semibold mb-4">Top Performing Agents</h2>
          
          <div className="space-y-4">
            {topAgents.map((agent) => (
              <div 
                key={agent.id} 
                className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <img 
                    src={agent.avatar} 
                    alt={agent.name} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium">{agent.name}</p>
                    <div className="flex mt-1 space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{agent.messages} msgs</span>
                      <span>{agent.responseTime} avg.</span>
                      <span>{agent.satisfaction}/5 rating</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                      <div 
                        className="bg-indigo-500 h-1.5 rounded-full" 
                        style={{ width: '85%' }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-right">Performance Score: 85%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
              View All Agents
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Reports;