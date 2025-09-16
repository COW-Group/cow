import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Inbox,
  Send,
  FileText,
  Archive,
  Trash,
  Star,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Reply,
  ReplyAll,
  Forward,
  MoreHorizontal,
  Paperclip,
  Calendar,
  Users,
  Settings,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '../../ui/Button';

interface Email {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  preview: string;
  body: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  important: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash' | 'spam';
  labels: string[];
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
}

interface EmailFolder {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

export function EmailApp() {
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [composeData, setComposeData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: ''
  });

  // Mock email data
  const emails: Email[] = [
    {
      id: '1',
      from: { name: 'Sarah Wilson', email: 'sarah@techcorp.com' },
      to: ['user@missions.app'],
      subject: 'Project Update - Q4 Roadmap',
      preview: 'Hi there! I wanted to share the latest updates on our Q4 roadmap. We\'ve made significant progress on...',
      body: 'Hi there!\n\nI wanted to share the latest updates on our Q4 roadmap. We\'ve made significant progress on the new features and I think you\'ll be excited about what\'s coming.\n\nKey highlights:\n- New dashboard redesign\n- Advanced analytics\n- Mobile app improvements\n\nLet me know your thoughts!\n\nBest,\nSarah',
      timestamp: new Date(2024, 11, 10, 14, 30),
      read: false,
      starred: true,
      important: true,
      folder: 'inbox',
      labels: ['work', 'urgent'],
      attachments: [
        { name: 'Q4_Roadmap.pdf', size: '2.1 MB', type: 'pdf' }
      ]
    },
    {
      id: '2',
      from: { name: 'Team Calendar', email: 'calendar@missions.app' },
      to: ['user@missions.app'],
      subject: 'Meeting Reminder: Sprint Planning',
      preview: 'This is a reminder about your upcoming meeting: Sprint Planning scheduled for tomorrow at 10:00 AM.',
      body: 'This is a reminder about your upcoming meeting:\n\nSprint Planning\nDate: Tomorrow, December 11th\nTime: 10:00 AM - 11:30 AM\nLocation: Conference Room A / Zoom\n\nAgenda:\n1. Review last sprint\n2. Plan upcoming sprint\n3. Assign tasks\n\nPlease come prepared with your task estimates.',
      timestamp: new Date(2024, 11, 10, 12, 15),
      read: false,
      starred: false,
      important: false,
      folder: 'inbox',
      labels: ['meetings', 'calendar']
    },
    {
      id: '3',
      from: { name: 'John Martinez', email: 'john@company.com' },
      to: ['user@missions.app'],
      subject: 'Great job on the presentation!',
      preview: 'Just wanted to say that your presentation yesterday was excellent. The team was really impressed with...',
      body: 'Hi!\n\nJust wanted to say that your presentation yesterday was excellent. The team was really impressed with the depth of research and the clear way you presented the data.\n\nLooking forward to seeing how this project develops.\n\nCheers,\nJohn',
      timestamp: new Date(2024, 11, 9, 16, 45),
      read: true,
      starred: false,
      important: false,
      folder: 'inbox',
      labels: ['feedback', 'positive']
    }
  ];

  const folders: EmailFolder[] = [
    { id: 'inbox', name: 'Inbox', icon: <Inbox className="w-4 h-4" />, count: 2, color: 'text-blue-600' },
    { id: 'starred', name: 'Starred', icon: <Star className="w-4 h-4" />, count: 1, color: 'text-yellow-600' },
    { id: 'sent', name: 'Sent', icon: <Send className="w-4 h-4" />, count: 8, color: 'text-green-600' },
    { id: 'drafts', name: 'Drafts', icon: <FileText className="w-4 h-4" />, count: 3, color: 'text-gray-600' },
    { id: 'archive', name: 'Archive', icon: <Archive className="w-4 h-4" />, count: 42, color: 'text-purple-600' },
    { id: 'trash', name: 'Trash', icon: <Trash className="w-4 h-4" />, count: 5, color: 'text-red-600' }
  ];

