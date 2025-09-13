import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  RadialBarChart, RadialBar, Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Download,
  Filter,
  Users,
  Clock,
  CheckCircle,
  Target,
  Briefcase,
  Activity,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/Button';
// Native JavaScript date utilities
const formatDate = (date: Date, formatStr: string = 'MMM d') => {
  const options: Intl.DateTimeFormatOptions = formatStr === 'MMM d' ? 
    { month: 'short', day: 'numeric' } : 
    { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const subtractDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const subtractWeeks = (date: Date, weeks: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - (weeks * 7));
  return result;
};

const subtractMonths = (date: Date, months: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
};

export function Reports() {
  const { openModal } = useAppStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [reportType, setReportType] = useState<'overview' | 'projects' | 'team' | 'goals'>('overview');

  // Generate comprehensive mock data for reporting
  const generateReportData = () => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    
    // Task completion trend
    const taskCompletionData = Array.from({ length: days }, (_, i) => {
      const date = subtractDays(now, days - i);
      return {
        date: formatDate(date, 'MMM d'),
        completed: Math.floor(Math.random() * 15) + 5,
        created: Math.floor(Math.random() * 20) + 8,
      };
    });

    // Project status distribution
    const projectStatusData = [
      { name: 'Active', value: 12, color: '#3B82F6' },
      { name: 'On Hold', value: 3, color: '#F59E0B' },
      { name: 'Completed', value: 8, color: '#10B981' },
      { name: 'Cancelled', value: 2, color: '#EF4444' },
    ];

    // Team productivity
    const teamProductivityData = [
      { name: 'Design Team', completed: 45, assigned: 60, efficiency: 75 },
      { name: 'Development', completed: 67, assigned: 80, efficiency: 84 },
      { name: 'Marketing', completed: 23, assigned: 30, efficiency: 77 },
      { name: 'Sales', completed: 34, assigned: 40, efficiency: 85 },
      { name: 'Support', completed: 28, assigned: 35, efficiency: 80 },
    ];

    // Goal progress over time
    const goalProgressData = Array.from({ length: Math.min(days, 30) }, (_, i) => {
      const date = subtractDays(now, 30 - i);
      return {
        date: formatDate(date, 'MMM d'),
        objectives: Math.min(85, 20 + i * 2 + Math.random() * 5),
        keyResults: Math.min(92, 15 + i * 2.5 + Math.random() * 4),
        initiatives: Math.min(78, 25 + i * 1.8 + Math.random() * 6),
      };
    });

    // Budget utilization
    const budgetData = [
      { category: 'Development', allocated: 150000, spent: 127000, remaining: 23000 },
      { category: 'Marketing', allocated: 80000, spent: 65000, remaining: 15000 },
      { category: 'Design', allocated: 60000, spent: 48000, remaining: 12000 },
      { category: 'Operations', allocated: 45000, spent: 38000, remaining: 7000 },
    ];

    // Risk assessment
    const riskData = [
      { name: 'Low Risk', value: 15, color: '#10B981' },
      { name: 'Medium Risk', value: 8, color: '#F59E0B' },
      { name: 'High Risk', value: 3, color: '#EF4444' },
      { name: 'Critical', value: 1, color: '#991B1B' },
    ];

    return {
      taskCompletionData,
      projectStatusData,
      teamProductivityData,
      goalProgressData,
      budgetData,
      riskData
    };
  };

  const reportData = useMemo(() => generateReportData(), [timeRange]);

  // Key metrics calculation
  const keyMetrics = {
    totalTasks: 234,
    completedTasks: 187,
    completionRate: Math.round((187 / 234) * 100),
    activeProjects: 12,
    teamMembers: 24,
    totalBudget: 335000,
    budgetUtilized: 278000,
    budgetUtilization: Math.round((278000 / 335000) * 100),
    avgProjectProgress: 73,
    goalsOnTrack: 8,
    totalGoals: 12,
    riskScore: 85, // 0-100, higher is better
  };

  const MetricCard = ({ 
    title, 
    value, 
    unit = '', 
    change, 
    icon: Icon, 
    color = 'blue',
    trend = 'up'
  }: {
    title: string;
    value: number | string;
    unit?: string;
    change?: number;
    icon: React.ElementType;
    color?: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}{unit}
          </p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : 
               trend === 'down' ? <TrendingDown className="h-4 w-4" /> : 
               <Activity className="h-4 w-4" />}
              <span>{Math.abs(change)}% {trend === 'up' ? 'increase' : trend === 'down' ? 'decrease' : 'change'}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights into your team's performance and project health
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'projects', label: 'Projects', icon: Briefcase },
          { id: 'team', label: 'Team', icon: Users },
          { id: 'goals', label: 'Goals', icon: Target },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              reportType === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Task Completion Rate"
          value={keyMetrics.completionRate}
          unit="%"
          change={8}
          icon={CheckCircle}
          color="green"
          trend="up"
        />
        <MetricCard
          title="Active Projects"
          value={keyMetrics.activeProjects}
          change={2}
          icon={Briefcase}
          color="blue"
          trend="up"
        />
        <MetricCard
          title="Budget Utilization"
          value={keyMetrics.budgetUtilization}
          unit="%"
          change={-3}
          icon={DollarSign}
          color="purple"
          trend="down"
        />
        <MetricCard
          title="Goals On Track"
          value={`${keyMetrics.goalsOnTrack}/${keyMetrics.totalGoals}`}
          change={1}
          icon={Target}
          color="orange"
          trend="up"
        />
      </div>

      {reportType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Completion Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Task Completion Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData.taskCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stackId="1"
                    stroke="#10B981" 
                    fill="#10B981"
                    fillOpacity={0.6} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="created" 
                    stackId="2"
                    stroke="#3B82F6" 
                    fill="#3B82F6"
                    fillOpacity={0.6} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Project Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Project Status Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reportData.projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Risk Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Risk Assessment
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={reportData.riskData}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                  <Legend />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Budget Utilization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Budget Utilization
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.budgetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="allocated" fill="#E5E7EB" name="Allocated" />
                  <Bar dataKey="spent" fill="#3B82F6" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}

      {reportType === 'team' && (
        <div className="space-y-8">
          {/* Team Productivity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Team Productivity Overview
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.teamProductivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="completed" fill="#10B981" name="Completed" />
                  <Bar dataKey="assigned" fill="#E5E7EB" name="Assigned" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Team Efficiency Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportData.teamProductivityData.map((team, index) => (
              <motion.div
                key={team.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {team.name}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Efficiency</span>
                    <span className="font-medium text-gray-900 dark:text-white">{team.efficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${team.efficiency}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Completed: {team.completed}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Assigned: {team.assigned}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {reportType === 'goals' && (
        <div className="space-y-8">
          {/* Goal Progress Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Goal Progress Tracking
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportData.goalProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="objectives" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Objectives"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="keyResults" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Key Results"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="initiatives" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Initiatives"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}

      {/* Health Score Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Overall Health Score
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Based on project completion rates, team productivity, and goal achievement
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-1">
              {keyMetrics.riskScore}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Health Score
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+5 this month</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}