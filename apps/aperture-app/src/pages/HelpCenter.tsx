import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  MessageSquare,
  FileText,
  Video,
  Users,
  Settings,
  Shield,
  Zap,
  BookOpen,
  ExternalLink,
  Mail,
  Phone
} from 'lucide-react';
import { useAppTheme } from '../hooks/useAppTheme';

export function HelpCenter() {
  const navigate = useNavigate();
  const { classes } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Getting Started',
      description: 'Learn the basics of Missions and set up your first board',
      articles: [
        'Creating your first board',
        'Understanding mission structure',
        'Inviting team members',
        'Setting up notifications'
      ]
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: 'Board Management',
      description: 'Advanced features for organizing and managing your boards',
      articles: [
        'Custom board templates',
        'Advanced filtering and sorting',
        'Automation rules',
        'Board permissions and access'
      ]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Team Collaboration',
      description: 'Work effectively with your team members',
      articles: [
        'Real-time collaboration',
        'Comments and mentions',
        'File sharing and attachments',
        'Team communication best practices'
      ]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Security & Privacy',
      description: 'Keep your data safe and secure',
      articles: [
        'Account security settings',
        'Data privacy policies',
        'Two-factor authentication',
        'Enterprise security features'
      ]
    }
  ];

  const quickActions = [
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: 'Contact Support',
      description: 'Get help from our support team',
      action: () => window.open('mailto:support@missions.app', '_blank')
    },
    {
      icon: <Video className="h-5 w-5" />,
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      action: () => window.open('https://youtube.com', '_blank')
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: 'Documentation',
      description: 'Browse our complete documentation',
      action: () => window.open('https://docs.missions.app', '_blank')
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Community Forum',
      description: 'Connect with other users',
      action: () => window.open('https://community.missions.app', '_blank')
    }
  ];

  const popularArticles = [
    'How to create and manage boards',
    'Setting up team permissions',
    'Using automation features',
    'Integrating with external tools',
    'Managing notifications and alerts',
    'Customizing your workspace'
  ];

  return (
    <div className={`min-h-screen ${classes.bg.primary}`}>
      {/* Header */}
      <div className="glass-header border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/app/dashboard')}
                className={`p-2 ${classes.hover.bg} rounded-full smooth-hover`}
                aria-label="Go back"
              >
                <ArrowLeft className={`h-5 w-5 ${classes.text.muted}`} />
              </button>
              <div>
                <h1 className={`text-3xl font-light ${classes.text.primary} tracking-tight`}>Help Center</h1>
                <p className={`text-lg ${classes.text.secondary} mt-2 font-light`}>Get help and learn how to use Missions effectively</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <Search className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 ${classes.text.muted}`} />
              <input
                type="text"
                placeholder="Search for help articles, tutorials, and guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-6 py-4 ${classes.bg.secondary} rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg ${classes.text.primary} text-base font-medium border ${classes.border.default}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-16">
          {/* Quick Actions */}
          <section>
            <h2 className={`text-2xl font-light ${classes.text.primary} tracking-tight mb-8`}>Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`${classes.bg.secondary} rounded-2xl p-6 border ${classes.border.default} ${classes.hover.card} smooth-hover text-left group`}
                >
                  <div className={`p-3 ${classes.bg.tertiary} rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                    <div className={classes.text.primary}>
                      {action.icon}
                    </div>
                  </div>
                  <h3 className={`font-semibold ${classes.text.primary} mb-2`}>{action.title}</h3>
                  <p className={`text-sm ${classes.text.secondary}`}>{action.description}</p>
                  <ExternalLink className={`h-4 w-4 ${classes.text.muted} mt-3 group-hover:translate-x-1 transition-transform`} />
                </button>
              ))}
            </div>
          </section>

          {/* Help Categories */}
          <section>
            <h2 className={`text-2xl font-light ${classes.text.primary} tracking-tight mb-8`}>Browse by Category</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {helpCategories.map((category, index) => (
                <div
                  key={index}
                  className={`${classes.bg.secondary} rounded-2xl p-8 border ${classes.border.default}`}
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`p-3 ${classes.bg.tertiary} rounded-lg`}>
                      <div className={classes.text.primary}>
                        {category.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold ${classes.text.primary} mb-2`}>{category.title}</h3>
                      <p className={`${classes.text.secondary}`}>{category.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {category.articles.map((article, articleIndex) => (
                      <button
                        key={articleIndex}
                        className={`w-full text-left px-4 py-3 ${classes.hover.card} rounded-lg transition-colors group flex items-center justify-between`}
                      >
                        <span className={`${classes.text.primary} font-medium`}>{article}</span>
                        <ArrowLeft className={`h-4 w-4 ${classes.text.muted} rotate-180 group-hover:translate-x-1 transition-transform`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Popular Articles */}
          <section>
            <h2 className={`text-2xl font-light ${classes.text.primary} tracking-tight mb-8`}>Popular Articles</h2>
            <div className={`${classes.bg.secondary} rounded-2xl p-8 border ${classes.border.default}`}>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <button
                    key={index}
                    className={`w-full text-left px-4 py-4 ${classes.hover.card} rounded-lg transition-colors group flex items-center justify-between`}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className={`h-5 w-5 ${classes.text.muted}`} />
                      <span className={`${classes.text.primary} font-medium`}>{article}</span>
                    </div>
                    <ArrowLeft className={`h-4 w-4 ${classes.text.muted} rotate-180 group-hover:translate-x-1 transition-transform`} />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section>
            <div className={`${classes.bg.secondary} rounded-2xl p-8 border ${classes.border.default} text-center`}>
              <h2 className={`text-2xl font-light ${classes.text.primary} tracking-tight mb-4`}>Still Need Help?</h2>
              <p className={`${classes.text.secondary} mb-8 max-w-2xl mx-auto`}>
                Our support team is here to help. Reach out through any of these channels and we'll get back to you as soon as possible.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.open('mailto:support@missions.app', '_blank')}
                  className={`flex items-center space-x-2 ${classes.button.primary} px-6 py-3 rounded-xl smooth-hover font-medium`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Support</span>
                </button>
                <button
                  onClick={() => window.open('tel:+1-555-0123', '_blank')}
                  className={`flex items-center space-x-2 ${classes.button.secondary} px-6 py-3 rounded-xl smooth-hover font-medium`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </button>
                <button
                  onClick={() => window.open('https://chat.missions.app', '_blank')}
                  className={`flex items-center space-x-2 ${classes.button.secondary} px-6 py-3 rounded-xl smooth-hover font-medium`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Live Chat</span>
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className={`text-sm ${classes.text.muted}`}>
                  Support Hours: Monday - Friday, 9:00 AM - 6:00 PM EST
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}