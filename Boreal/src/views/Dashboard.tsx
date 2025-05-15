import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  BarChart3,
  TrendingUp,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import StatCard from '../components/StatCard';
import ChannelDistributionChart from '../components/charts/ChannelDistributionChart';
import RecentActivityCard from '../components/RecentActivityCard';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
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

  const stats = [
    { 
      title: 'Total Messages', 
      value: '1,248', 
      change: '+12.5%', 
      icon: <MessageSquare size={20} className="text-indigo-600 dark:text-indigo-400" />,
      color: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
    { 
      title: 'Active Agents', 
      value: '12', 
      change: '+2', 
      icon: <Users size={20} className="text-teal-600 dark:text-teal-400" />,
      color: 'bg-teal-100 dark:bg-teal-900/30'
    },
    { 
      title: 'Response Rate', 
      value: '94%', 
      change: '+2.4%', 
      icon: <TrendingUp size={20} className="text-green-600 dark:text-green-400" />,
      color: 'bg-green-100 dark:bg-green-900/30'
    },
    { 
      title: 'Avg. Response Time', 
      value: '2m 14s', 
      change: '-18s', 
      icon: <BarChart3 size={20} className="text-purple-600 dark:text-purple-400" />,
      color: 'bg-purple-100 dark:bg-purple-900/30'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      channel: 'WhatsApp',
      icon: <MessageCircle className="text-green-500" size={16} />,
      message: 'New message from John Doe',
      time: '2 minutes ago',
      status: 'unread'
    },
    {
      id: 2,
      channel: 'Instagram',
      icon: <Instagram className="text-pink-500" size={16} />,
      message: 'Comment on your recent post',
      time: '15 minutes ago',
      status: 'read'
    },
    {
      id: 3,
      channel: 'Facebook',
      icon: <Facebook className="text-blue-500" size={16} />,
      message: 'New message in your page inbox',
      time: '1 hour ago',
      status: 'read'
    },
    {
      id: 4,
      channel: 'Twitter',
      icon: <Twitter className="text-sky-500" size={16} />,
      message: 'You were mentioned in a tweet',
      time: '3 hours ago',
      status: 'read'
    },
    {
      id: 5,
      channel: 'WhatsApp',
      icon: <MessageCircle className="text-green-500" size={16} />,
      message: 'New group message from Marketing Team',
      time: '5 hours ago',
      status: 'unread'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-2"
        >
          <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow p-5`}>
            <h2 className="text-lg font-semibold mb-4">Channel Distribution</h2>
            <div className="h-80">
              <ChannelDistributionChart />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className=""
        >
          <RecentActivityCard activities={recentActivity} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;