import React, { useState } from 'react';
import { mondayMCPProxyService } from '../../services/monday-mcp-proxy.service';

interface MCPDataInputProps {
  onDataProcessed?: (boards: any[]) => void;
  className?: string;
}

export const MCPDataInput: React.FC<MCPDataInputProps> = ({
  onDataProcessed,
  className = ''
}) => {
  const [rawData, setRawData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const handleProcessData = async () => {
    if (!rawData.trim()) {
      setError('Please enter Monday.com data first');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const boards = await mondayMCPProxyService.processMondayData(rawData);
      setProcessedData(boards);

      if (onDataProcessed) {
        onDataProcessed(boards);
      }

      console.log('✅ Successfully processed Monday.com data:', boards);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process data';
      setError(errorMessage);
      console.error('❌ Error processing data:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestConnection = async () => {
    setIsProcessing(true);
    try {
      const isConnected = await mondayMCPProxyService.testConnection();
      if (isConnected) {
        // Show instructions for fetching data
        await mondayMCPProxyService.fetchWorkspaceData();
      }
    } catch (err) {
      setError('Connection test failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const sampleQueries = [
    "Show me all boards in my MyCow Group workspace on Monday.com formatted as JSON",
    "List all items in my project board with their details as JSON",
    "Get all workspaces and boards from Monday.com in JSON format",
    "Show me boards with their groups and items from Monday.com workspace"
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Instructions */}
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">📋 How to Get Your Monday.com Data</h3>
        <p className="text-blue-300 text-sm mb-3">
          Since Monday.com is connected to Claude via MCP, ask Claude directly for your workspace data:
        </p>

        <div className="space-y-2 mb-3">
          <p className="text-blue-200 text-sm font-medium">Sample queries to try:</p>
          {sampleQueries.map((query, index) => (
            <div key={index} className="bg-black/20 rounded p-2 text-xs text-blue-100 font-mono">
              "{query}"
            </div>
          ))}
        </div>

        <button
          onClick={handleTestConnection}
          disabled={isProcessing}
          className="px-3 py-1 text-sm bg-blue-500/20 hover:bg-blue-500/30
                   text-blue-300 rounded border border-blue-500/20 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Testing...' : 'Show MCP Instructions'}
        </button>
      </div>

      {/* Data Input */}
      <div className="space-y-3">
        <label className="block text-gray-300 font-medium">
          Paste Monday.com Data (JSON format)
        </label>

        <textarea
          value={rawData}
          onChange={(e) => setRawData(e.target.value)}
          placeholder="Paste the JSON response from Claude here..."
          className="w-full h-40 p-3 rounded-lg bg-black/40 border border-white/20
                   text-white placeholder-gray-400 font-mono text-sm
                   focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
        />

        <div className="flex space-x-3">
          <button
            onClick={handleProcessData}
            disabled={isProcessing || !rawData.trim()}
            className="px-4 py-2 bg-green-500/80 hover:bg-green-500
                     text-white rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Process Data'}
          </button>

          <button
            onClick={() => {
              setRawData('');
              setProcessedData([]);
              setError('');
            }}
            className="px-4 py-2 bg-gray-600/80 hover:bg-gray-600
                     text-white rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Processed Data Summary */}
      {processedData.length > 0 && (
        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
          <h3 className="text-green-400 font-semibold mb-2">✅ Data Processed Successfully</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-green-200">Boards Found:</div>
              <div className="text-white font-bold">{processedData.length}</div>
            </div>
            <div>
              <div className="text-green-200">Total Groups:</div>
              <div className="text-white font-bold">
                {processedData.reduce((acc, board) => acc + (board.groups?.length || 0), 0)}
              </div>
            </div>
            <div>
              <div className="text-green-200">Total Items:</div>
              <div className="text-white font-bold">
                {processedData.reduce((acc, board) =>
                  acc + (board.groups?.reduce((groupAcc: number, group: any) =>
                    groupAcc + (group.items?.length || 0), 0) || 0), 0)}
              </div>
            </div>
            <div>
              <div className="text-green-200">Status:</div>
              <div className="text-green-300 font-bold">Ready to Migrate</div>
            </div>
          </div>

          <details className="mt-3">
            <summary className="cursor-pointer text-green-300 text-sm hover:text-green-200">
              View Board Details
            </summary>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {processedData.map((board, index) => (
                <div key={index} className="bg-black/20 rounded p-2 text-xs">
                  <div className="text-green-200 font-medium">{board.name}</div>
                  <div className="text-gray-300">
                    ID: {board.id} | Groups: {board.groups?.length || 0} |
                    Items: {board.groups?.reduce((acc: number, g: any) => acc + (g.items?.length || 0), 0) || 0}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default MCPDataInput;