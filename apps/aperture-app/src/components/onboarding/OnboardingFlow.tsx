import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Rocket, Target, Users, Zap, Bell, Trophy } from 'lucide-react';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useBoardStore } from '../../store/board.store';
import { ComponentType } from '../../types/board.types';

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ComponentType<{ onNext: () => void; onPrev: () => void; isLast: boolean; onBoardCreated?: (boardId: string) => void }>;
}

// Step Components
const WelcomeStep = ({ onNext }: { onNext: () => void; onPrev: () => void; isLast: boolean; onBoardCreated?: (boardId: string) => void }) => {
  const { classes } = useAppTheme();

  return (
    <div className="text-center space-y-8">
      <div className="flex justify-center">
        <div className={`p-6 ${classes.bg.tertiary} rounded-full`}>
          <Rocket className={`h-16 w-16 ${classes.text.primary}`} />
        </div>
      </div>

      <div>
        <h2 className={`text-3xl font-light ${classes.text.primary} mb-4`}>Welcome to Missions</h2>
        <p className={`text-lg ${classes.text.secondary} max-w-md mx-auto leading-relaxed`}>
          Your enterprise mission management platform designed for Cycles of Wealth ecosystem coordination and tokenized program execution.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <div className={`p-6 ${classes.bg.secondary} rounded-2xl border ${classes.border.default}`}>
          <Target className={`h-8 w-8 ${classes.text.primary} mb-4 mx-auto`} />
          <h3 className={`font-semibold ${classes.text.primary} mb-2`}>Strategic Execution</h3>
          <p className={`text-sm ${classes.text.secondary}`}>Orchestrate complex multi-company initiatives with precision</p>
        </div>

        <div className={`p-6 ${classes.bg.secondary} rounded-2xl border ${classes.border.default}`}>
          <Users className={`h-8 w-8 ${classes.text.primary} mb-4 mx-auto`} />
          <h3 className={`font-semibold ${classes.text.primary} mb-2`}>Team Collaboration</h3>
          <p className={`text-sm ${classes.text.secondary}`}>Seamless coordination between portfolio companies</p>
        </div>

        <div className={`p-6 ${classes.bg.secondary} rounded-2xl border ${classes.border.default}`}>
          <Zap className={`h-8 w-8 ${classes.text.primary} mb-4 mx-auto`} />
          <h3 className={`font-semibold ${classes.text.primary} mb-2`}>Smart Automation</h3>
          <p className={`text-sm ${classes.text.secondary}`}>Automated workflows for tokenized asset programs</p>
        </div>
      </div>

      <button
        onClick={onNext}
        className={`${classes.button.primary} px-8 py-3 rounded-xl font-medium`}
      >
        Let's Get Started
      </button>
    </div>
  );
};

