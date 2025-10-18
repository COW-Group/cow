import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created: Date;
  updated: Date;
  messages: number;
}

const mockTickets: Ticket[] = [
  {
    id: 'T-1001',
    subject: 'Unable to access asset dashboard',
    status: 'open',
    priority: 'high',
    category: 'Technical Support',
    created: new Date('2025-01-15'),
    updated: new Date('2025-01-15'),
    messages: 1
  },
  {
    id: 'T-1002',
    subject: 'Question about algorithmic optimization',
    status: 'in-progress',
    priority: 'medium',
    category: 'Assets & Trading',
    created: new Date('2025-01-14'),
    updated: new Date('2025-01-16'),
    messages: 3
  },
  {
    id: 'T-1003',
    subject: 'Two-factor authentication setup help',
    status: 'resolved',
    priority: 'low',
    category: 'Account & Security',
    created: new Date('2025-01-13'),
    updated: new Date('2025-01-15'),
    messages: 5
  }
];

const statusConfig = {
  open: { label: 'Open', color: 'bg-cerulean-ice text-cerulean-deep', icon: ExclamationCircleIcon },
  'in-progress': { label: 'In Progress', color: 'bg-gold-soft bg-opacity-20 text-gold-deep', icon: ClockIcon },
  resolved: { label: 'Resolved', color: 'bg-success bg-opacity-20 text-success', icon: CheckCircleIcon },
  closed: { label: 'Closed', color: 'bg-gray-200 text-gray-600', icon: CheckCircleIcon }
};

const priorityConfig = {
  low: { label: 'Low', color: 'text-ink-charcoal' },
  medium: { label: 'Medium', color: 'text-gold-deep' },
  high: { label: 'High', color: 'text-warning' },
  urgent: { label: 'Urgent', color: 'text-error' }
};

const Tickets: React.FC = () => {
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [filter, setFilter] = useState<string>('all');

  const filteredTickets = filter === 'all'
    ? tickets
    : tickets.filter(t => t.status === filter);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Horizon Principle */}
      <div className="bg-gradient-to-b from-cerulean-deep to-cerulean text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-light">Support Tickets</h1>
              <p className="mt-4 text-xl font-light text-cerulean-ice leading-relaxed">
                Track and manage your support requests
              </p>
            </div>
            <Link
              to="/tickets/create"
              className="inline-flex items-center space-x-2 bg-white text-cerulean-deep px-6 py-3 rounded-xl hover:bg-cerulean-ice hover:shadow-lg transition-all duration-200 font-light"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Ticket</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Gradient transition */}
      <div className="bg-gradient-to-b from-cerulean via-cerulean-ice to-white h-16"></div>

      {/* Filters and Search */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 -mt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-ink-charcoal" />
            <div className="flex items-center space-x-2">
              {['all', 'open', 'in-progress', 'resolved', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-light transition-all ${
                    filter === status
                      ? 'bg-cerulean-deep text-white'
                      : 'bg-paper-rice text-ink-charcoal hover:bg-cerulean-ice'
                  }`}
                >
                  {status === 'all' ? 'All' : statusConfig[status as keyof typeof statusConfig]?.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-charcoal opacity-50" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerulean-deep focus:border-transparent font-light"
            />
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.length === 0 ? (
            <div className="bg-paper-rice rounded-xl p-12 text-center">
              <p className="text-lg font-light text-ink-charcoal">
                No tickets found
              </p>
              <Link
                to="/tickets/create"
                className="mt-4 inline-flex items-center space-x-2 text-cerulean-deep hover:text-cerulean font-light transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create your first ticket</span>
              </Link>
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const StatusIcon = statusConfig[ticket.status].icon;

              return (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="group block bg-white rounded-xl shadow-card border border-gray-100 p-6 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden"
                >
                  {/* Earth-tone grounding bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-earth-stone to-earth-clay"></div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-mono font-light text-ink-charcoal">
                          {ticket.id}
                        </span>
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-light ${statusConfig[ticket.status].color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          <span>{statusConfig[ticket.status].label}</span>
                        </span>
                        <span className={`text-xs font-light ${priorityConfig[ticket.priority].color}`}>
                          {priorityConfig[ticket.priority].label} Priority
                        </span>
                      </div>

                      <h3 className="text-xl font-normal text-ink-black group-hover:text-cerulean-deep transition-colors mb-2">
                        {ticket.subject}
                      </h3>

                      <div className="flex items-center space-x-4 text-sm font-light text-ink-charcoal">
                        <span className="inline-flex items-center space-x-1">
                          <span className="text-xs">Category:</span>
                          <span>{ticket.category}</span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>Created {formatDate(ticket.created)}</span>
                        </span>
                        <span>•</span>
                        <span>{ticket.messages} {ticket.messages === 1 ? 'message' : 'messages'}</span>
                      </div>
                    </div>

                    <div className="text-sm font-light text-ink-charcoal">
                      Updated {formatDate(ticket.updated)}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Help Section - Earth grounding */}
      <div className="bg-earth-clay border-t-4 border-earth-terra mt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-normal text-ink-black">
              Need immediate assistance?
            </h3>
            <p className="mt-2 text-sm font-light text-ink-charcoal leading-relaxed max-w-2xl mx-auto">
              For urgent issues, our live chat provides instant support
            </p>
            <div className="mt-6">
              <Link
                to="/chat"
                className="inline-flex items-center space-x-2 bg-cerulean-deep text-white px-6 py-3 rounded-xl hover:bg-cerulean hover:shadow-lg transition-all duration-200 font-light"
              >
                <span>Start Live Chat</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
