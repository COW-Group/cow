import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Target, 
  Award, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  BarChart3,
  Coins,
  Users,
  BookOpen,
  Trophy,
  Star,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Mission } from '@/types';

const mockMissions: Mission[] = [
  {
    id: '1',
    title: 'Portfolio Diversification Master',
    description: 'Diversify your portfolio by investing in at least 3 different asset types (real estate, commodities, stocks)',
    type: 'portfolio',
    difficulty: 'beginner',
    reward: 500,
    progress: 2,
    maxProgress: 3,
    isCompleted: false,
    deadline: '2024-12-31T23:59:59Z',
    requirements: ['Invest in real estate tokens', 'Invest in commodity tokens', 'Invest in stock tokens'],
    createdAt: '2024-09-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Diamond Hands Challenge',
    description: 'Hold your investments for at least 90 days without selling to earn long-term holder rewards',
    type: 'trading',
    difficulty: 'intermediate',
    reward: 750,
    progress: 45,
    maxProgress: 90,
    isCompleted: false,
    requirements: ['Hold investments for 90 consecutive days'],
    createdAt: '2024-08-15T00:00:00Z'
  },
  {
    id: '3',
    title: 'Research Scholar',
    description: 'Complete 5 asset research reports to understand market fundamentals better',
    type: 'research',
    difficulty: 'beginner',
    reward: 300,
    progress: 5,
    maxProgress: 5,
    isCompleted: true,
    requirements: ['Read 5 detailed asset analyses', 'Complete comprehension quizzes', 'Submit investment thesis'],
    createdAt: '2024-08-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'Community Builder',
    description: 'Refer 3 friends to the platform and help them make their first investment',
    type: 'social',
    difficulty: 'intermediate',
    reward: 1000,
    progress: 1,
    maxProgress: 3,
    isCompleted: false,
    requirements: ['Refer friends via your unique link', 'Friends must complete KYC', 'Friends must make first investment'],
    createdAt: '2024-09-10T00:00:00Z'
  },
  {
    id: '5',
    title: 'High Performance Achiever',
    description: 'Achieve a portfolio performance of +15% or higher across all your investments',
    type: 'portfolio',
    difficulty: 'advanced',
    reward: 2000,
    progress: 9.4,
    maxProgress: 15,
    isCompleted: false,
    requirements: ['Maintain +15% portfolio performance for 30 days'],
    createdAt: '2024-09-05T00:00:00Z'
  },
  {
    id: '6',
    title: 'Market Analyst',
    description: 'Accurately predict market movements for 3 consecutive weeks',
    type: 'research',
    difficulty: 'advanced',
    reward: 1500,
    progress: 1,
    maxProgress: 3,
    isCompleted: false,
    requirements: ['Submit weekly market predictions', 'Achieve 70%+ accuracy rate', 'Provide detailed analysis'],
    createdAt: '2024-09-08T00:00:00Z'
  }
];

const difficultyColors = {
  beginner: 'from-green-400 to-green-600',
  intermediate: 'from-yellow-400 to-yellow-600',
  advanced: 'from-red-400 to-red-600'
};

const typeIcons = {
  portfolio: <BarChart3 className="h-5 w-5" />,
  trading: <TrendingUp className="h-5 w-5" />,
  research: <BookOpen className="h-5 w-5" />,
  social: <Users className="h-5 w-5" />
};

const typeColors = {
  portfolio: 'text-blue-400',
  trading: 'text-green-400',
  research: 'text-purple-400',
  social: 'text-pink-400'
};