  const getDisplayEmails = () => {
    let displayEmails = emails;

    if (selectedFolder === 'starred') {
      displayEmails = emails.filter(email => email.starred);
    } else {
      displayEmails = emails.filter(email => email.folder === selectedFolder);
    }

    if (searchQuery) {
      displayEmails = displayEmails.filter(email =>
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.preview.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return displayEmails;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedEmail(null);
  };

  const handleSendEmail = () => {
    // Mock send email
    console.log('Sending email:', composeData);
    setIsComposing(false);
    setComposeData({ to: '', cc: '', bcc: '', subject: '', body: '' });
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setIsComposing(false);
    // Mark as read
    email.read = true;
  };

  const handleReply = () => {
    if (selectedEmail) {
      setComposeData({
        to: selectedEmail.from.email,
        cc: '',
        bcc: '',
        subject: `Re: ${selectedEmail.subject}`,
        body: `\n\nOn ${selectedEmail.timestamp.toLocaleDateString()}, ${selectedEmail.from.name} wrote:\n> ${selectedEmail.body.replace(/\n/g, '\n> ')}`
      });
      setIsComposing(true);
      setSelectedEmail(null);
    }
  };

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
            <h1 className="text-lg font-semibold text-gray-900">Email</h1>
          </div>

          <Button
            onClick={handleCompose}
            className="w-full flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Compose
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Folders */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left hover:bg-gray-100 transition-colors ${
                  selectedFolder === folder.id ? 'bg-blue-100 text-blue-900 border border-blue-200' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={folder.color}>{folder.icon}</span>
                  <span className="text-sm font-medium">{folder.name}</span>
                </div>
                {folder.count > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedFolder === folder.id
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {folder.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Email List */}
        {!selectedEmail && !isComposing && (
          <div className="w-96 border-r border-gray-200 bg-white">
            {/* List Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {selectedFolder}
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Email List */}
            <div className="overflow-y-auto">
              {getDisplayEmails().map((email) => (
                <motion.div
                  key={email.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer p-4 ${
                    !email.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => handleEmailClick(email)}
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {email.from.avatar ? (
                        <img
                          src={email.from.avatar}
                          alt={email.from.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {email.from.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm truncate ${
                          !email.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                        }`}>
                          {email.from.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          {email.starred && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                          <span className="text-xs text-gray-500">
                            {formatTime(email.timestamp)}
                          </span>
                        </div>
                      </div>

                      <p className={`text-sm mb-1 truncate ${
                        !email.read ? 'font-semibold text-gray-900' : 'text-gray-700'
                      }`}>
                        {email.subject}
                      </p>

                      <p className="text-xs text-gray-500 truncate">
                        {email.preview}
                      </p>

                      {/* Labels and attachments */}
                      <div className="flex items-center gap-2 mt-2">
                        {email.labels.map((label) => (
                          <span
                            key={label}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                          >
                            {label}
                          </span>
                        ))}
                        {email.attachments && email.attachments.length > 0 && (
                          <Paperclip className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Email Detail View */}
        {selectedEmail && !isComposing && (
          <div className="flex-1 bg-white">
            {/* Email Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to emails
                </button>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleReply}>
                    <Reply className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ReplyAll className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Forward className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {selectedEmail.from.avatar ? (
                    <img
                      src={selectedEmail.from.avatar}
                      alt={selectedEmail.from.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-700">
                        {selectedEmail.from.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedEmail.subject}
                  </h1>

                  <div className="text-sm text-gray-600">
                    <p className="mb-1">
                      <span className="font-medium">{selectedEmail.from.name}</span>
                      {' '}&lt;{selectedEmail.from.email}&gt;
                    </p>
                    <p className="mb-1">
                      To: {selectedEmail.to.join(', ')}
                    </p>
                    <p className="text-gray-500">
                      {selectedEmail.timestamp.toLocaleDateString([], {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Labels */}
              {selectedEmail.labels.length > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  {selectedEmail.labels.map((label) => (
                    <span
                      key={label}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Email Body */}
            <div className="p-6">
              <div className="prose max-w-none">
                {selectedEmail.body.split('\n').map((line, index) => (
                  <p key={index} className="mb-3">
                    {line}
                  </p>
                ))}
              </div>

              {/* Attachments */}
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Attachments ({selectedEmail.attachments.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedEmail.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <Paperclip className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {attachment.size} • {attachment.type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compose Email */}
        {isComposing && (
          <div className="flex-1 bg-white">
            {/* Compose Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  New Message
                </h2>
                <button
                  onClick={() => setIsComposing(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Compose Form */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="email"
                    value={composeData.to}
                    onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="recipient@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CC
                    </label>
                    <input
                      type="email"
                      value={composeData.cc}
                      onChange={(e) => setComposeData(prev => ({ ...prev, cc: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="cc@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      BCC
                    </label>
                    <input
                      type="email"
                      value={composeData.bcc}
                      onChange={(e) => setComposeData(prev => ({ ...prev, bcc: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="bcc@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={composeData.subject}
                    onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={composeData.body}
                    onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Write your message..."
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="w-4 h-4" />
                      Attach
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4" />
                      Schedule
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsComposing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSendEmail}>
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedEmail && !isComposing && (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select an email
              </h3>
              <p className="text-gray-500">
                Choose an email from the list to read its contents
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}