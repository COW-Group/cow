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
  const [selectedChart, setSelectedChart] = useState('bar');

  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
    { id: 'line', name: 'Line Chart', icon: TrendingUp, description: 'Track trends over time' },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Show proportions of a whole' },
  ];

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Charts</h1>
        <p className="text-gray-600 dark:text-gray-400">Create and customize charts for your reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Chart Type Selector */}
        <div className="lg:col-span-1">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Chart Types</h3>
          <div className="space-y-2">
            {chartTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedChart(type.id)}
                  className={`w-full p-3 text-left rounded-lg border transition-colors ${
                    selectedChart === type.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {type.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {type.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Chart
            </Button>
          </div>
        </div>

        {/* Chart Preview Area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-96 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {chartTypes.find(t => t.id === selectedChart)?.name} Preview
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Select your data source to generate chart
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            </div>
          </div>

          {/* Chart Settings */}
          <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Chart Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Source
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                  <option>Select board...</option>
                  <option>Team Tasks</option>
                  <option>Project Progress</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  X-Axis
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                  <option>Select field...</option>
                  <option>Status</option>
                  <option>Assignee</option>
                  <option>Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Y-Axis
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                  <option>Count</option>
                  <option>Sum</option>
                  <option>Average</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Universal Reporting Component
function UniversalReporting() {
  const [selectedTemplate, setSelectedTemplate] = useState('weekly-overview');

  const reportTemplates = [
    {
      id: 'weekly-overview',
      name: 'Weekly Team Overview',
      description: 'Comprehensive weekly report across all teams',
      frequency: 'Weekly',
      lastGenerated: '2 days ago',
      recipients: ['team-leads', 'managers']
    },
    {
      id: 'project-status',
      name: 'Project Status Report',
      description: 'Status updates for all active projects',
      frequency: 'Daily',
      lastGenerated: '6 hours ago',
      recipients: ['stakeholders', 'project-managers']
    },
    {
      id: 'performance-metrics',
      name: 'Performance Metrics',
      description: 'KPI tracking across all workspaces',
      frequency: 'Monthly',
      lastGenerated: '1 week ago',
      recipients: ['executives', 'team-leads']
    }
  ];

  const universalData = {
    totalWorkspaces: 12,
    activeTasks: 247,
    completedThisWeek: 89,
    overdueTasks: 15,
    teamUtilization: 78
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Universal Reporting</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Automatically updated reports across all teams and projects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Templates */}
        <div className="lg:col-span-2">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Report Templates</h3>
          <div className="space-y-4">
            {reportTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Generated {template.lastGenerated}</span>
                      <span>•</span>
                      <span>{template.frequency}</span>
                      <span>•</span>
                      <span>{template.recipients.length} recipient groups</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Template
            </Button>
          </div>
        </div>

        {/* Universal Metrics */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Universal Metrics</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Workspaces</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {universalData.totalWorkspaces}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Tasks</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {universalData.activeTasks}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed This Week</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {universalData.completedThisWeek}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Overdue Tasks</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {universalData.overdueTasks}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Team Utilization</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {universalData.teamUtilization}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Generate Report Now
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Share className="h-4 w-4 mr-2" />
                Share Dashboard
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configure Automation
              </Button>
            </div>
          </div>

          {/* Schedule */}
          <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Next Scheduled Reports</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Weekly Overview - Tomorrow 9:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Project Status - Every day 6:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Performance Metrics - Next Monday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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