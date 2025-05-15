import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  MessageSquare, 
  Users, 
  Sliders,
  Save,
  Globe,
  Mail,
  Smartphone
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Settings: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  
  // Tabs configuration
  const tabs = [
    { id: 'general', label: 'General', icon: <Sliders size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'channels', label: 'Channels', icon: <MessageSquare size={18} /> },
    { id: 'teams', label: 'Teams', icon: <Users size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> }
  ];
  
  // Mock settings for channels
  const channels = [
    { 
      id: 'whatsapp', 
      name: 'WhatsApp', 
      icon: <Smartphone size={20} className="text-green-500" />,
      enabled: true,
      description: 'Connect your WhatsApp Business account'
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: <Globe size={20} className="text-pink-500" />,
      enabled: true,
      description: 'Connect your Instagram business profile'
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: <Globe size={20} className="text-blue-500" />,
      enabled: true,
      description: 'Connect your Facebook business page'
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: <Globe size={20} className="text-sky-500" />,
      enabled: false,
      description: 'Connect your Twitter account'
    },
    { 
      id: 'email', 
      name: 'Email', 
      icon: <Mail size={20} className="text-gray-500" />,
      enabled: false,
      description: 'Manage email integration'
    }
  ];
  
  // Mock settings for notifications
  const notificationSettings = [
    {
      id: 'new-message',
      label: 'New Message Notifications',
      description: 'Get notified when a new message arrives',
      email: true,
      desktop: true,
      mobile: true
    },
    {
      id: 'mentions',
      label: 'Mentions',
      description: 'Get notified when you are mentioned in a conversation',
      email: true,
      desktop: true,
      mobile: true
    },
    {
      id: 'assignments',
      label: 'Assignments',
      description: 'Get notified when a conversation is assigned to you',
      email: true,
      desktop: true,
      mobile: true
    },
    {
      id: 'reports',
      label: 'Reports',
      description: 'Get weekly performance reports',
      email: true,
      desktop: false,
      mobile: false
    }
  ];
  
  // Mock user profile
  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    timezone: 'UTC-5 (Eastern Time)',
    language: 'English',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  };
  
  // Animation variants
  const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`w-full lg:w-64 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4`}>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className={`flex-1 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
          {activeTab === 'general' && (
            <motion.div
              key="general"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-xl font-semibold mb-6">General Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    defaultValue="Acme Inc."
                    className={`w-full px-3 py-2 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Website URL</label>
                  <input
                    type="url"
                    defaultValue="https://acmeinc.com"
                    className={`w-full px-3 py-2 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <select
                    defaultValue="UTC-5"
                    className={`w-full px-3 py-2 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="UTC-8">UTC-8 (Pacific Time)</option>
                    <option value="UTC-7">UTC-7 (Mountain Time)</option>
                    <option value="UTC-6">UTC-6 (Central Time)</option>
                    <option value="UTC-5">UTC-5 (Eastern Time)</option>
                    <option value="UTC+0">UTC+0 (GMT)</option>
                    <option value="UTC+1">UTC+1 (Central European Time)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    defaultValue="en"
                    className={`w-full px-3 py-2 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="pt">Portuguese</option>
                  </select>
                </div>
                
                <button className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
                  <Save size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'channels' && (
            <motion.div
              key="channels"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-xl font-semibold mb-6">Channel Integrations</h2>
              
              <div className="space-y-4">
                {channels.map((channel) => (
                  <div 
                    key={channel.id}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          {channel.icon}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium">{channel.name}</h3>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {channel.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            defaultChecked={channel.enabled}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                        {channel.enabled && (
                          <button className="ml-4 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                            Configure
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                {notificationSettings.map((setting) => (
                  <div 
                    key={setting.id}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">{setting.label}</h3>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {setting.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <input
                            id={`${setting.id}-email`}
                            type="checkbox"
                            defaultChecked={setting.email}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`${setting.id}-email`} className="ml-2 text-sm">
                            Email
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id={`${setting.id}-desktop`}
                            type="checkbox"
                            defaultChecked={setting.desktop}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`${setting.id}-desktop`} className="ml-2 text-sm">
                            Desktop
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id={`${setting.id}-mobile`}
                            type="checkbox"
                            defaultChecked={setting.mobile}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`${setting.id}-mobile`} className="ml-2 text-sm">
                            Mobile
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
                  <Save size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-xl font-semibold mb-6">Your Profile</h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="relative">
                    <img 
                      src={userProfile.avatar} 
                      alt={userProfile.name} 
                      className="w-32 h-32 rounded-full"
                    />
                    <button className={`absolute bottom-0 right-0 p-2 rounded-full ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                    } shadow border ${
                      theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                    }`}>
                      <User size={16} />
                    </button>
                  </div>
                  
                  <p className="mt-4 text-sm font-medium">{userProfile.name}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {userProfile.role}
                  </p>
                </div>
                
                <div className="md:w-2/3 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input
                        type="text"
                        defaultValue="John"
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input
                        type="text"
                        defaultValue="Doe"
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={userProfile.email}
                      className={`w-full px-3 py-2 rounded-md ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select
                      defaultValue={userProfile.role.toLowerCase()}
                      className={`w-full px-3 py-2 rounded-md ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="agent">Agent</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Language</label>
                      <select
                        defaultValue="english"
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Timezone</label>
                      <select
                        defaultValue="utc-5"
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="utc-8">UTC-8 (Pacific Time)</option>
                        <option value="utc-5">UTC-5 (Eastern Time)</option>
                        <option value="utc+0">UTC+0 (GMT)</option>
                        <option value="utc+1">UTC+1 (Central European Time)</option>
                      </select>
                    </div>
                  </div>
                  
                  <button className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
                    <Save size={18} className="mr-2" />
                    Update Profile
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Additional tabs would be added here with similar structure */}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;