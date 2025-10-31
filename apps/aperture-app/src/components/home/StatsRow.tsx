import React from 'react';
import { StatsCard } from './StatsCard';
import { DashboardStats } from '../../types/home.types';

interface StatsRowProps {
  stats: DashboardStats;
}

export function StatsRow({ stats }: StatsRowProps) {
  const statsConfig = [
    {
      label: 'Total Leads',
      value: stats.leads,
      icon: 'User' as const,
      iconColor: 'text-teal-500',
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
      route: '/boards/leads-crm'
    },
    {
      label: 'Active Deals', 
      value: stats.deals,
      icon: 'DollarSign' as const,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      route: '/boards/deals'
    },
    {
      label: 'Total Accounts',
      value: stats.accounts, 
      icon: 'Building' as const,
      iconColor: 'text-pink-500',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
      route: '/boards/accounts'
    },
    {
      label: 'Activities',
      value: stats.activities,
      icon: 'TrendingUp' as const,
      iconColor: 'text-blue-500', 
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      route: '/boards/activities'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsConfig.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}