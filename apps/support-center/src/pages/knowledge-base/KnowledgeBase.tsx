import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  CogIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const categories = [
  {
    name: 'Getting Started',
    description: 'Learn the basics of tokenization and investment',
    icon: QuestionMarkCircleIcon,
    articleCount: 12,
    color: 'bg-blue-500'
  },
  {
    name: 'Trading & Investments',
    description: 'How to trade tokens and manage your portfolio',
    icon: CurrencyDollarIcon,
    articleCount: 18,
    color: 'bg-green-500'
  },
  {
    name: 'Account & Security',
    description: 'Manage your account settings and security',
    icon: ShieldCheckIcon,
    articleCount: 15,
    color: 'bg-purple-500'
  },
  {
    name: 'Technical Support',
    description: 'Troubleshoot technical issues and bugs',
    icon: CogIcon,
    articleCount: 23,
    color: 'bg-orange-500'
  }
];

const popularArticles = [
  'How to create your first investment',
  'Understanding token trading',
  'Setting up two-factor authentication',
  'Compliance requirements for investors',
  'Troubleshooting login issues'
];

const KnowledgeBase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="mt-4 text-lg text-gray-600">
            Find answers to your questions about tokenization, trading, and investments
          </p>
          
          {/* Search */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search knowledge base..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/knowledge-base/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${category.color} text-white mb-4`}>
                  <category.icon className="h-6 w-6" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                
                <p className="mt-2 text-sm text-gray-600">
                  {category.description}
                </p>
                
                <div className="mt-4 text-sm text-blue-600 font-medium">
                  {category.articleCount} articles
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Popular Articles</h2>
          <div className="space-y-3">
            {popularArticles.map((article, index) => (
              <Link
                key={index}
                to={`/knowledge-base/article/${article.toLowerCase().replace(/\s+/g, '-')}`}
                className="group flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookOpenIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 group-hover:text-blue-700 font-medium">
                  {article}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;