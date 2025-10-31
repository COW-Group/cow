import React, { useState, useEffect } from 'react';
import { migrationService } from '../../services/migration.service';
import { schemaSetupService } from '../../services/schema-setup.service';
import { setupMyCowUser } from '../../scripts/setup-mycow-user';
import MCPAuthButton from '../auth/MCPAuthButton';
import MCPDataInput from './MCPDataInput';

interface MigrationStatus {
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  errors: string[];
  summary: {
    workspacesCreated: number;
    boardsMigrated: number;
    groupsMigrated: number;
    tasksMigrated: number;
    commentsMigrated: number;
    membersMigrated: number;
  };
}

interface MigrationOptions {
  workspaceName: string;
  overwriteExisting: boolean;
  migrateComments: boolean;
  migrateActivities: boolean;
  userId: string;
}

export const MigrationDashboard: React.FC = () => {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus | null>(null);
  const [databaseStatus, setDatabaseStatus] = useState<{
    connected: boolean;
    schemaSetup: boolean;
    error?: string;
    instructions: string;
  } | null>(null);
  const [options, setOptions] = useState<MigrationOptions>({
    workspaceName: 'MyCow Group',
    overwriteExisting: false,
    migrateComments: true,
    migrateActivities: false,
    userId: '00000000-0000-0000-0000-000000000000' // Replace with actual user ID
  });
  const [isMondayAuthenticated, setIsMondayAuthenticated] = useState(false);
  const [mondayData, setMondayData] = useState<any[]>([]);

  useEffect(() => {
    // Check current migration status on mount
    const currentStatus = migrationService.getMigrationStatus();
    if (currentStatus) {
      setMigrationStatus(currentStatus);
    }

    // Check database status
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    const status = await schemaSetupService.getDatabaseStatus();
    setDatabaseStatus(status);
  };

  const handleStartMigration = async () => {
    try {
      const status = await migrationService.startMigration(options);
      setMigrationStatus(status);

      // Poll for updates during migration
      const pollInterval = setInterval(async () => {
        const currentStatus = migrationService.getMigrationStatus();
        if (currentStatus) {
          setMigrationStatus(currentStatus);

          if (currentStatus.status === 'completed' || currentStatus.status === 'failed') {
            clearInterval(pollInterval);
          }
        }
      }, 1000);

    } catch (error) {
      console.error('Migration failed to start:', error);
      const errorStatus = migrationService.getMigrationStatus();
      if (errorStatus) {
        setMigrationStatus(errorStatus);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'in_progress': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'in_progress': return '🔄';
      default: return '⏳';
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-white mb-2">MyCow Group Migration</h1>
        <p className="text-gray-300">
          Transfer your Monday.com "MyCow Group" workspace to your own Supabase database
        </p>
      </div>

      {/* Database Status */}
      {databaseStatus && (
        <div className="mb-8 backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Database Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${databaseStatus.connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-gray-300">
                Database Connection: {databaseStatus.connected ? 'Connected' : 'Failed'}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${databaseStatus.schemaSetup ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-gray-300">
                Schema Setup: {databaseStatus.schemaSetup ? 'Ready' : 'Pending'}
              </span>
            </div>
          </div>

          {!databaseStatus.schemaSetup && (
            <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <h3 className="text-yellow-400 font-semibold mb-2">Schema Setup Required</h3>
              <p className="text-yellow-300 text-sm mb-3">
                The database schema needs to be set up before migration can begin.
              </p>
              <details className="text-yellow-300 text-sm">
                <summary className="cursor-pointer font-medium mb-2">View Setup Instructions</summary>
                <pre className="whitespace-pre-wrap text-xs bg-black/40 p-3 rounded border border-yellow-500/20 overflow-x-auto">
                  {databaseStatus.instructions}
                </pre>
              </details>
            </div>
          )}

          {databaseStatus.error && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-red-400 font-semibold mb-2">Database Error</h3>
              <p className="text-red-300 text-sm">{databaseStatus.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Monday.com Authentication */}
      <div className="mb-8 backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Monday.com Authentication</h2>
        <MCPAuthButton
          onAuthChange={setIsMondayAuthenticated}
          className="w-full"
        />
      </div>

      {/* MCP Data Input */}
      {isMondayAuthenticated && (
        <div className="mb-8 backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Fetch Monday.com Data</h2>
          <MCPDataInput
            onDataProcessed={setMondayData}
            className="w-full"
          />
        </div>
      )}

      {/* Configuration Section */}
      <div className="mb-8 backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Migration Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Workspace Name</label>
            <input
              type="text"
              value={options.workspaceName}
              onChange={(e) => setOptions(prev => ({ ...prev, workspaceName: e.target.value }))}
              className="w-full p-3 rounded-lg bg-black/40 border border-white/20 text-white placeholder-gray-400"
              placeholder="MyCow Group"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">User ID (Your ID)</label>
            <input
              type="text"
              value={options.userId}
              onChange={(e) => setOptions(prev => ({ ...prev, userId: e.target.value }))}
              className="w-full p-3 rounded-lg bg-black/40 border border-white/20 text-white placeholder-gray-400"
              placeholder="Enter your user UUID"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="flex items-center space-x-3 text-gray-300">
            <input
              type="checkbox"
              checked={options.overwriteExisting}
              onChange={(e) => setOptions(prev => ({ ...prev, overwriteExisting: e.target.checked }))}
              className="w-5 h-5 rounded border border-white/20 bg-black/40"
            />
            <span>Overwrite existing workspace if it exists</span>
          </label>

          <label className="flex items-center space-x-3 text-gray-300">
            <input
              type="checkbox"
              checked={options.migrateComments}
              onChange={(e) => setOptions(prev => ({ ...prev, migrateComments: e.target.checked }))}
              className="w-5 h-5 rounded border border-white/20 bg-black/40"
            />
            <span>Migrate task comments</span>
          </label>

          <label className="flex items-center space-x-3 text-gray-300">
            <input
              type="checkbox"
              checked={options.migrateActivities}
              onChange={(e) => setOptions(prev => ({ ...prev, migrateActivities: e.target.checked }))}
              className="w-5 h-5 rounded border border-white/20 bg-black/40"
            />
            <span>Migrate activity logs (experimental)</span>
          </label>
        </div>
      </div>

      {/* Migration Control */}
      <div className="mb-8 backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Migration Control</h2>

        <div className="flex space-x-4">
          <button
            onClick={handleStartMigration}
            disabled={
              migrationStatus?.status === 'in_progress' ||
              !databaseStatus?.schemaSetup ||
              !isMondayAuthenticated ||
              mondayData.length === 0
            }
            className="px-6 py-3 bg-blue-500/80 hover:bg-blue-500 disabled:bg-gray-500/50
                     text-white rounded-lg backdrop-blur-xl border border-blue-400/20
                     transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {migrationStatus?.status === 'in_progress'
              ? 'Migration Running...'
              : !databaseStatus?.schemaSetup
                ? 'Schema Setup Required'
                : !isMondayAuthenticated
                  ? 'Monday.com Authentication Required'
                  : mondayData.length === 0
                    ? 'Monday.com Data Required'
                    : 'Start Migration'}
          </button>

          <button
            onClick={() => setMigrationStatus(null)}
            className="px-6 py-3 bg-gray-600/80 hover:bg-gray-600 text-white rounded-lg
                     backdrop-blur-xl border border-gray-400/20 transition-colors duration-200"
          >
            Clear Status
          </button>
        </div>
      </div>

      {/* Migration Status */}
      {migrationStatus && (
        <div className="mb-8 backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Migration Status</h2>

          {/* Status Overview */}
          <div className="mb-6">
            <div className={`text-lg font-medium ${getStatusColor(migrationStatus.status)} mb-2`}>
              {getStatusIcon(migrationStatus.status)} Status: {migrationStatus.status.toUpperCase()}
            </div>

            <div className="text-gray-300 mb-2">
              Current Step: {migrationStatus.currentStep}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${migrationStatus.progress}%` }}
              />
            </div>
            <div className="text-sm text-gray-400">
              Progress: {Math.round(migrationStatus.progress)}%
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-black/40 p-4 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-blue-400">{migrationStatus.summary.workspacesCreated}</div>
              <div className="text-sm text-gray-400">Workspaces</div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-green-400">{migrationStatus.summary.boardsMigrated}</div>
              <div className="text-sm text-gray-400">Boards</div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-yellow-400">{migrationStatus.summary.groupsMigrated}</div>
              <div className="text-sm text-gray-400">Groups</div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-purple-400">{migrationStatus.summary.tasksMigrated}</div>
              <div className="text-sm text-gray-400">Tasks</div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-pink-400">{migrationStatus.summary.commentsMigrated}</div>
              <div className="text-sm text-gray-400">Comments</div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-cyan-400">{migrationStatus.summary.membersMigrated}</div>
              <div className="text-sm text-gray-400">Members</div>
            </div>
          </div>

          {/* Errors */}
          {migrationStatus.errors.length > 0 && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-red-400 font-semibold mb-2">Errors:</h3>
              <ul className="text-red-300 text-sm space-y-1">
                {migrationStatus.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Before You Start</h2>
        <ul className="text-gray-300 space-y-2">
          <li>• Ensure your Monday.com MCP is configured and accessible</li>
          <li>• Make sure you have the correct user ID for workspace ownership</li>
          <li>• The migration will create a new "MyCow Group" workspace in Supabase</li>
          <li>• All boards, groups, tasks, and optionally comments will be transferred</li>
          <li>• Original Monday.com data will remain unchanged</li>
        </ul>
      </div>
    </div>
  );
};

export default MigrationDashboard;