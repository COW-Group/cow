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
      content: 'Welcome to COW Support. How can we help you today?',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'agent',
      content: 'Hi! I\'m Sarah from the support team. I\'m here to help you with your Performance RWA platform, assets, or any questions you have.',
      timestamp: new Date(),
      sender: {
        name: 'Sarah Chen',
        role: 'Support Specialist'
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
    <div className="flex flex-col h-screen bg-white">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cerulean-ice rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-cerulean-deep" />
            </div>
            <div>
              <h2 className="text-lg font-normal text-ink-black">Live Support</h2>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-error'} ${isConnected ? 'animate-pulse' : ''}`}></div>
                <span className={`text-sm font-light ${isConnected ? 'text-success' : 'text-error'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm font-light text-ink-charcoal">
            Response time: &lt; 2 min
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
                  <div className="w-6 h-6 bg-cerulean-ice rounded-full flex items-center justify-center">
                    {message.type === 'agent' ? (
                      <UserIcon className="h-4 w-4 text-cerulean-deep" />
                    ) : (
                      <ComputerDesktopIcon className="h-4 w-4 text-ink-charcoal" />
                    )}
                  </div>
                  <span className="text-sm font-light text-ink-black">
                    {message.sender.name}
                  </span>
                  {message.sender.role && (
                    <span className="text-xs font-light text-ink-charcoal">
                      • {message.sender.role}
                    </span>
                  )}
                </div>
              )}

              <div
                className={`inline-block px-4 py-3 rounded-xl ${
                  message.type === 'user'
                    ? 'bg-cerulean-deep text-white'
                    : message.type === 'agent'
                    ? 'bg-white border border-gray-200 text-ink-black shadow-card'
                    : 'bg-paper-rice text-ink-charcoal'
                }`}
              >
                <p className="text-sm font-light whitespace-pre-wrap leading-relaxed">{message.content}</p>
                
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
                <div className="w-6 h-6 bg-cerulean-ice rounded-full flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-cerulean-deep" />
                </div>
                <span className="text-sm font-light text-ink-black">Sarah Chen</span>
                <span className="text-xs font-light text-ink-charcoal">is typing...</span>
              </div>
              <div className="inline-block px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-card">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cerulean-deep rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cerulean-deep rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-cerulean-deep rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                placeholder="Type your message..."
                rows={1}
                className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 pr-24 focus:outline-none focus:ring-2 focus:ring-cerulean-deep focus:border-transparent font-light"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />

              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handleFileAttach}
                  className="p-1 text-ink-charcoal hover:text-cerulean-deep rounded transition-colors"
                  title="Attach file"
                >
                  <PaperClipIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="p-1 text-ink-charcoal hover:text-cerulean-deep rounded transition-colors"
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
            className="bg-cerulean-deep text-white px-6 py-3 rounded-xl hover:bg-cerulean hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 font-light"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            <span>Send</span>
          </button>
        </div>

        <div className="mt-2 text-xs font-light text-ink-charcoal">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default LiveChat;