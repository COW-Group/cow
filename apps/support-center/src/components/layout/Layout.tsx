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
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'Tickets', href: '/tickets', icon: TicketIcon },
  { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpenIcon },
  { name: 'Contact', href: '/contact', icon: PhoneIcon },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white font-light">
      {/* Header - Clean, minimal, professional */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-18 justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <span className="text-2xl font-light text-ink-black">
                  COW <span className="font-normal">Support</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-light transition-colors ${
                      isActive
                        ? 'text-cerulean-deep bg-cerulean-ice'
                        : 'text-ink-charcoal hover:text-cerulean-deep hover:bg-paper-pearl'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Search */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-charcoal opacity-50" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cerulean-deep focus:border-transparent font-light text-ink-black placeholder-ink-charcoal placeholder-opacity-60"
                />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-ink-charcoal hover:text-cerulean-deep hover:bg-paper-pearl rounded-lg p-2 transition-colors"
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
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-light transition-colors ${
                      isActive
                        ? 'text-cerulean-deep bg-cerulean-ice'
                        : 'text-ink-charcoal hover:text-cerulean-deep hover:bg-paper-pearl'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {/* Mobile Search */}
              <div className="px-4 py-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-charcoal opacity-50" />
                  <input
                    type="text"
                    placeholder="Search for help..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cerulean-deep focus:border-transparent font-light"
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

      {/* Footer - Earth-tone grounding (Horizon Principle) */}
      <footer className="bg-earth-stone mt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-normal text-white uppercase tracking-wide">
                Support
              </h3>
              <div className="mt-4 space-y-2">
                <Link to="/chat" className="block text-sm font-light text-earth-clay hover:text-white transition-colors">
                  Live Chat
                </Link>
                <Link to="/tickets" className="block text-sm font-light text-earth-clay hover:text-white transition-colors">
                  Submit Ticket
                </Link>
                <Link to="/knowledge-base" className="block text-sm font-light text-earth-clay hover:text-white transition-colors">
                  Knowledge Base
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-normal text-white uppercase tracking-wide">
                Company
              </h3>
              <div className="mt-4 space-y-2">
                <a href="https://cow.group/about" className="block text-sm font-light text-earth-clay hover:text-white transition-colors">
                  About
                </a>
                <a href="https://cow.group/research" className="block text-sm font-light text-earth-clay hover:text-white transition-colors">
                  Research
                </a>
                <a href="https://cow.group/careers" className="block text-sm font-light text-earth-clay hover:text-white transition-colors">
                  Careers
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-normal text-white uppercase tracking-wide">
                Legal
              </h3>
              <div className="mt-4 space-y-2">
                <a href="https://cow.group/privacy" className="block text-sm font-light text-earth-clay hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="https://cow.group/terms" className="block text-sm font-light text-earth-clay hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="https://cow.group/compliance" className="block text-sm font-light text-earth-clay hover:text-white transition-colors">
                  Compliance
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-normal text-white uppercase tracking-wide">
                Contact
              </h3>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-light text-earth-clay">
                  support@cow.group
                </p>
                <p className="text-sm font-light text-earth-clay">
                  Available 24/7
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-earth-clay border-opacity-30">
            <p className="text-sm font-light text-earth-clay text-center">
              © 2025 COW Group. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;