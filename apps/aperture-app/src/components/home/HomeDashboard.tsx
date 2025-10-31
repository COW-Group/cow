import React, { useState, useEffect } from 'react';
import { Greeting } from './Greeting';
import { StatsRow } from './StatsRow';
import { QuickActionsCard } from './QuickActionsCard';
import { RecentActivityList } from './RecentActivityList';
import { RecentBoardsGrid } from './RecentBoardsGrid';
import { UpdateFeed } from './UpdateFeed';
import { TemplatesPromo } from './TemplatesPromo';
import { LearnSection } from './LearnSection';
import { 
  HomeDashboardData,
  QuickAction,
  RecentActivity,
  UpdateFeed as UpdateFeedType,
  BoardPreview,
  DashboardStats 
} from '../../types/home.types';

// Mock data - in a real app this would come from API
const mockData: HomeDashboardData = {
  user: {
    id: '1',
    name: 'Likhitha',
    email: 'likhitha@cow.com',
    recentBoards: []
  },
  stats: {
    leads: 12,
    deals: 8,
    accounts: 24,
    activities: 7
  },
  recentActivity: [
    {
      id: '1',
      description: 'New lead added to CRM',
      iconType: 'lead',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: '2', 
      description: 'Deal moved to Negotiation',
      iconType: 'deal',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
    },
    {
      id: '3',
      description: 'Meeting scheduled for tomorrow',
      iconType: 'meeting', 
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    }
  ],
  updateFeed: [], // Empty initially as specified
  quickActions: [
    {
      id: '1',
      label: 'Manage Leads',
      icon: 'User',
      route: '/boards/leads-crm',
      iconColor: 'text-teal-500',
      count: 12
    },
    {
      id: '2',
      label: 'View Deals', 
      icon: 'DollarSign',
      route: '/boards/deals',
      iconColor: 'text-yellow-500',
      count: 8
    },
    {
      id: '3',
      label: 'Manage Contacts',
      icon: 'User',
      route: '/boards/contacts', 
      iconColor: 'text-green-500'
    }
  ]
};

// Mock recent boards data
const mockRecentBoards: BoardPreview[] = [
  {
    id: '1',
    slug: 'leads-crm',
    name: 'Sales Dashboard',
    description: 'COW CRM',
    itemCount: 12,
    lastVisited: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isStarred: true,
    color: 'bg-teal-500'
  },
  {
    id: '2',
    slug: 'deals',
    name: 'Deal Pipeline',
    description: 'COW CRM',
    itemCount: 8,
    lastVisited: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    isStarred: false,
    color: 'bg-yellow-500'
  },
  {
    id: '3',
    slug: 'accounts',
    name: 'Account Management', 
    description: 'COW CRM',
    itemCount: 24,
    lastVisited: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isStarred: false,
    color: 'bg-pink-500'
  }
];

export function HomeDashboard() {
  const [data, setData] = useState<HomeDashboardData>(mockData);
  const [recentBoards, setRecentBoards] = useState<BoardPreview[]>(mockRecentBoards);

  // In a real app, this would fetch data from API
  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      // await fetch('/api/home')
      // setData(response)
    };

    fetchDashboardData();
  }, []);

  const unreadUpdatesCount = data.updateFeed.filter(update => !update.read).length;

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 min-h-screen" 
         style={{ marginLeft: '250px', paddingTop: '80px' }}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Personalized Greeting */}
        <Greeting userName={data.user.name} />

        {/* Stats Row */}
        <StatsRow stats={data.stats} />

        {/* Quick Actions and Recent Activity - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <QuickActionsCard actions={data.quickActions} />
          <RecentActivityList activities={data.recentActivity} />
        </div>

        {/* Recent Boards Grid */}
        <RecentBoardsGrid boards={recentBoards} />

        {/* Update Feed - Full Width */}
        <UpdateFeed 
          updates={data.updateFeed} 
          unreadCount={unreadUpdatesCount} 
        />

        {/* Templates Promo and Learn Section - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TemplatesPromo />
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <LearnSection />
          </div>
        </div>
      </div>
    </div>
  );
}