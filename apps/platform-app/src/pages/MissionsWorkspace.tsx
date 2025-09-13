import React, { useState } from 'react';
import {
  RocketLaunchIcon,
  ViewColumnsIcon,
  TableCellsIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisHorizontalIcon,
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

// Import types from missions engine (in real app, this would be from shared library)
interface Mission {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  owner: string;
  team: string[];
  progress: number;
  startDate: Date;
  endDate?: Date;
  boardsCount: number;
  tasksCount: number;
  completedTasks: number;
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  type: 'personal' | 'team' | 'company' | 'client';
  missions: Mission[];
  members: string[];
  starred: boolean;
  lastAccessed: Date;
}

const MissionsWorkspace: React.FC = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('tokenization');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock workspaces data
  const workspaces: Workspace[] = [
    {
      id: 'tokenization',
      name: 'Company Tokenization',
      description: 'Manage all company tokenization projects and workflows',
      type: 'company',
      starred: true,
      lastAccessed: new Date(),
      members: ['sarah.chen@cow.com', 'michael.rodriguez@cow.com', 'david.kim@cow.com'],
      missions: [
        {
          id: 'mission-1',
          title: 'TechCorp Tokenization Mission',
          description: 'Complete end-to-end tokenization process for TechCorp Inc.',
          type: 'tokenization',
          status: 'active',
          priority: 'high',
          owner: 'sarah.chen@cow.com',
          team: ['sarah.chen@cow.com', 'michael.rodriguez@cow.com', 'david.kim@cow.com'],
          progress: 35,
          startDate: new Date('2024-09-01'),
          endDate: new Date('2024-12-31'),
          boardsCount: 3,
          tasksCount: 24,
          completedTasks: 8,
        },
        {
          id: 'mission-2',
          title: 'GreenEnergy Solutions Tokenization',
          description: 'Renewable energy company tokenization project',
          type: 'tokenization',
          status: 'planning',
          priority: 'medium',
          owner: 'michael.rodriguez@cow.com',
          team: ['michael.rodriguez@cow.com', 'david.kim@cow.com'],
          progress: 15,
          startDate: new Date('2024-10-01'),
          endDate: new Date('2025-02-28'),
          boardsCount: 2,
          tasksCount: 18,
          completedTasks: 3,
        },
      ],
    },
    {
      id: 'compliance',
      name: 'Compliance & Legal',
      description: 'Regulatory compliance and legal requirement tracking',
      type: 'company',
      starred: true,
      lastAccessed: new Date('2024-09-09'),
      members: ['legal@cow.com', 'compliance@cow.com'],
      missions: [
        {
          id: 'mission-3',
          title: 'Q4 Compliance Review',
          description: 'Ensure all Q4 regulatory compliance requirements are met',
          type: 'compliance',
          status: 'active',
          priority: 'high',
          owner: 'legal@cow.com',
          team: ['legal@cow.com', 'compliance@cow.com'],
          progress: 45,
          startDate: new Date('2024-09-01'),
          endDate: new Date('2024-12-31'),
          boardsCount: 2,
          tasksCount: 16,
          completedTasks: 7,
        },
      ],
    },
    {
      id: 'investor-relations',
      name: 'Investor Relations',
      description: 'Manage investor campaigns and fundraising activities',
      type: 'company',
      starred: false,
      lastAccessed: new Date('2024-09-08'),
      members: ['investor-relations@cow.com', 'ceo@cow.com'],
      missions: [
        {
          id: 'mission-4',
          title: 'Series A Fundraising',
          description: 'Complete Series A fundraising round',
          type: 'campaign',
          status: 'active',
          priority: 'urgent',
          owner: 'investor-relations@cow.com',
          team: ['investor-relations@cow.com', 'ceo@cow.com'],
          progress: 65,
          startDate: new Date('2024-08-01'),
          endDate: new Date('2024-12-15'),
          boardsCount: 1,
          tasksCount: 12,
          completedTasks: 8,
        },
      ],
    },
    {
      id: 'personal',
      name: 'My Personal Missions',
      description: 'Personal productivity and task management',
      type: 'personal',
      starred: false,
      lastAccessed: new Date('2024-09-10'),
      members: ['current-user@cow.com'],
      missions: [
        {
          id: 'mission-5',
          title: 'Professional Development',
          description: 'Personal learning and skill development goals',
          type: 'focus',
          status: 'active',
          priority: 'medium',
          owner: 'current-user@cow.com',
          team: ['current-user@cow.com'],
          progress: 25,
          startDate: new Date('2024-09-01'),
          endDate: new Date('2024-12-31'),
          boardsCount: 1,
          tasksCount: 8,
          completedTasks: 2,
        },
      ],
    },
  ];

  const currentWorkspace = workspaces.find(w => w.id === selectedWorkspace);
  
  const filteredMissions = currentWorkspace?.missions.filter(mission =>
    mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-blue-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const openMissionInEngine = (missionId: string) => {
    window.open(`http://localhost:4201/missions/${missionId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Missions</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your mission-driven workflows and projects
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.open('http://localhost:4201', '_blank')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                Open Missions Engine
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Mission
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Workspace Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Workspaces</h2>
              <button className="p-1 rounded-md hover:bg-gray-100">
                <PlusIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-2">
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => setSelectedWorkspace(workspace.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedWorkspace === workspace.id
                      ? 'bg-indigo-50 border-indigo-200'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">
                          {workspace.name}
                        </h3>
                        {workspace.starred && (
                          <StarIcon className="h-4 w-4 text-yellow-400 ml-1" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {workspace.description}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-400">
                        <RocketLaunchIcon className="h-3 w-3 mr-1" />
                        {workspace.missions.length} missions
                        <UserGroupIcon className="h-3 w-3 ml-3 mr-1" />
                        {workspace.members.length} members
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {currentWorkspace && (
            <div className="h-full flex flex-col">
              {/* Workspace Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {currentWorkspace.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {currentWorkspace.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                      >
                        <ViewColumnsIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                      >
                        <TableCellsIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search missions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Missions Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMissions.map((mission) => (
                      <div
                        key={mission.id}
                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => openMissionInEngine(mission.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {mission.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                              {mission.description}
                            </p>
                          </div>
                          <button className="ml-2 p-1 rounded-md hover:bg-gray-100">
                            <EllipsisHorizontalIcon className="h-5 w-5 text-gray-400" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                            {mission.status}
                          </span>
                          <span className={`text-sm font-medium ${getPriorityColor(mission.priority)}`}>
                            {mission.priority}
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{mission.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${mission.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <ViewColumnsIcon className="h-4 w-4 mr-1" />
                            {mission.boardsCount} boards
                          </div>
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            {mission.completedTasks}/{mission.tasksCount} tasks
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <UserGroupIcon className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-500">
                                {mission.team.length} members
                              </span>
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-500">
                                Due {mission.endDate?.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add New Mission Card */}
                    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center hover:border-gray-400 transition-colors cursor-pointer">
                      <PlusIcon className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Create New Mission
                      </h3>
                      <p className="text-sm text-gray-500 text-center">
                        Start a new mission to organize your work
                      </p>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="space-y-4">
                        {filteredMissions.map((mission) => (
                          <div
                            key={mission.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => openMissionInEngine(mission.id)}
                          >
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h3 className="text-sm font-medium text-gray-900">
                                  {mission.title}
                                </h3>
                                <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                                  {mission.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {mission.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div>{mission.progress}%</div>
                              <div>{mission.completedTasks}/{mission.tasksCount} tasks</div>
                              <div>{mission.team.length} members</div>
                              <div>Due {mission.endDate?.toLocaleDateString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionsWorkspace;