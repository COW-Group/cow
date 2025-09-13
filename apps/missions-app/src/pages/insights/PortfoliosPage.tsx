import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { 
  Folder, 
  Briefcase, 
  Users, 
  BookTemplate,
  Plus,
  Calendar,
  Filter,
  MoreHorizontal,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

// My Portfolios Component
function MyPortfolios() {
  const [viewMode, setViewMode] = useState('grid');
  
  const portfolios = [
    {
      id: 'product-development',
      name: 'Product Development',
      description: 'All projects related to product development and launches',
      projectCount: 8,
      completion: 72,
      status: 'on_track',
      owner: 'You',
      lastUpdated: '2 hours ago',
      color: 'bg-blue-500',
      projects: ['Mobile App V2', 'API Redesign', 'User Dashboard'],
      timeline: { start: '2024-01-15', end: '2024-06-30' }
    },
    {
      id: 'marketing-campaigns',
      name: 'Marketing Campaigns',
      description: 'Quarterly marketing initiatives and brand campaigns',
      projectCount: 5,
      completion: 45,
      status: 'at_risk',
      owner: 'You',
      lastUpdated: '1 day ago',
      color: 'bg-green-500',
      projects: ['Q2 Launch Campaign', 'Brand Refresh', 'Content Strategy'],
      timeline: { start: '2024-02-01', end: '2024-05-31' }
    },
    {
      id: 'operations',
      name: 'Operations & Infrastructure',
      description: 'Internal tools and operational improvements',
      projectCount: 12,
      completion: 89,
      status: 'on_track',
      owner: 'You',
      lastUpdated: '5 hours ago',
      color: 'bg-purple-500',
      projects: ['Server Migration', 'Security Audit', 'Process Automation'],
      timeline: { start: '2024-01-01', end: '2024-12-31' }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'at_risk':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'behind':
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'On Track';
      case 'at_risk':
        return 'At Risk';
      case 'behind':
        return 'Behind';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Portfolios</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your project portfolios</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Portfolio
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Folder className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Portfolios</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{portfolios.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {portfolios.reduce((sum, p) => sum + p.projectCount, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Completion</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(portfolios.reduce((sum, p) => sum + p.completion, 0) / portfolios.length)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">On Track</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {portfolios.filter(p => p.status === 'on_track').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <div key={portfolio.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            {/* Portfolio Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${portfolio.color} rounded-lg flex items-center justify-center`}>
                    <Folder className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{portfolio.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{portfolio.projectCount} projects</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{portfolio.description}</p>
              
              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{portfolio.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${portfolio.completion}%` }}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(portfolio.status)}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getStatusLabel(portfolio.status)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">Updated {portfolio.lastUpdated}</span>
              </div>

              {/* Recent Projects */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Recent Projects
                </h4>
                <div className="space-y-1">
                  {portfolio.projects.slice(0, 3).map((project, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 truncate">{project}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio Footer */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {portfolio.timeline.start} - {portfolio.timeline.end}
                </span>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State for new users */}
      {portfolios.length === 0 && (
        <div className="text-center py-12">
          <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No portfolios yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first portfolio to group related projects and track progress
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Portfolio
          </Button>
        </div>
      )}
    </div>
  );
}

// Team Portfolios Component
function TeamPortfolios() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Team Portfolios</h1>
      <p className="text-gray-600 dark:text-gray-400">View and collaborate on team portfolios</p>
    </div>
  );
}

// Portfolio Templates Component
function PortfolioTemplates() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Portfolio Templates</h1>
      <p className="text-gray-600 dark:text-gray-400">Use pre-built templates to quickly create portfolios</p>
    </div>
  );
}

export function PortfoliosPage() {
  return (
    <div className="h-full">
      {/* Sub Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="px-6 py-3">
          <nav className="flex space-x-6">
            <NavLink 
              to="/insights/portfolios"
              end
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              My Portfolios
            </NavLink>
            <NavLink 
              to="/insights/portfolios/team"
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              Team Portfolios
            </NavLink>
            <NavLink 
              to="/insights/portfolios/templates"
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              Templates
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Content */}
      <Routes>
        <Route path="/" element={<MyPortfolios />} />
        <Route path="/my" element={<MyPortfolios />} />
        <Route path="/team" element={<TeamPortfolios />} />
        <Route path="/templates" element={<PortfolioTemplates />} />
      </Routes>
    </div>
  );
}