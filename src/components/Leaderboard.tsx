import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { XCircle, Trophy, BarChart3, CheckSquare, ClipboardList } from 'lucide-react';

interface LeaderboardProps {
  onClose?: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onClose }) => {
  const teammates = useSelector((state: RootState) => state.teammates.items);
  
  // Sort teammates by total activities
  const sortedTeammates = [...teammates].sort((a, b) => b.stats.totalActivities - a.stats.totalActivities);
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-warning-700">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-warning-900">
          <h2 className="text-xl font-heading text-white flex items-center">
            <Trophy className="mr-2 text-warning-400\" size={20} />
            Team Leaderboard
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 grid grid-cols-1 gap-4">
            {sortedTeammates.map((teammate, index) => (
              <div 
                key={teammate.id} 
                className={`bg-gray-700 p-4 rounded-lg border-l-4 ${index === 0 ? 'border-warning-500' : index === 1 ? 'border-gray-400' : index === 2 ? 'border-amber-800' : 'border-gray-600'}`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                    index === 0 ? 'bg-warning-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-800' : 'bg-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-pixel text-lg">{teammate.name}</span>
                      <span className="text-white font-pixel flex items-center">
                        <ClipboardList className="text-warning-400 mr-1" size={16} />
                        {teammate.stats.totalActivities} activities
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div className="flex items-center justify-between bg-success-900 bg-opacity-30 p-2 rounded">
                        <span className="text-success-400 text-xs font-pixel">Projects</span>
                        <span className="text-white font-bold">{teammate.stats.projectCount}</span>
                      </div>
                      <div className="flex items-center justify-between bg-warning-900 bg-opacity-30 p-2 rounded">
                        <span className="text-warning-400 text-xs font-pixel">Ad Hoc</span>
                        <span className="text-white font-bold">{teammate.stats.adhocCount}</span>
                      </div>
                      <div className="flex items-center justify-between bg-primary-900 bg-opacity-30 p-2 rounded">
                        <span className="text-primary-400 text-xs font-pixel">Routine</span>
                        <span className="text-white font-bold">{teammate.stats.routineCount}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-600 rounded-full h-2.5 mb-1">
                        <div className="bg-gradient-to-r from-success-600 to-warning-600 h-2.5 rounded-full" 
                          style={{ width: `${(teammate.stats.totalActivities / 30) * 100}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 font-pixel">
                        <span>House Level {teammate.houseLevel}/3</span>
                        <span>{teammate.stats.totalActivities}/30 for upgrade</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-white font-heading mb-3 flex items-center">
              <BarChart3 className="text-warning-400 mr-2" size={18} />
              Activity Type Breakdown
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-success-400 font-pixel">Projects</span>
                  <span className="text-white font-bold">{teammates.reduce((sum, teammate) => sum + teammate.stats.projectCount, 0)}</span>
                </div>
                <div className="text-xs text-gray-300 font-pixel">
                  Needle-moving tasks categorized by milestone stage.
                </div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-warning-400 font-pixel">Ad Hoc</span>
                  <span className="text-white font-bold">{teammates.reduce((sum, teammate) => sum + teammate.stats.adhocCount, 0)}</span>
                </div>
                <div className="text-xs text-gray-300 font-pixel">
                  One-time tasks outside of planned projects.
                </div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-primary-400 font-pixel">Routine</span>
                  <span className="text-white font-bold">{teammates.reduce((sum, teammate) => sum + teammate.stats.routineCount, 0)}</span>
                </div>
                <div className="text-xs text-gray-300 font-pixel">
                  Recurring maintenance tasks and meetings.
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-warning-600 hover:bg-warning-700 text-white rounded-md font-pixel shadow-pixel button-pixel"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;