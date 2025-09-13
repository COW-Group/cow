import React, { useState, useRef, useEffect } from 'react';
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  UserIcon,
  ComputerDesktopIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  sender?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  attachments?: Array<{
    name: string;
    type: string;
    url: string;
  }>;
}

const LiveChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to Cycles of Wealth Support! How can we help you today?',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'agent',
      content: 'Hi! I\'m Sarah from the support team. I\'m here to help you with any questions about your investments, tokenization, or trading activities.',
      timestamp: new Date(),
      sender: {
        name: 'Sarah Chen',
        role: 'Senior Support Specialist'
      }
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected] = useState(true); // TODO: Use setIsConnected for connection status updates
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date(),
      sender: {
        name: 'You'
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      setIsTyping(false);
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'Thanks for your message! I\'m looking into that for you. Let me check our systems and get back to you with the information you need.',
        timestamp: new Date(),
        sender: {
          name: 'Sarah Chen',
          role: 'Senior Support Specialist'
        }
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Live Support Chat</h2>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Average response time: &lt; 2 minutes
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              {message.type !== 'user' && message.sender && (
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    {message.type === 'agent' ? (
                      <UserIcon className="h-4 w-4 text-blue-600" />
                    ) : (
                      <ComputerDesktopIcon className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {message.sender.name}
                  </span>
                  {message.sender.role && (
                    <span className="text-xs text-gray-500">
                      • {message.sender.role}
                    </span>
                  )}
                </div>
              )}
              
              <div
                className={`inline-block px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'agent'
                    ? 'bg-white border border-gray-200 text-gray-900'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <PaperClipIcon className="h-3 w-3" />
                        <span>{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Sarah Chen</span>
                <span className="text-xs text-gray-500">is typing...</span>
              </div>
              <div className="inline-block px-4 py-2 rounded-lg bg-white border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                rows={1}
                className="w-full resize-none border border-gray-300 rounded-lg px-4 py-2 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handleFileAttach}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Attach file"
                >
                  <PaperClipIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Add emoji"
                >
                  <FaceSmileIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            <span>Send</span>
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default LiveChat;