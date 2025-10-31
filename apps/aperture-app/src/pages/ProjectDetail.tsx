import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Settings, 
  Share2, 
  MoreHorizontal,
  Users,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';
import { useWorkspaceStore, useAppStore } from '@/store';
import { SimpleBoardView } from '../components/boards/SimpleBoardView';
import { Button } from '@/components/ui/Button';
import type { Task } from '@/types';

export function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { getProjectById } = useWorkspaceStore();
  const { openModal } = useAppStore();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const project = projectId ? getProjectById(projectId) : null;

  useEffect(() => {
    if (!project) return;
    
    // Load project tasks
    setIsLoading(true);
    // This would typically fetch from API
    setTimeout(() => {
      setTasks(generateMockTasks(projectId!));
      setIsLoading(false);
    }, 500);
  }, [project, projectId]);

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  };

  const handleTaskCreate = (newTask: Partial<Task>) => {
    const task: Task = {
      id: `task-${Date.now()}`,
      workspaceId: project?.workspaceId || '',
      projectId: project?.id || '',
      name: 'New Task',
      status: 'todo',
      priority: 'medium',
      reporterId: 'current-user',
      position: tasks.length,
      tags: [],
      customFields: {},
      attachments: [],
      comments: [],
      dependencies: [],
      subtasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
      ...newTask
    };
    
    setTasks(prev => [...prev, task]);
    openModal('edit-task', { task });
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Project Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="h-full flex flex-col">
      {/* Project Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/projects')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {project.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {project.name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {tasks.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Tasks
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {completedTasks}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completed
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(completionRate)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Progress
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {tasks.filter(task => task.assigneeId).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Assigned
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Progress
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(completionRate)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Board View */}
      <div className="flex-1 overflow-hidden">
        <SimpleBoardView
          projectId={project.id}
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskCreate={handleTaskCreate}
          onTaskDelete={handleTaskDelete}
        />
      </div>
    </div>
  );
}

// Mock data generator for development
function generateMockTasks(projectId: string): Task[] {
  const mockTasks: Task[] = [
    {
      id: 'task-1',
      workspaceId: 'workspace-1',
      projectId,
      name: 'Design user interface mockups',
      description: 'Create high-fidelity mockups for the main dashboard and user profile pages',
      status: 'completed',
      priority: 'high',
      reporterId: 'user-1',
      assigneeId: 'user-2',
      dueDate: new Date('2024-02-15'),
      completedAt: new Date('2024-02-14'),
      estimatedHours: 16,
      actualHours: 14,
      position: 0,
      tags: ['design', 'ui', 'mockups'],
      customFields: {},
      attachments: [],
      comments: [],
      dependencies: [],
      subtasks: [],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-14'),
      progress: 100
    },
    {
      id: 'task-2',
      workspaceId: 'workspace-1',
      projectId,
      name: 'Implement authentication system',
      description: 'Set up user authentication with JWT tokens and password hashing',
      status: 'in_progress',
      priority: 'urgent',
      reporterId: 'user-1',
      assigneeId: 'user-3',
      startDate: new Date('2024-02-10'),
      dueDate: new Date('2024-02-20'),
      estimatedHours: 24,
      actualHours: 12,
      position: 1,
      tags: ['backend', 'auth', 'security'],
      customFields: {},
      attachments: [],
      comments: [],
      dependencies: [],
      subtasks: [],
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-02-16'),
      progress: 60
    },
    {
      id: 'task-3',
      workspaceId: 'workspace-1',
      projectId,
      name: 'Write API documentation',
      description: 'Document all API endpoints with examples and response schemas',
      status: 'todo',
      priority: 'medium',
      reporterId: 'user-1',
      dueDate: new Date('2024-02-25'),
      estimatedHours: 8,
      position: 2,
      tags: ['documentation', 'api'],
      customFields: {},
      attachments: [],
      comments: [],
      dependencies: ['task-2'],
      subtasks: [],
      createdAt: new Date('2024-02-08'),
      updatedAt: new Date('2024-02-08'),
      progress: 0
    },
    {
      id: 'task-4',
      workspaceId: 'workspace-1',
      projectId,
      name: 'Setup CI/CD pipeline',
      description: 'Configure automated testing and deployment pipeline',
      status: 'review',
      priority: 'medium',
      reporterId: 'user-1',
      assigneeId: 'user-4',
      startDate: new Date('2024-02-12'),
      dueDate: new Date('2024-02-22'),
      estimatedHours: 12,
      actualHours: 10,
      position: 3,
      tags: ['devops', 'ci', 'deployment'],
      customFields: {},
      attachments: [],
      comments: [],
      dependencies: [],
      subtasks: [],
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-18'),
      progress: 90
    }
  ];

  return mockTasks;
}