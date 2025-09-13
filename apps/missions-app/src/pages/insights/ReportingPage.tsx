import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Eye, 
  Plus,
  Calendar,
  Filter,
  Download,
  Share,
  Settings,
  Zap
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

// Reporting Dashboard Component
function ReportingDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  
  const dashboards = [
    {
      id: 'team-performance',
      name: 'Team Performance',
      description: 'Track team productivity and task completion rates',
      lastUpdated: '2 hours ago',
      charts: 5,
      isShared: true
    },
    {
      id: 'project-overview',
      name: 'Project Overview',
      description: 'High-level view of all active projects',
      lastUpdated: '1 day ago',
      charts: 8,
      isShared: false
    },
    {
      id: 'goal-progress',
      name: 'Goal Progress',
      description: 'Track progress towards quarterly objectives',
      lastUpdated: '3 hours ago',
      charts: 3,
      isShared: true
    }
  ];

  const quickStats = [
    { label: 'Active Projects', value: '24', change: '+12%', trend: 'up' },
    { label: 'Completed Tasks', value: '1,247', change: '+8%', trend: 'up' },
    { label: 'Team Utilization', value: '87%', change: '-3%', trend: 'down' },
    { label: 'On-time Delivery', value: '94%', change: '+15%', trend: 'up' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reporting</h1>
          <p className="text-gray-600 dark:text-gray-400">Track progress and analyze performance across all projects</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Dashboard
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`flex items-center text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`h-4 w-4 mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Dashboards</h2>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard) => (
            <div key={dashboard.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{dashboard.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{dashboard.charts} charts</p>
                  </div>
                </div>
                {dashboard.isShared && (
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <Share className="h-3 w-3" />
                    Shared
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{dashboard.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Updated {dashboard.lastUpdated}</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Charts CTA */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Try Smart Charts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create on-demand reports by simply typing questions like "Show me team workload this week"
            </p>
          </div>
          <Button>
            Try Now
          </Button>
        </div>
      </div>
    </div>
  );
}

// Charts Page Component
function ChartsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Charts</h1>
      <p className="text-gray-600 dark:text-gray-400">Create and customize charts for your reports</p>
    </div>
  );
}

// Universal Reporting Component
function UniversalReporting() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Universal Reporting</h1>
      <p className="text-gray-600 dark:text-gray-400">Automatically updated reports across all teams and projects</p>
    </div>
  );
}

export function ReportingPage() {
  return (
    <div className="h-full">
      {/* Sub Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="px-6 py-3">
          <nav className="flex space-x-6">
            <NavLink 
              to="/insights/reporting"
              end
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              Dashboards
            </NavLink>
            <NavLink 
              to="/insights/reporting/charts"
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              Charts
            </NavLink>
            <NavLink 
              to="/insights/reporting/universal"
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              Universal Reporting
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Content */}
      <Routes>
        <Route path="/" element={<ReportingDashboard />} />
        <Route path="/dashboards" element={<ReportingDashboard />} />
        <Route path="/charts" element={<ChartsPage />} />
        <Route path="/universal" element={<UniversalReporting />} />
      </Routes>
    </div>
  );
}