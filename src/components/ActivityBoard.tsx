import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { XCircle, ClipboardList, CheckCircle2 } from 'lucide-react';
import { ActivityCategory, ProjectMilestone } from '../store/slices/activitiesSlice';

interface ActivityBoardProps {
  teammate: string;
  onClose: () => void;
}

const ActivityBoard: React.FC<ActivityBoardProps> = ({ teammate, onClose }) => {
  const activities = useSelector((state: RootState) => 
    state.activities.items.filter(activity => 
      activity.createdBy === teammate
    ).sort((a, b) => a.priority - b.priority)
  );
  
  const { currentWeek } = useSelector((state: RootState) => state.gameState);
  
  const getCategoryLabel = (category: ActivityCategory) => {
    switch (category) {
      case 'project': return { label: 'Project', className: 'bg-success-600 border-success-800' };
      case 'adhoc': return { label: 'Ad Hoc', className: 'bg-warning-600 border-warning-800' };
      case 'routine': return { label: 'Routine', className: 'bg-primary-600 border-primary-800' };
      default: return { label: 'Unknown', className: 'bg-gray-600 border-gray-800' };
    }
  };
  
  const getMilestoneLabel = (milestone: ProjectMilestone) => {
    switch (milestone) {
      case 'pre-project': return 'Pre-Project';
      case 'preparation': return 'Preparation';
      case 'initiation': return 'Initiation';
      case 'realization': return 'Realization';
      case 'finished': return 'Finished';
      case 'go-live': return 'Go-Live';
      default: return 'Unknown';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-primary-700">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-primary-900">
          <h2 className="text-xl font-heading text-white flex items-center">
            <ClipboardList className="mr-2 text-primary-400" size={20} />
            {teammate}'s Activity Board
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="bg-gray-900 p-6 rounded-lg border-2 border-gray-700 shadow-inner text-center mb-6">
              <h3 className="text-2xl font-heading text-white mb-2">What did I get done this week?</h3>
              <p className="text-gray-300 font-pixel">{currentWeek}</p>
            </div>
            
            {activities.length === 0 ? (
              <div className="text-center p-8 bg-gray-700 rounded-lg">
                <p className="text-gray-300 font-pixel">No activities logged for this week yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const category = getCategoryLabel(activity.category);
                  
                  return (
                    <div 
                      key={activity.id} 
                      className={`bg-gray-700 p-4 rounded-lg border-l-4 ${category.className}`}
                    >
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold mr-3">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <div className="text-white font-pixel mb-2">{activity.text}</div>
                          
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-white text-xs font-pixel ${category.className}`}>
                              {category.label}
                            </span>
                            
                            {activity.projectMilestone && (
                              <span className="px-2 py-0.5 bg-gray-600 rounded-md text-white text-xs font-pixel">
                                {getMilestoneLabel(activity.projectMilestone)}
                              </span>
                            )}
                            
                            <span className="px-2 py-0.5 bg-gray-600 rounded-md text-white text-xs font-pixel flex items-center">
                              <CheckCircle2 size={12} className="mr-1" />
                              Priority {activity.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-pixel shadow-pixel button-pixel"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityBoard;