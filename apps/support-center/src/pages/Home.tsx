import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  TicketIcon,
  BookOpenIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  UserGroupIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const supportOptions = [
  {
    name: 'Live Chat',
    description: 'Get instant help from our support team',
    href: '/chat',
    icon: ChatBubbleLeftRightIcon,
    color: 'bg-blue-500',
    available: true
  },
  {
    name: 'Submit a Ticket',
    description: 'Create a support ticket for detailed assistance',
    href: '/tickets/create',
    icon: TicketIcon,
    color: 'bg-green-500',
    available: true
  },
  {
    name: 'Browse Knowledge Base',
    description: 'Find answers in our comprehensive help articles',
    href: '/knowledge-base',
    icon: BookOpenIcon,
    color: 'bg-purple-500',
    available: true
  },
  {
    name: 'Contact Support',
    description: 'Reach out to our support team directly',
    href: '/contact',
    icon: PhoneIcon,
    color: 'bg-orange-500',
    available: true
  }
];

const quickLinks = [
  'Getting Started with Tokenization',
  'Investor Portal Guide',
  'Trading Your Tokens',
  'Account Security',
  'Compliance Requirements',
  'Troubleshooting Common Issues'
];

const stats = [
  { name: 'Average Response Time', value: '< 2 minutes', icon: ClockIcon },
  { name: 'Customer Satisfaction', value: '98%', icon: HeartIcon },
  { name: 'Support Articles', value: '250+', icon: BookOpenIcon },
  { name: 'Support Team Members', value: '24/7', icon: UserGroupIcon }
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              How can we help you?
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              Get support for your Cycles of Wealth investment platform, tokenization processes, 
              and trading activities. Our team is here to help 24/7.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help topics, features, or issues..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900 placeholder-gray-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Options */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Support Option</h2>
          <p className="mt-4 text-lg text-gray-600">
            Select the best way to get the help you need
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportOptions.map((option) => (
            <Link
              key={option.name}
              to={option.href}
              className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${option.color} text-white mb-4`}>
                <option.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {option.name}
              </h3>
              
              <p className="mt-2 text-sm text-gray-600">
                {option.description}
              </p>
              
              {option.available && (
                <div className="mt-4 inline-flex items-center text-xs font-medium text-green-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Available Now
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Popular Help Topics</h2>
            <p className="mt-4 text-lg text-gray-600">
              Quick access to our most requested help articles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link}
                to="/knowledge-base"
                className="group flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <BookOpenIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 group-hover:text-blue-700 font-medium">
                  {link}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Support by the Numbers</h2>
            <p className="mt-4 text-lg text-gray-600">
              We're committed to providing exceptional support
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 border-t border-red-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-800">
              Need Urgent Assistance?
            </h3>
            <p className="mt-2 text-sm text-red-600">
              For critical issues affecting your investments or trading activities, 
              call our emergency line: <span className="font-semibold">1-800-COW-URGENT</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;