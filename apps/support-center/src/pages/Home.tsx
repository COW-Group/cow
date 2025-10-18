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
  HeartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const supportOptions = [
  {
    name: 'Live Chat',
    description: 'Get real-time help from our support team',
    href: '/chat',
    icon: ChatBubbleLeftRightIcon,
    available: true
  },
  {
    name: 'Submit a Ticket',
    description: 'Create a support ticket for detailed assistance',
    href: '/tickets/create',
    icon: TicketIcon,
    available: true
  },
  {
    name: 'Knowledge Base',
    description: 'Find answers in our help articles',
    href: '/knowledge-base',
    icon: BookOpenIcon,
    available: true
  },
  {
    name: 'Contact Support',
    description: 'Reach out to our support team directly',
    href: '/contact',
    icon: PhoneIcon,
    available: true
  }
];

const quickLinks = [
  { title: 'Getting Started', category: 'Basics' },
  { title: 'Account Security', category: 'Security' },
  { title: 'Trading Tokens', category: 'Trading' },
  { title: 'Investor Portal Guide', category: 'Platform' },
  { title: 'Compliance Requirements', category: 'Legal' },
  { title: 'Troubleshooting', category: 'Support' }
];

const stats = [
  { name: 'Average Response', value: '< 2 min', icon: ClockIcon },
  { name: 'Satisfaction Rate', value: '98%', icon: HeartIcon },
  { name: 'Help Articles', value: '250+', icon: BookOpenIcon },
  { name: 'Support Available', value: '24/7', icon: UserGroupIcon }
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Horizon Principle (35% Sky / 65% Earth) */}
      <div className="relative overflow-hidden">
        {/* Sky/Cerulean Section (35%) */}
        <div className="bg-gradient-to-b from-cerulean-deep to-cerulean text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-20 pb-12">
            <div className="text-center">
              <h1 className="text-5xl font-light tracking-tight sm:text-6xl lg:text-7xl">
                How can we help?
              </h1>
              <p className="mt-6 text-xl font-light text-cerulean-ice max-w-3xl mx-auto leading-relaxed">
                Support for your Performance RWA platform. Our team is here to help you optimize, manage,
                and understand your assets.
              </p>

              {/* Search Bar */}
              <div className="mt-10 max-w-2xl mx-auto">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-charcoal opacity-50" />
                  <input
                    type="text"
                    placeholder="Search for help topics or issues..."
                    className="w-full pl-12 pr-4 py-4 text-base border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerulean-light text-ink-black placeholder-ink-charcoal placeholder-opacity-60 font-light shadow-elevated"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-cerulean-deep text-white px-6 py-2.5 rounded-lg hover:bg-cerulean hover:shadow-lg transition-all duration-200 font-light">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Earth/Grounding Section (Transition) */}
        <div className="bg-gradient-to-b from-cerulean via-cerulean-ice to-white h-24"></div>
      </div>

      {/* Support Options */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 -mt-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-ink-black">Choose Your Support Path</h2>
          <p className="mt-4 text-lg font-light text-ink-charcoal leading-relaxed">
            Select the best way to get the help you need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportOptions.map((option) => (
            <Link
              key={option.name}
              to={option.href}
              className="group relative bg-white rounded-xl shadow-card border border-gray-100 p-6 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 overflow-hidden"
            >
              {/* Earth-tone grounding bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-earth-stone to-earth-clay"></div>

              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cerulean-ice text-cerulean-deep mb-4 group-hover:bg-cerulean-deep group-hover:text-white transition-all duration-200">
                <option.icon className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-normal text-ink-black group-hover:text-cerulean-deep transition-colors">
                {option.name}
              </h3>

              <p className="mt-2 text-sm font-light text-ink-charcoal leading-relaxed">
                {option.description}
              </p>

              {option.available && (
                <div className="mt-4 inline-flex items-center text-xs font-light text-success">
                  <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></div>
                  Available Now
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-paper-rice">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-ink-black">Popular Help Topics</h2>
            <p className="mt-4 text-lg font-light text-ink-charcoal leading-relaxed">
              Quick access to frequently requested articles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                to="/knowledge-base"
                className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-xl hover:border-cerulean-light hover:shadow-card transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <BookOpenIcon className="h-5 w-5 text-ink-charcoal group-hover:text-cerulean-deep transition-colors flex-shrink-0" />
                  <div>
                    <span className="text-ink-black group-hover:text-cerulean-deep font-light transition-colors block">
                      {link.title}
                    </span>
                    <span className="text-xs font-light text-ink-charcoal opacity-70">
                      {link.category}
                    </span>
                  </div>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-cerulean-deep opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/knowledge-base"
              className="inline-flex items-center space-x-2 text-cerulean-deep hover:text-cerulean font-light transition-colors"
            >
              <span>Browse all articles</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-ink-black">Our Commitment to Support</h2>
          <p className="mt-4 text-lg font-light text-ink-charcoal leading-relaxed">
            We're here to help you succeed
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.name} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cerulean-ice rounded-full mb-4">
                <stat.icon className="h-8 w-8 text-cerulean-deep" />
              </div>
              <div className="text-4xl font-light text-ink-black">{stat.value}</div>
              <div className="text-sm font-light text-ink-charcoal mt-1">{stat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contact - Earth-tone section for grounding */}
      <div className="bg-earth-clay border-t-4 border-earth-terra">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-normal text-ink-black">
              Need Urgent Assistance?
            </h3>
            <p className="mt-2 text-sm font-light text-ink-charcoal leading-relaxed max-w-2xl mx-auto">
              For critical issues affecting your assets or platform access, our priority support team is available immediately.
            </p>
            <div className="mt-4">
              <a
                href="/contact"
                className="inline-flex items-center space-x-2 bg-cerulean-deep text-white px-6 py-3 rounded-lg hover:bg-cerulean hover:shadow-lg transition-all duration-200 font-light"
              >
                <PhoneIcon className="h-5 w-5" />
                <span>Contact Priority Support</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