export default function MissionsPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredMissions = mockMissions.filter(mission => {
    if (selectedFilter === 'active' && mission.isCompleted) return false;
    if (selectedFilter === 'completed' && !mission.isCompleted) return false;
    if (selectedType !== 'all' && mission.type !== selectedType) return false;
    return true;
  });

  const completedMissions = mockMissions.filter(m => m.isCompleted);
  const totalRewardsEarned = completedMissions.reduce((sum, m) => sum + m.reward, 0);
  const activeMissions = mockMissions.filter(m => !m.isCompleted);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass-dark rounded-full px-6 py-3 flex items-center gap-6 border border-gray-800">
          <Link to="/" className="text-xl font-bold">
            COW Products
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/products" className="text-sm text-gray-400 hover:text-white transition-colors">
              Products
            </Link>
            <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link to="/missions" className="text-sm text-white">
              Missions
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2 page-heading">Portfolio Missions</h1>
            <p className="text-gray-400">Complete missions to earn rewards and improve your investment skills</p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="glass-dark border-gray-800">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Missions Completed</h3>
                <p className="text-3xl font-bold text-yellow-400">{completedMissions.length}</p>
              </CardContent>
            </Card>
            
            <Card className="glass-dark border-gray-800">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Active Missions</h3>
                <p className="text-3xl font-bold text-blue-400">{activeMissions.length}</p>
              </CardContent>
            </Card>
            
            <Card className="glass-dark border-gray-800">
              <CardContent className="p-6 text-center">
                <Coins className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Rewards Earned</h3>
                <p className="text-3xl font-bold text-green-400">{totalRewardsEarned}</p>
              </CardContent>
            </Card>
            
            <Card className="glass-dark border-gray-800">
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Level</h3>
                <p className="text-3xl font-bold text-purple-400">7</p>
                <p className="text-sm text-gray-400 mt-1">Investment Pro</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex gap-2">
              {['all', 'active', 'completed'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter as any)}
                  className={`capitalize ${
                    selectedFilter === filter 
                      ? 'bg-blue-600 text-white' 
                      : 'border-gray-600 text-gray-400 hover:text-white'
                  }`}
                >
                  {filter}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              {['all', 'portfolio', 'trading', 'research', 'social'].map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className={`capitalize ${
                    selectedType === type 
                      ? 'bg-purple-600 text-white' 
                      : 'border-gray-600 text-gray-400 hover:text-white'
                  }`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Missions Grid */}
          <div className="grid gap-6">
            {filteredMissions.map((mission, index) => (
              <div key={mission.id}>
                <Card className={`glass-dark border-gray-800 ${mission.isCompleted ? 'bg-green-900/10' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${difficultyColors[mission.difficulty]}`}>
                          <div className={typeColors[mission.type]}>
                            {typeIcons[mission.type]}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{mission.title}</CardTitle>
                            {mission.isCompleted && <CheckCircle className="h-5 w-5 text-green-400" />}
                            <span className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${difficultyColors[mission.difficulty]} text-white`}>
                              {mission.difficulty}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full bg-gray-800 ${typeColors[mission.type]}`}>
                              {mission.type}
                            </span>
                          </div>
                          <p className="text-gray-400 mb-4">{mission.description}</p>
                          
                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-400">Progress</span>
                              <span className="text-sm text-gray-400">
                                {mission.progress}/{mission.maxProgress} {mission.type === 'trading' ? 'days' : 'completed'}
                              </span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full bg-gradient-to-r ${
                                  mission.isCompleted 
                                    ? 'from-green-400 to-green-600' 
                                    : 'from-blue-400 to-blue-600'
                                }`}
                                style={{ width: `${(mission.progress / mission.maxProgress) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Requirements */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Requirements:</h4>
                            <ul className="space-y-1">
                              {mission.requirements.map((req, i) => (
                                <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 bg-gray-600 rounded-full" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-4">
                          <Award className="h-5 w-5 text-yellow-400" />
                          <span className="text-lg font-bold text-yellow-400">{mission.reward}</span>
                        </div>
                        
                        {mission.deadline && !mission.isCompleted && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(mission.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {mission.isCompleted ? (
                          <Button disabled className="bg-green-600 text-white">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </Button>
                        ) : (
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                              // Handle mission action
                              console.log('Starting mission:', mission.id);
                            }}
                          >
                            <Target className="h-4 w-4 mr-2" />
                            Continue
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>

          {/* No missions message */}
          {filteredMissions.length === 0 && (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No missions found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more missions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}