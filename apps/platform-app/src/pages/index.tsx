import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  UserCog, 
  MessageSquare, 
  Blocks, 
  BarChart3,
  ArrowRight
} from 'lucide-react';

export default function PlatformDashboard() {
  const modules = [
    {
      title: 'Dashboard',
      description: 'Business overview and key metrics',
      icon: BarChart3,
      path: '/dashboard',
      color: 'bg-blue-500'
    },
    {
      title: 'Companies',
      description: 'Portfolio company management',
      icon: Building2,
      path: '/companies',
      color: 'bg-green-500'
    },
    {
      title: 'Investors',
      description: 'Investor management and relations',
      icon: Users,
      path: '/investors',
      color: 'bg-purple-500'
    },
    {
      title: 'Trading',
      description: 'Token trading and transfers',
      icon: TrendingUp,
      path: '/trading',
      color: 'bg-orange-500'
    },
    {
      title: 'Compliance',
      description: 'Regulatory compliance management',
      icon: ShieldCheck,
      path: '/compliance',
      color: 'bg-red-500'
    },
    {
      title: 'Staff',
      description: 'Internal team management',
      icon: UserCog,
      path: '/staff',
      color: 'bg-indigo-500'
    },
    {
      title: 'Community',
      description: 'Stakeholder community hub',
      icon: MessageSquare,
      path: '/community',
      color: 'bg-pink-500'
    },
    {
      title: 'Blockchain',
      description: 'Web3 and blockchain integration',
      icon: Blocks,
      path: '/blockchain',
      color: 'bg-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cycles of Wealth Platform
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive business operations platform for tokenization and compliance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.path}
                to={module.path}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-200 border border-gray-200 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {module.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {module.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Create New Company Token
            </button>
            <button className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Onboard New Investor
            </button>
            <button className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              View Compliance Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}