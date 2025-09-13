import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  TicketIcon,
  BookOpenIcon,
  PhoneIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Live Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'Support Tickets', href: '/tickets', icon: TicketIcon },
  { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpenIcon },
  { name: 'Contact Us', href: '/contact', icon: PhoneIcon },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <HeartIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Cycles of Wealth Support
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Search */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-6 w-6" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for help..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Support
              </h3>
              <div className="mt-4 space-y-2">
                <Link to="/chat" className="block text-sm text-gray-600 hover:text-gray-900">
                  Live Chat
                </Link>
                <Link to="/tickets" className="block text-sm text-gray-600 hover:text-gray-900">
                  Submit Ticket
                </Link>
                <Link to="/knowledge-base" className="block text-sm text-gray-600 hover:text-gray-900">
                  Help Articles
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Company
              </h3>
              <div className="mt-4 space-y-2">
                <a href="https://cyclesofwealth.com/about" className="block text-sm text-gray-600 hover:text-gray-900">
                  About Us
                </a>
                <a href="https://cyclesofwealth.com/investors" className="block text-sm text-gray-600 hover:text-gray-900">
                  Investor Relations
                </a>
                <a href="https://cyclesofwealth.com/careers" className="block text-sm text-gray-600 hover:text-gray-900">
                  Careers
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Legal
              </h3>
              <div className="mt-4 space-y-2">
                <a href="https://cyclesofwealth.com/privacy" className="block text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </a>
                <a href="https://cyclesofwealth.com/terms" className="block text-sm text-gray-600 hover:text-gray-900">
                  Terms of Service
                </a>
                <a href="https://cyclesofwealth.com/disclaimers" className="block text-sm text-gray-600 hover:text-gray-900">
                  Securities Disclaimers
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Contact
              </h3>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  support@cyclesofwealth.com
                </p>
                <p className="text-sm text-gray-600">
                  1-800-COW-HELP
                </p>
                <p className="text-sm text-gray-600">
                  Available 24/7
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              © 2024 Cycles of Wealth. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;