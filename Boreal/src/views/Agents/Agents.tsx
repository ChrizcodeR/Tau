import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Agents: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Mock agents data
  const agents = [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      status: 'online',
      role: 'Senior Agent',
      activeChats: 5,
      responseRate: 98,
      averageResponseTime: '45s'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      status: 'online',
      role: 'Support Agent',
      activeChats: 3,
      responseRate: 95,
      averageResponseTime: '1m 20s'
    },
    {
      id: 3,
      name: 'David Kim',
      email: 'david.kim@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      status: 'away',
      role: 'Junior Agent',
      activeChats: 2,
      responseRate: 92,
      averageResponseTime: '1m 45s'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
      status: 'offline',
      role: 'Senior Agent',
      activeChats: 0,
      responseRate: 97,
      averageResponseTime: '52s'
    },
    {
      id: 5,
      name: 'James Chen',
      email: 'james.chen@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      status: 'online',
      role: 'Team Lead',
      activeChats: 2,
      responseRate: 99,
      averageResponseTime: '30s'
    }
  ];
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'online':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'away':
        return <Clock size={16} className="text-yellow-500" />;
      case 'offline':
        return <XCircle size={16} className="text-gray-400" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'offline':
        return 'Offline';
      default:
        return status;
    }
  };
  
  const filteredAgents = agents
    .filter(agent => 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(agent => statusFilter === 'all' || agent.status === statusFilter);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agent Management</h1>
        <button className={`flex items-center px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white`}>
          <UserPlus size={18} className="mr-2" />
          <span>Add Agent</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full rounded-lg text-sm ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-500 focus:border-indigo-500' 
                : 'bg-gray-50 border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`rounded-md py-2 px-3 text-sm ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500' 
                : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          >
            <option value="all">All</option>
            <option value="online">Online</option>
            <option value="away">Away</option>
            <option value="offline">Offline</option>
          </select>
          
          <button className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Agent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Active Chats
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Response Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Avg. Response Time
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700`}>
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full" 
                          src={agent.avatar} 
                          alt={agent.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{agent.name}</div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {agent.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(agent.status)}
                      <span className="ml-1.5 text-sm">{getStatusText(agent.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {agent.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {agent.activeChats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${agent.responseRate}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm">{agent.responseRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {agent.averageResponseTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAgents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm">
                    No agents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Agents;