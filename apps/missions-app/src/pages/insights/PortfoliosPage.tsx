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
import { useAppStore } from '../../store';

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
  const { openModal } = useAppStore();
  const [selectedTeam, setSelectedTeam] = useState('all');

  const teams = [
    {
      id: 'engineering',
      name: 'Engineering Team',
      members: 12,
      portfolios: 3,
      color: 'bg-blue-500'
    },
    {
      id: 'design',
      name: 'Design Team',
      members: 6,
      portfolios: 2,
      color: 'bg-purple-500'
    },
    {
      id: 'marketing',
      name: 'Marketing Team',
      members: 8,
      portfolios: 4,
      color: 'bg-green-500'
    }
  ];

  const teamPortfolios = [
    {
      id: 'eng-mobile',
      name: 'Mobile Development',
      team: 'Engineering Team',
      teamColor: 'bg-blue-500',
      description: 'iOS and Android app development initiatives',
      projectCount: 6,
      completion: 68,
      status: 'on_track',
      members: ['Alice', 'Bob', 'Charlie', 'Diana'],
      lastUpdated: '3 hours ago',
      timeline: { start: '2024-01-01', end: '2024-08-31' }
    },
    {
      id: 'design-system',
      name: 'Design System 2.0',
      team: 'Design Team',
      teamColor: 'bg-purple-500',
      description: 'Comprehensive design system overhaul',
      projectCount: 4,
      completion: 45,
      status: 'at_risk',
      members: ['Eva', 'Frank', 'Grace'],
      lastUpdated: '1 day ago',
      timeline: { start: '2024-02-15', end: '2024-07-15' }
    },
    {
      id: 'growth-campaigns',
      name: 'Growth Campaigns',
      team: 'Marketing Team',
      teamColor: 'bg-green-500',
      description: 'User acquisition and retention campaigns',
      projectCount: 8,
      completion: 72,
      status: 'on_track',
      members: ['Henry', 'Iris', 'Jack', 'Kate', 'Liam'],
      lastUpdated: '2 hours ago',
      timeline: { start: '2024-01-15', end: '2024-12-31' }
    }
  ];

  const filteredPortfolios = selectedTeam === 'all'
    ? teamPortfolios
    : teamPortfolios.filter(p => p.team.toLowerCase().includes(selectedTeam));

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Portfolios</h1>
          <p className="text-gray-600 dark:text-gray-400">View and collaborate on team portfolios</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openModal('create-team', { title: 'Create New Team' })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Portfolio
          </Button>
        </div>
      </div>

      {/* Team Filter */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by team:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTeam('all')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              selectedTeam === 'all'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All Teams
          </button>
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                selectedTeam === team.id
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`w-2 h-2 ${team.color} rounded-full`} />
              {team.name}
            </button>
          ))}
        </div>
      </div>

      {/* Teams Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {teams.map((team) => (
          <div key={team.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${team.color} rounded-lg flex items-center justify-center`}>
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{team.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {team.members} members • {team.portfolios} portfolios
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Portfolios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPortfolios.map((portfolio) => (
          <div key={portfolio.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            {/* Portfolio Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${portfolio.teamColor} rounded-lg flex items-center justify-center`}>
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{portfolio.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{portfolio.team}</p>
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

              {/* Status & Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(portfolio.status)}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {portfolio.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{portfolio.projectCount} projects</span>
              </div>

              {/* Team Members */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Team Members
                </h4>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {portfolio.members.slice(0, 4).map((member, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300"
                      >
                        {member.charAt(0)}
                      </div>
                    ))}
                    {portfolio.members.length > 4 && (
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-500">
                        +{portfolio.members.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {portfolio.members.length} members
                  </span>
                </div>
              </div>
            </div>

            {/* Portfolio Footer */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Updated {portfolio.lastUpdated}
                </span>
                <Button variant="ghost" size="sm">
                  View Portfolio
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPortfolios.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No team portfolios found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {selectedTeam === 'all'
              ? 'Create your first team portfolio to get started'
              : `No portfolios found for ${teams.find(t => t.id === selectedTeam)?.name}`
            }
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Team Portfolio
          </Button>
        </div>
      )}
    </div>
  );
}

// Portfolio Templates Component
function PortfolioTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Templates', count: 12 },
    { id: 'marketing', name: 'Marketing', count: 4 },
    { id: 'product', name: 'Product Development', count: 3 },
    { id: 'operations', name: 'Operations', count: 3 },
    { id: 'custom', name: 'Custom', count: 2 }
  ];

  const templates = [
    {
      id: 'marketing-campaign',
      name: 'Marketing Campaign Portfolio',
      description: 'Track multiple marketing campaigns with shared goals and metrics',
      category: 'marketing',
      projects: ['Brand Campaign', 'Digital Marketing', 'Events & PR'],
      timeline: '3-6 months',
      complexity: 'Medium',
      usageCount: 45,
      rating: 4.8,
      preview: 'https://example.com/preview1',
      features: ['Campaign tracking', 'ROI metrics', 'Multi-channel view', 'Performance dashboard']
    },
    {
      id: 'product-roadmap',
      name: 'Product Development Roadmap',
      description: 'Comprehensive product development tracking from ideation to launch',
      category: 'product',
      projects: ['Research & Discovery', 'Design Phase', 'Development', 'Testing & Launch'],
      timeline: '6-12 months',
      complexity: 'High',
      usageCount: 38,
      rating: 4.9,
      preview: 'https://example.com/preview2',
      features: ['Feature tracking', 'Release planning', 'User feedback', 'Development metrics']
    },
    {
      id: 'startup-mvp',
      name: 'Startup MVP Portfolio',
      description: 'Perfect for startups building their first minimum viable product',
      category: 'product',
      projects: ['Market Research', 'MVP Design', 'Development', 'Beta Testing'],
      timeline: '2-4 months',
      complexity: 'Medium',
      usageCount: 72,
      rating: 4.7,
      preview: 'https://example.com/preview3',
      features: ['Lean methodology', 'User validation', 'Iterative development', 'Metrics tracking']
    },
    {
      id: 'operations-optimization',
      name: 'Operations Optimization',
      description: 'Streamline internal processes and operational efficiency',
      category: 'operations',
      projects: ['Process Audit', 'System Integration', 'Training', 'Implementation'],
      timeline: '4-8 months',
      complexity: 'High',
      usageCount: 29,
      rating: 4.6,
      preview: 'https://example.com/preview4',
      features: ['Process mapping', 'Efficiency metrics', 'Cost tracking', 'Team productivity']
    },
    {
      id: 'digital-transformation',
      name: 'Digital Transformation',
      description: 'Modernize your organization with digital tools and processes',
      category: 'operations',
      projects: ['Assessment', 'Strategy', 'Implementation', 'Change Management'],
      timeline: '6-18 months',
      complexity: 'High',
      usageCount: 31,
      rating: 4.5,
      preview: 'https://example.com/preview5',
      features: ['Technology adoption', 'Change management', 'Training programs', 'ROI tracking']
    },
    {
      id: 'content-marketing',
      name: 'Content Marketing Hub',
      description: 'Organize and track all your content marketing initiatives',
      category: 'marketing',
      projects: ['Content Strategy', 'Production', 'Distribution', 'Performance Analysis'],
      timeline: '3-6 months',
      complexity: 'Medium',
      usageCount: 56,
      rating: 4.7,
      preview: 'https://example.com/preview6',
      features: ['Editorial calendar', 'Content pipeline', 'Performance metrics', 'SEO tracking']
    }
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Templates</h1>
          <p className="text-gray-600 dark:text-gray-400">Use pre-built templates to quickly create portfolios</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4 mr-2" />
            My Templates
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {category.name}
            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow overflow-hidden">
            {/* Template Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Template Metrics */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span>{template.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{template.usageCount} used</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{template.timeline}</span>
                </div>
              </div>

              {/* Complexity Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                  {template.complexity} Complexity
                </span>
              </div>

              {/* Sample Projects */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Included Projects
                </h4>
                <div className="space-y-1">
                  {template.projects.slice(0, 3).map((project, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 truncate">{project}</span>
                    </div>
                  ))}
                  {template.projects.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{template.projects.length - 3} more projects
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Key Features
                </h4>
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 2).map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                  {template.features.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 rounded">
                      +{template.features.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Template Footer */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button size="sm">
                  <BookTemplate className="h-3 w-3 mr-1" />
                  Use Template
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <BookTemplate className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No templates found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {selectedCategory === 'all'
              ? 'No templates available at the moment'
              : `No templates found in ${categories.find(c => c.id === selectedCategory)?.name} category`
            }
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Custom Template
          </Button>
        </div>
      )}
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