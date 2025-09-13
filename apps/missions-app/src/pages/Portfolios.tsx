import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Briefcase, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Search,
  Filter
} from 'lucide-react';
import { useAppStore, useWorkspaceStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import type { Portfolio, Project } from '@/types';

export function Portfolios() {
  const { openModal } = useAppStore();
  const { projects } = useWorkspaceStore();
  
  const [searchQuery, setSearchQuery] = useState('');

  // Generate mock portfolios for demonstration
  const mockPortfolios: Portfolio[] = [
    {
      id: 'portfolio-1',
      workspaceId: 'workspace-1',
      name: 'Product Development',
      description: 'All projects related to core product development and new features',
      color: '#3B82F6',
      ownerId: 'user-1',
      projectIds: ['project-1', 'project-2', 'project-3'],
      settings: {
        showProgress: true,
        showBudget: true,
        showTimeline: true,
        customMetrics: ['velocity', 'quality']
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-02-15')
    },
    {
      id: 'portfolio-2',
      workspaceId: 'workspace-1',
      name: 'Marketing Initiatives',
      description: 'Campaign management and brand development projects',
      color: '#10B981',
      ownerId: 'user-2',
      projectIds: ['project-4', 'project-5'],
      settings: {
        showProgress: true,
        showBudget: false,
        showTimeline: true,
        customMetrics: ['reach', 'engagement']
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-20')
    },
    {
      id: 'portfolio-3',
      workspaceId: 'workspace-1',
      name: 'Infrastructure & Security',
      description: 'Technical infrastructure and security enhancement projects',
      color: '#F59E0B',
      ownerId: 'user-3',
      projectIds: ['project-6'],
      settings: {
        showProgress: true,
        showBudget: true,
        showTimeline: false,
        customMetrics: ['uptime', 'security_score']
      },
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-18')
    }
  ];

  // Generate mock project data for portfolio metrics
  const mockProjects: Project[] = [
    {
      id: 'project-1',
      workspaceId: 'workspace-1',
      name: 'Mobile App Redesign',
      description: 'Complete redesign of mobile application',
      status: 'active',
      priority: 'high',
      startDate: new Date('2024-01-01'),
      dueDate: new Date('2024-04-30'),
      budget: 75000,
      progress: 65,
      ownerId: 'user-1',
      tags: ['mobile', 'design'],
      settings: {
        isPrivate: false,
        allowComments: true,
        autoArchive: false,
        customStatuses: [],
        defaultView: 'kanban'
      },
      portfolioId: 'portfolio-1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-02-15')
    },
    {
      id: 'project-2',
      workspaceId: 'workspace-1',
      name: 'Analytics Dashboard',
      description: 'Advanced analytics and reporting dashboard',
      status: 'active',
      priority: 'medium',
      startDate: new Date('2024-02-01'),
      dueDate: new Date('2024-05-31'),
      budget: 50000,
      progress: 40,
      ownerId: 'user-2',
      tags: ['analytics', 'dashboard'],
      settings: {
        isPrivate: false,
        allowComments: true,
        autoArchive: false,
        customStatuses: [],
        defaultView: 'table'
      },
      portfolioId: 'portfolio-1',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-20')
    }
  ];

  const getPortfolioMetrics = (portfolio: Portfolio) => {
    const portfolioProjects = mockProjects.filter(p => p.portfolioId === portfolio.id);
    
    const totalBudget = portfolioProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const avgProgress = portfolioProjects.length > 0 
      ? portfolioProjects.reduce((sum, p) => sum + p.progress, 0) / portfolioProjects.length 
      : 0;
    
    const activeProjects = portfolioProjects.filter(p => p.status === 'active').length;
    const completedProjects = portfolioProjects.filter(p => p.status === 'completed').length;
    const onTrackProjects = portfolioProjects.filter(p => p.progress >= 75).length;
    
    return {
      totalProjects: portfolioProjects.length,
      activeProjects,
      completedProjects,
      onTrackProjects,
      totalBudget,
      avgProgress: Math.round(avgProgress),
      healthScore: avgProgress >= 80 ? 'excellent' : avgProgress >= 60 ? 'good' : avgProgress >= 40 ? 'at-risk' : 'critical'
    };
  };

  const filteredPortfolios = useMemo(() => {
    return mockPortfolios.filter(portfolio =>
      !searchQuery || portfolio.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const portfolioActions = [
    { id: 'edit', label: 'Edit Portfolio', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Clock },
    { id: 'archive', label: 'Archive', icon: AlertCircle },
  ];

  const PortfolioCard = ({ portfolio }: { portfolio: Portfolio }) => {
    const metrics = getPortfolioMetrics(portfolio);
    
    const getHealthColor = (health: string) => {
      switch (health) {
        case 'excellent': return 'text-green-600 bg-green-50';
        case 'good': return 'text-blue-600 bg-blue-50';
        case 'at-risk': return 'text-yellow-600 bg-yellow-50';
        case 'critical': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

    const getHealthIcon = (health: string) => {
      switch (health) {
        case 'excellent': return CheckCircle;
        case 'good': return TrendingUp;
        case 'at-risk': return Clock;
        case 'critical': return AlertCircle;
        default: return Clock;
      }
    };

    const HealthIcon = getHealthIcon(metrics.healthScore);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${portfolio.color}20` }}
            >
              <Briefcase 
                className="h-6 w-6" 
                style={{ color: portfolio.color }}
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {portfolio.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {portfolio.description}
              </p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full capitalize ${getHealthColor(metrics.healthScore)}`}>
                  <HealthIcon className="h-3 w-3 inline mr-1" />
                  {metrics.healthScore.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
          
          <Dropdown
            trigger={
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
            items={portfolioActions}
            onItemClick={(action) => {
              if (action.id === 'edit') {
                openModal('edit-portfolio', { portfolio });
              }
            }}
            align="right"
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {metrics.totalProjects}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Total Projects
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {metrics.activeProjects}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Active
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {metrics.avgProgress}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Avg Progress
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              ${(metrics.totalBudget / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Total Budget
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Portfolio Progress
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {metrics.avgProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${metrics.avgProgress}%`,
                backgroundColor: portfolio.color
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Updated {new Date(portfolio.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>{metrics.onTrackProjects} on track</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openModal('portfolio-details', { portfolio })}
          >
            View Details
          </Button>
        </div>
      </motion.div>
    );
  };

  const totalStats = {
    portfolios: mockPortfolios.length,
    totalProjects: mockProjects.length,
    totalBudget: mockProjects.reduce((sum, p) => sum + (p.budget || 0), 0),
    avgHealth: Math.round(mockPortfolios.reduce((sum, p) => {
      const metrics = getPortfolioMetrics(p);
      return sum + metrics.avgProgress;
    }, 0) / mockPortfolios.length)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Portfolios
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track groups of related projects
          </p>
        </div>
        <Button variant="primary" onClick={() => openModal('create-portfolio')}>
          <Plus className="h-4 w-4 mr-2" />
          New Portfolio
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalStats.portfolios}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active Portfolios
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalStats.totalProjects}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Projects
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(totalStats.totalBudget / 1000).toFixed(0)}k
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Budget
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalStats.avgHealth}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Avg Health
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search portfolios..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </Button>
        </div>
      </div>

      {/* Portfolios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPortfolios.map((portfolio) => (
          <PortfolioCard key={portfolio.id} portfolio={portfolio} />
        ))}
      </div>

      {filteredPortfolios.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No portfolios found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery 
              ? 'Try adjusting your search criteria.'
              : 'Get started by creating your first portfolio to group related projects.'}
          </p>
          {!searchQuery && (
            <Button variant="primary" onClick={() => openModal('create-portfolio')}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Portfolio
            </Button>
          )}
        </div>
      )}
    </div>
  );
}