const CreateBoardStep = ({ onNext, onPrev, onBoardCreated }: { onNext: () => void; onPrev: () => void; isLast: boolean; onBoardCreated?: (boardId: string) => void }) => {
  const { classes } = useAppTheme();
  const { createBoard, isLoading } = useBoardStore();
  const [boardName, setBoardName] = useState('My First Mission Board');
  const [boardType, setBoardType] = useState('items');
  const [isCreating, setIsCreating] = useState(false);

  const boardTypes = [
    { id: 'items', name: 'Strategic Missions', description: 'High-level company initiatives' },
    { id: 'campaigns', name: 'Operations', description: 'Day-to-day operational tasks' },
    { id: 'projects', name: 'Project Management', description: 'Specific project coordination' },
    { id: 'custom', name: 'Tokenization Program', description: 'Asset tokenization workflows' }
  ];

  const handleCreateBoard = async () => {
    if (!boardName.trim()) return;

    setIsCreating(true);
    try {
      // Create the board data using the same pattern as BoardsPage
      const boardData = {
        title: boardName.trim(),
        description: `${boardTypes.find(t => t.id === boardType)?.name} board created during onboarding`,
        privacy: 'main' as const,
        managementType: boardType as any,
        customManagementType: boardType === 'custom' ? 'Tokenization Program' : undefined,
        isStarred: false
      };

      await createBoard(boardData);

      // Call the callback if provided
      if (onBoardCreated) {
        onBoardCreated('board-created');
      }

      onNext();
    } catch (error) {
      console.error('Failed to create board:', error);
      alert('Failed to create board. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className={`text-3xl font-light ${classes.text.primary} mb-4`}>Create Your First Board</h2>
        <p className={`text-lg ${classes.text.secondary} max-w-md mx-auto`}>
          Boards are where your missions come to life. Let's create your first one.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className={`block text-sm font-medium ${classes.text.primary} mb-2`}>
            Board Name
          </label>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className={`w-full px-4 py-3 ${classes.bg.secondary} rounded-lg border ${classes.border.default} ${classes.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Enter board name..."
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${classes.text.primary} mb-4`}>
            Board Type
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            {boardTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setBoardType(type.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  boardType === type.id
                    ? 'border-blue-500 bg-blue-50/50'
                    : `border-gray-300 ${classes.hover.card}`
                }`}
              >
                <h3 className={`font-semibold ${classes.text.primary} mb-1`}>{type.name}</h3>
                <p className={`text-sm ${classes.text.secondary}`}>{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className={`p-6 ${classes.bg.secondary} rounded-2xl border ${classes.border.default}`}>
          <h3 className={`font-semibold ${classes.text.primary} mb-2`}>Preview</h3>
          <p className={`${classes.text.secondary}`}>
            Your board "<strong>{boardName}</strong>" will be created as a{' '}
            <strong>{boardTypes.find(t => t.id === boardType)?.name}</strong> board.
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onPrev}
          className={`flex items-center space-x-2 ${classes.button.secondary} px-6 py-3 rounded-xl font-medium`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        <button
          onClick={handleCreateBoard}
          disabled={!boardName.trim() || isCreating}
          className={`flex items-center space-x-2 ${classes.button.primary} px-6 py-3 rounded-xl font-medium disabled:opacity-50`}
        >
          {isCreating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating Board...</span>
            </>
          ) : (
            <>
              <span>Create Board</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const TaskManagementStep = ({ onNext, onPrev }: { onNext: () => void; onPrev: () => void; isLast: boolean; onBoardCreated?: (boardId: string) => void }) => {
  const { classes } = useAppTheme();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className={`text-3xl font-light ${classes.text.primary} mb-4`}>Managing Tasks & Items</h2>
        <p className={`text-lg ${classes.text.secondary} max-w-md mx-auto`}>
          Learn how to add, organize, and track your mission tasks effectively.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <div className={`p-6 ${classes.bg.secondary} rounded-2xl border ${classes.border.default}`}>
          <h3 className={`text-xl font-semibold ${classes.text.primary} mb-4`}>Adding Tasks</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-bold">1</div>
              <div>
                <p className={`font-medium ${classes.text.primary}`}>Click the "+" button</p>
                <p className={`text-sm ${classes.text.secondary}`}>Add new items to your board</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-bold">2</div>
              <div>
                <p className={`font-medium ${classes.text.primary}`}>Fill in details</p>
                <p className={`text-sm ${classes.text.secondary}`}>Add descriptions, due dates, and assignees</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-bold">3</div>
              <div>
                <p className={`font-medium ${classes.text.primary}`}>Set priorities</p>
                <p className={`text-sm ${classes.text.secondary}`}>Use status columns and priority levels</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-6 ${classes.bg.secondary} rounded-2xl border ${classes.border.default}`}>
          <h3 className={`text-xl font-semibold ${classes.text.primary} mb-4`}>Organization Tips</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Target className={`w-5 h-5 ${classes.text.primary} mt-0.5`} />
              <div>
                <p className={`font-medium ${classes.text.primary}`}>Use Status Columns</p>
                <p className={`text-sm ${classes.text.secondary}`}>Track progress with "To Do", "In Progress", "Done"</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className={`w-5 h-5 ${classes.text.primary} mt-0.5`} />
              <div>
                <p className={`font-medium ${classes.text.primary}`}>Assign Team Members</p>
                <p className={`text-sm ${classes.text.secondary}`}>Delegate tasks to specific team members</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Bell className={`w-5 h-5 ${classes.text.primary} mt-0.5`} />
              <div>
                <p className={`font-medium ${classes.text.primary}`}>Set Due Dates</p>
                <p className={`text-sm ${classes.text.secondary}`}>Keep projects on track with deadlines</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onPrev}
          className={`flex items-center space-x-2 ${classes.button.secondary} px-6 py-3 rounded-xl font-medium`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        <button
          onClick={onNext}
          className={`flex items-center space-x-2 ${classes.button.primary} px-6 py-3 rounded-xl font-medium`}
        >
          <span>Next: Team Setup</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const CompletionStep = ({ onNext, onPrev }: { onNext: () => void; onPrev: () => void; isLast: boolean; onBoardCreated?: (boardId: string) => void }) => {
  const { classes } = useAppTheme();

  return (
    <div className="text-center space-y-8">
      <div className="flex justify-center">
        <div className={`p-6 ${classes.bg.tertiary} rounded-full`}>
          <Trophy className={`h-16 w-16 text-yellow-500`} />
        </div>
      </div>

      <div>
        <h2 className={`text-3xl font-light ${classes.text.primary} mb-4`}>You're All Set!</h2>
        <p className={`text-lg ${classes.text.secondary} max-w-md mx-auto leading-relaxed`}>
          Congratulations! You've completed the onboarding and are ready to start managing your missions effectively.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className={`p-6 ${classes.bg.secondary} rounded-2xl border ${classes.border.default}`}>
          <h3 className={`font-semibold ${classes.text.primary} mb-4`}>What's Next?</h3>
          <ul className={`space-y-2 text-sm ${classes.text.secondary} text-left`}>
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Create your first mission board</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Invite your team members</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Start adding tasks and projects</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Explore automation features</span>
            </li>
          </ul>
        </div>

        <div className={`p-6 ${classes.bg.secondary} rounded-2xl border ${classes.border.default}`}>
          <h3 className={`font-semibold ${classes.text.primary} mb-4`}>Need Help?</h3>
          <ul className={`space-y-2 text-sm ${classes.text.secondary} text-left`}>
            <li>📚 Browse our help center</li>
            <li>💬 Join the community forum</li>
            <li>📹 Watch video tutorials</li>
            <li>✉️ Contact support team</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onPrev}
          className={`flex items-center space-x-2 ${classes.button.secondary} px-6 py-3 rounded-xl font-medium`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        <button
          onClick={onNext}
          className={`flex items-center space-x-2 ${classes.button.primary} px-8 py-3 rounded-xl font-medium`}
        >
          <span>Start Using Missions</span>
          <Rocket className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ isOpen, onClose }) => {
  const { classes } = useAppTheme();
  const { fetchBoards } = useBoardStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [createdBoardId, setCreatedBoardId] = useState<string | null>(null);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Get started with Missions',
      icon: Rocket,
      component: WelcomeStep
    },
    {
      id: 'create-board',
      title: 'Create Board',
      description: 'Set up your first mission board',
      icon: Target,
      component: CreateBoardStep
    },
    {
      id: 'tasks',
      title: 'Manage Tasks',
      description: 'Learn task management',
      icon: Users,
      component: TaskManagementStep
    },
    {
      id: 'completion',
      title: 'Complete',
      description: 'You\'re ready to go!',
      icon: Trophy,
      component: CompletionStep
    }
  ];

  const handleBoardCreated = (boardId: string) => {
    setCreatedBoardId(boardId);
    // Refresh the boards list to show the new board in the sidebar
    fetchBoards();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Refresh boards one more time before closing to ensure sidebar is updated
      fetchBoards();
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className={`${classes.bg.modal} rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border ${classes.border.default}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${classes.border.default}`}>
          <div className="flex items-center space-x-4">
            <div className={`p-2 ${classes.bg.tertiary} rounded-lg`}>
              <currentStepData.icon className={`h-6 w-6 ${classes.text.primary}`} />
            </div>
            <div>
              <h1 className={`text-xl font-semibold ${classes.text.primary}`}>Getting Started with Missions</h1>
              <p className={`text-sm ${classes.text.secondary}`}>
                Step {currentStep + 1} of {steps.length}: {currentStepData.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${classes.hover.bg} rounded-full transition-colors`}
          >
            <X className={`h-5 w-5 ${classes.text.muted}`} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className={`w-full ${classes.bg.secondary} rounded-full h-2`}>
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-8">
          <StepComponent
            onNext={handleNext}
            onPrev={handlePrev}
            isLast={currentStep === steps.length - 1}
            onBoardCreated={handleBoardCreated}
          />
        </div>
      </div>
    </div>
  );
};