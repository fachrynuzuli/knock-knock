import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useGameContext } from '../contexts/GameContext';
import { addActivity, ActivityCategory, ProjectMilestone } from '../store/slices/activitiesSlice';
import { CheckCircle2, XCircle, Clipboard, BarChart4 } from 'lucide-react';

interface ActivityFormProps {
  onClose: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { playerName } = useGameContext();
  const { currentWeek } = useSelector((state: RootState) => state.gameState);
  
  const [activities, setActivities] = useState<{
    text: string;
    category: ActivityCategory;
    projectMilestone?: ProjectMilestone;
    priority: number;
  }[]>([
    { text: '', category: 'project', projectMilestone: 'preparation', priority: 1 }
  ]);
  
  const [error, setError] = useState('');
  
  const handleAddActivity = () => {
    setActivities([...activities, { 
      text: '', 
      category: 'project', 
      projectMilestone: 'preparation', 
      priority: activities.length + 1 
    }]);
  };
  
  const handleRemoveActivity = (index: number) => {
    const newActivities = [...activities];
    newActivities.splice(index, 1);
    // Reorder priorities
    const reorderedActivities = newActivities.map((activity, idx) => ({
      ...activity,
      priority: idx + 1
    }));
    setActivities(reorderedActivities);
  };
  
  const handleTextChange = (index: number, text: string) => {
    const newActivities = [...activities];
    newActivities[index].text = text;
    setActivities(newActivities);
  };
  
  const handleCategoryChange = (index: number, category: ActivityCategory) => {
    const newActivities = [...activities];
    newActivities[index].category = category;
    if (category !== 'project') {
      delete newActivities[index].projectMilestone;
    } else {
      newActivities[index].projectMilestone = 'preparation';
    }
    setActivities(newActivities);
  };
  
  const handleMilestoneChange = (index: number, milestone: ProjectMilestone) => {
    const newActivities = [...activities];
    newActivities[index].projectMilestone = milestone;
    setActivities(newActivities);
  };
  
  const handlePriorityChange = (index: number, newIndex: number) => {
    if (newIndex < 0 || newIndex >= activities.length) return;
    
    const newActivities = [...activities];
    const temp = { ...newActivities[index] };
    newActivities[index] = { ...newActivities[newIndex] };
    newActivities[newIndex] = temp;
    
    // Update priorities
    const reorderedActivities = newActivities.map((activity, idx) => ({
      ...activity,
      priority: idx + 1
    }));
    
    setActivities(reorderedActivities);
  };
  
  const handleSubmit = () => {
    // Validate all activities have text
    const emptyActivities = activities.some(activity => !activity.text.trim());
    if (emptyActivities) {
      setError('All activities must have a description.');
      return;
    }
    
    // Submit all activities
    activities.forEach(activity => {
      dispatch(addActivity({
        text: activity.text,
        category: activity.category,
        projectMilestone: activity.projectMilestone,
        priority: activity.priority,
        week: currentWeek,
        createdBy: playerName
      }));
    });
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-primary-700">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-primary-900">
          <h2 className="text-xl font-heading text-white flex items-center">
            <Clipboard className="mr-2 text-primary-400" size={20} />
            What did you get done this week?
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-white font-pixel">
                <span className="text-primary-400">{playerName}</span>'s activities for <span className="text-secondary-400">{currentWeek}</span>
              </div>
              <div className="text-white text-sm font-pixel flex items-center">
                <BarChart4 className="text-primary-400 mr-1" size={16} />
                <span>Priority matters! Drag to reorder</span>
              </div>
            </div>
            
            {error && (
              <div className="bg-error-600 bg-opacity-30 border border-error-700 text-white px-4 py-2 rounded-md mb-4 font-pixel text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg border-l-4 border-primary-600">
                  <div className="flex items-start gap-4">
                    {/* Priority indicator */}
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <button 
                        onClick={() => handlePriorityChange(index, index - 1)}
                        disabled={index === 0}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          index === 0 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-600'
                        }`}
                      >
                        ▲
                      </button>
                      <button 
                        onClick={() => handlePriorityChange(index, index + 1)}
                        disabled={index === activities.length - 1}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          index === activities.length - 1 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-600'
                        }`}
                      >
                        ▼
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      {/* Activity text */}
                      <div className="mb-3">
                        <label className="block text-white font-pixel mb-1 text-sm">
                          Activity Description:
                        </label>
                        <textarea
                          value={activity.text}
                          onChange={(e) => handleTextChange(index, e.target.value)}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white font-pixel focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Describe what you accomplished..."
                          rows={2}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Category */}
                        <div>
                          <label className="block text-white font-pixel mb-1 text-sm">
                            Category:
                          </label>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => handleCategoryChange(index, 'project')}
                              className={`px-3 py-1 rounded-md text-white text-sm font-pixel ${
                                activity.category === 'project' 
                                  ? 'bg-success-600 border-2 border-white' 
                                  : 'bg-gray-600 hover:bg-success-700'
                              }`}
                            >
                              Project
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCategoryChange(index, 'adhoc')}
                              className={`px-3 py-1 rounded-md text-white text-sm font-pixel ${
                                activity.category === 'adhoc' 
                                  ? 'bg-warning-600 border-2 border-white' 
                                  : 'bg-gray-600 hover:bg-warning-700'
                              }`}
                            >
                              Ad Hoc
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCategoryChange(index, 'routine')}
                              className={`px-3 py-1 rounded-md text-white text-sm font-pixel ${
                                activity.category === 'routine' 
                                  ? 'bg-primary-600 border-2 border-white' 
                                  : 'bg-gray-600 hover:bg-primary-700'
                              }`}
                            >
                              Routine
                            </button>
                          </div>
                        </div>
                        
                        {/* Project Milestone (only if category is project) */}
                        {activity.category === 'project' && (
                          <div>
                            <label className="block text-white font-pixel mb-1 text-sm">
                              Project Milestone:
                            </label>
                            <select
                              value={activity.projectMilestone}
                              onChange={(e) => handleMilestoneChange(index, e.target.value as ProjectMilestone)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white font-pixel focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="pre-project">Pre-Project</option>
                              <option value="preparation">Preparation</option>
                              <option value="initiation">Initiation</option>
                              <option value="realization">Realization</option>
                              <option value="finished">Finished</option>
                              <option value="go-live">Go-Live</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(index)}
                      disabled={activities.length === 1}
                      className={`text-gray-400 hover:text-white ${activities.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleAddActivity}
              className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-md font-pixel shadow-pixel button-pixel flex items-center"
            >
              <span className="mr-1">+</span> Add Activity
            </button>
            
            <div className="space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-pixel shadow-pixel button-pixel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-pixel shadow-pixel button-pixel flex items-center"
              >
                <CheckCircle2 size={18} className="mr-1" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityForm;