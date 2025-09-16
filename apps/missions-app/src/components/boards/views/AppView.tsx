import React from 'react';
import { Store, Settings, Grid3x3 } from 'lucide-react';
import { useAppStore } from '../../../store';
import { Button } from '../../ui/Button';

interface AppViewProps {
  boardId: string;
  workspaceId: string;
}

export function AppView({ boardId, workspaceId }: AppViewProps) {
  const { openModal } = useAppStore();

  const handleOpenAppMarketplace = () => {
    openModal('app-marketplace', {
      title: 'Board Apps',
      boardId,
      workspaceId
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mb-6 mx-auto">
          <Grid3x3 className="h-10 w-10 text-gray-400" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Apps Configured
        </h3>

        <p className="text-gray-600 mb-6">
          Apps help you extend your board with additional functionality. Browse our marketplace to find apps that work for your team.
        </p>

        <div className="space-y-3">
          <Button
            onClick={handleOpenAppMarketplace}
            className="w-full"
          >
            <Store className="h-4 w-4 mr-2" />
            Browse App Marketplace
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => openModal('app-settings', { boardId, workspaceId })}
          >
            <Settings className="h-4 w-4 mr-2" />
            App Settings
          </Button>
        </div>
      </div>
    </div>
  );
}