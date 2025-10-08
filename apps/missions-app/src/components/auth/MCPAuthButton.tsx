import React, { useState, useEffect } from 'react';
import { mcpAuthService } from '../../services/mcp-auth.service';

interface MCPAuthState {
  isAuthenticated: boolean;
  accessToken?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  error?: string;
}

interface MCPAuthButtonProps {
  onAuthChange?: (isAuthenticated: boolean) => void;
  className?: string;
}

export const MCPAuthButton: React.FC<MCPAuthButtonProps> = ({
  onAuthChange,
  className = ''
}) => {
  const [authState, setAuthState] = useState<MCPAuthState>(mcpAuthService.getAuthState());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = mcpAuthService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Notify parent of auth changes
    if (onAuthChange) {
      onAuthChange(authState.isAuthenticated);
    }
  }, [authState.isAuthenticated, onAuthChange]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await mcpAuthService.initiateAuth();
      if (!result.success) {
        console.error('Authentication failed:', result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    mcpAuthService.signOut();
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const isConnected = await mcpAuthService.testConnection();
      if (isConnected) {
        alert('✅ Monday.com connection successful!');
      } else {
        alert('❌ Monday.com connection failed');
      }
    } catch (error) {
      alert(`❌ Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (authState.isAuthenticated && authState.user) {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Authenticated State */}
        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 font-medium">Connected to Monday.com</span>
              </div>
              <div className="text-sm text-green-300">
                Logged in as: {authState.user.name} ({authState.user.email})
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30
                       text-red-300 rounded border border-red-500/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Test Connection Button */}
        <button
          onClick={handleTestConnection}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30
                   text-blue-300 rounded border border-blue-500/20
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Unauthenticated State */}
      <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span className="text-yellow-400 font-medium">Monday.com Authentication Required</span>
        </div>
        <p className="text-yellow-300 text-sm mb-3">
          Connect to your Monday.com account to access your MyCow Group workspace data.
        </p>

        {authState.error && (
          <div className="mb-3 p-2 bg-red-900/30 border border-red-500/30 rounded text-red-300 text-sm">
            Error: {authState.error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-blue-500/80 hover:bg-blue-500
                   text-white rounded-lg backdrop-blur-xl border border-blue-400/20
                   transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>Connect Monday.com</span>
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-gray-900/30 border border-gray-500/30 rounded-lg p-4">
        <h4 className="text-gray-300 font-medium mb-2">How it works:</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• Click "Connect Monday.com" to authenticate</li>
          <li>• Grant access to your MyCow Group workspace</li>
          <li>• Your data will remain secure and private</li>
          <li>• You can disconnect at any time</li>
        </ul>
      </div>
    </div>
  );
};

export default MCPAuthButton;