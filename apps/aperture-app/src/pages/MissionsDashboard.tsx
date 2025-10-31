import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { useMissionStore } from '../store/mission.store';
import { MissionCard } from '../components/missions/MissionCard';

// Color palette for categories (like in the video)
const CATEGORY_COLORS = [
  'rgb(186, 255, 201)',   // Green
  'rgb(255, 223, 186)',   // Orange  
  'rgb(186, 255, 255)',   // Cyan
  'rgb(255, 186, 255)',   // Pink
  'rgb(186, 225, 255)',   // Blue
];

export function MissionsDashboard() {
  const navigate = useNavigate();
  const { 
    missions, 
    categories,
    getMissionsByCategory, 
    getUniqueCategories,
    setCategories,
    fetchMissions,
    isLoading 
  } = useMissionStore();

  useEffect(() => {
    // Fetch missions when component mounts
    fetchMissions();
  }, [fetchMissions]);

  useEffect(() => {
    // Update categories when missions change
    if (missions.length > 0) {
      const uniqueCategories = getUniqueCategories();
      setCategories(uniqueCategories);
    }
  }, [missions, getUniqueCategories, setCategories]);

  const missionsByCategory = getMissionsByCategory();
  const uniqueCategories = Object.keys(missionsByCategory);

  const handleCreateMission = () => {
    navigate('/missions/create');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading missions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="p-8">
        <Link to="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Missions</h1>
            <p className="text-gray-400">Track and manage your mission progress</p>
          </div>
          
          <button
            onClick={handleCreateMission}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Mission
          </button>
        </div>
      </div>

      {/* Missions by Category */}
      <div className="px-8 pb-8">
        {missions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No missions yet</h3>
            <p className="text-gray-500 mb-6">Create your first mission to get started</p>
            <button
              onClick={handleCreateMission}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create Your First Mission
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {uniqueCategories.map((category, categoryIndex) => {
              const categoryMissions = missionsByCategory[category];
              const categoryColor = CATEGORY_COLORS[categoryIndex % CATEGORY_COLORS.length];

              return (
                <div key={category} className="mb-8">
                  {/* Category Header */}
                  <div className="flex items-center mb-4">
                    <div 
                      className="w-4 h-4 rounded mr-3"
                      style={{ backgroundColor: categoryColor }}
                    />
                    <h2 className="text-2xl font-bold text-white">{category}</h2>
                    <span className="ml-3 text-gray-400">({categoryMissions.length} missions)</span>
                  </div>

                  {/* Mission Cards */}
                  <div className="space-y-2">
                    {categoryMissions.map((mission) => (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        color={categoryColor}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}