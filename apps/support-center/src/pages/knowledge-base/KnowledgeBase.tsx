import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  CogIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const categories = [
  {
    name: 'Getting Started',
    description: 'Learn the basics of Performance RWAs',
    icon: QuestionMarkCircleIcon,
    articleCount: 12,
    slug: 'getting-started'
  },
  {
    name: 'Assets & Trading',
    description: 'Manage your assets and optimize performance',
    icon: CurrencyDollarIcon,
    articleCount: 18,
    slug: 'assets-trading'
  },
  {
    name: 'Account & Security',
    description: 'Secure your account and manage settings',
    icon: ShieldCheckIcon,
    articleCount: 15,
    slug: 'account-security'
  },
  {
    name: 'Technical Support',
    description: 'Troubleshoot issues and get technical help',
    icon: CogIcon,
    articleCount: 23,
    slug: 'technical-support'
  }
];

const popularArticles = [
  { title: 'How to get started with your first asset', category: 'Getting Started' },
  { title: 'Understanding algorithmic optimization', category: 'Assets & Trading' },
  { title: 'Setting up two-factor authentication', category: 'Account & Security' },
  { title: 'Compliance requirements overview', category: 'Getting Started' },
  { title: 'Troubleshooting platform access', category: 'Technical Support' },
  { title: 'Managing your asset portfolio', category: 'Assets & Trading' }
];

const KnowledgeBase: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with Search - Horizon Principle */}
      <div className="bg-gradient-to-b from-cerulean-deep to-cerulean">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-light text-white">Knowledge Base</h1>
            <p className="mt-4 text-lg font-light text-cerulean-ice leading-relaxed max-w-2xl mx-auto">
              Find answers to your questions about Performance RWAs, platform features, and support
            </p>

            {/* Search */}
            <div className="mt-10 max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-charcoal opacity-50" />
                <input
                  type="text"
                  placeholder="Search knowledge base..."
                  className="w-full pl-12 pr-4 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerulean-light text-ink-black placeholder-ink-charcoal placeholder-opacity-60 font-light shadow-elevated"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient transition */}
      <div className="bg-gradient-to-b from-cerulean via-cerulean-ice to-white h-16"></div>

      {/* Categories */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 -mt-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-ink-black">Browse by Category</h2>
          <p className="mt-4 text-lg font-light text-ink-charcoal leading-relaxed">
            Explore organized help articles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/knowledge-base/category/${category.slug}`}
              className="group relative bg-white rounded-xl shadow-card border border-gray-100 p-6 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 overflow-hidden"
            >
              {/* Earth-tone grounding bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-earth-stone to-earth-clay"></div>

              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cerulean-ice text-cerulean-deep mb-4 group-hover:bg-cerulean-deep group-hover:text-white transition-all duration-200">
                <category.icon className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-normal text-ink-black group-hover:text-cerulean-deep transition-colors">
                {category.name}
              </h3>

              <p className="mt-2 text-sm font-light text-ink-charcoal leading-relaxed">
                {category.description}
              </p>

              <div className="mt-4 text-sm font-light text-cerulean-deep">
                {category.articleCount} articles
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="bg-paper-rice">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-ink-black">Popular Articles</h2>
            <p className="mt-4 text-lg font-light text-ink-charcoal leading-relaxed">
              Most viewed help articles
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-card border border-gray-100 p-8">
            <div className="space-y-1">
              {popularArticles.map((article, index) => (
                <Link
                  key={index}
                  to={`/knowledge-base/article/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group flex items-center justify-between p-4 rounded-xl hover:bg-cerulean-ice transition-all duration-200"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <BookOpenIcon className="h-5 w-5 text-ink-charcoal group-hover:text-cerulean-deep transition-colors flex-shrink-0" />
                    <div>
                      <span className="text-ink-black group-hover:text-cerulean-deep font-light transition-colors block">
                        {article.title}
                      </span>
                      <span className="text-xs font-light text-ink-charcoal opacity-70">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-cerulean-deep opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <Link
                to="/knowledge-base/search"
                className="inline-flex items-center space-x-2 text-cerulean-deep hover:text-cerulean font-light transition-colors"
              >
                <span>View all articles</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Help section - Earth grounding */}
      <div className="bg-earth-clay border-t-4 border-earth-terra">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-normal text-ink-black">
              Can't find what you're looking for?
            </h3>
            <p className="mt-2 text-sm font-light text-ink-charcoal leading-relaxed max-w-2xl mx-auto">
              Our support team is available 24/7 to help you with any questions
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4">
              <Link
                to="/chat"
                className="inline-flex items-center space-x-2 bg-cerulean-deep text-white px-6 py-3 rounded-xl hover:bg-cerulean hover:shadow-lg transition-all duration-200 font-light"
              >
                <span>Chat with Support</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                to="/tickets/create"
                className="inline-flex items-center space-x-2 bg-white text-cerulean-deep border-2 border-cerulean-deep px-6 py-3 rounded-xl hover:bg-cerulean-ice transition-all duration-200 font-light"
              >
                <span>Submit a Ticket</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
