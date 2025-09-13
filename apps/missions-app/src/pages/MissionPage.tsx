import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMissionStore } from '../store/mission.store';
import { MissionFormData, MissionStatus } from '../types/mission.types';

interface MissionPageProps {
  editMode?: boolean;
}

export function MissionPage({ editMode = false }: MissionPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    missions, 
    categories, 
    createMission, 
    editMission, 
    isLoading 
  } = useMissionStore();

  // Form data state (like in the video)
  const [formData, setFormData] = useState<MissionFormData>({
    title: '',
    description: '',
    category: '',
    owner: '',
    avatar: '',
    priority: 1,
    status: 'not_started',
    progress: 0,
    timestamp: new Date().toISOString()
  });

  // Initialize form data for edit mode
  useEffect(() => {
    if (editMode && id) {
      const mission = missions.find(m => m.id === id);
      if (mission) {
        setFormData({
          title: mission.title,
          description: mission.description,
          category: mission.category,
          owner: mission.owner,
          avatar: mission.avatar,
          priority: mission.priority,
          status: mission.status,
          progress: mission.progress,
          timestamp: mission.timestamp
        });
      }
    }
  }, [editMode, id, missions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' || name === 'progress' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editMode && id) {
        await editMission(id, formData);
      } else {
        await createMission(formData);
      }
      
      // Navigate back to missions dashboard on success
      navigate('/missions');
    } catch (error) {
      console.error('Failed to save mission:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-8">
        {/* Back navigation */}
        <button 
          onClick={() => navigate('/missions')}
          className="inline-flex items-center text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to missions
        </button>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {editMode ? 'Update Mission' : 'Create a Mission'}
          </h1>
        </div>

        {/* Form container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="flex gap-8">
              {/* Left section - main fields */}
              <div className="flex-1 space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category selection */}
                <div>
                  <label htmlFor="category-select" className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    id="category-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* New category */}
                <div>
                  <label htmlFor="new-category" className="block text-sm font-medium text-gray-300 mb-2">
                    New Category
                  </label>
                  <input
                    id="new-category"
                    name="category"
                    type="text"
                    placeholder="Or create a new category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority
                  </label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((priority) => (
                      <label key={priority} className="flex items-center">
                        <input
                          type="radio"
                          name="priority"
                          value={priority}
                          checked={formData.priority === priority}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                          formData.priority === priority 
                            ? 'border-blue-500 bg-blue-500 text-white' 
                            : 'border-gray-600 text-gray-400 hover:border-gray-500'
                        }`}>
                          {priority}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status and Progress - only in edit mode */}
                {editMode && (
                  <>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="working_on_it">Working on it</option>
                        <option value="stuck">Stuck</option>
                        <option value="done">Done</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="progress" className="block text-sm font-medium text-gray-300 mb-2">
                        Progress: {formData.progress}%
                      </label>
                      <input
                        id="progress"
                        name="progress"
                        type="range"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={handleChange}
                        className="w-full accent-blue-500"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Right section - owner and avatar */}
              <div className="w-80 space-y-6">
                {/* Owner */}
                <div>
                  <label htmlFor="owner" className="block text-sm font-medium text-gray-300 mb-2">
                    Owner
                  </label>
                  <input
                    id="owner"
                    name="owner"
                    type="text"
                    required
                    value={formData.owner}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Avatar */}
                <div>
                  <label htmlFor="avatar" className="block text-sm font-medium text-gray-300 mb-2">
                    Avatar URL
                  </label>
                  <input
                    id="avatar"
                    name="avatar"
                    type="url"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  {/* Image preview */}
                  {formData.avatar && (
                    <div className="mt-4">
                      <img
                        src={formData.avatar}
                        alt="Avatar preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  {isLoading ? 'Saving...' : (editMode ? 'Update Mission' : 'Create Mission')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}