import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useGameContext } from '../contexts/GameContext';
import { Trophy, Calendar, Clock } from 'lucide-react';

const GameHUD: React.FC = () => {
  const { currentWeek, dayOfWeek } = useSelector((state: RootState) => state.gameState);
  const { playerName } = useGameContext();
  
  const getDayName = (day: number) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[day - 1] || 'Friday';
  };
  
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-40">
      {/* Left side: Player info */}
      <div className="bg-gray-800 bg-opacity-80 p-3 rounded-lg shadow-lg">
        <div className="text-white font-pixel">
          <span className="text-primary-400 font-heading">{playerName}</span>
          <div className="text-xs mt-1 flex items-center">
            <span className="bg-success-600 px-2 py-0.5 rounded mr-2">Manager</span>
            <span>Level 1</span>
          </div>
        </div>
      </div>
      
      {/* Center: Date/Time */}
      <div className="bg-gray-800 bg-opacity-80 p-3 rounded-lg shadow-lg flex items-center">
        <Calendar className="text-primary-400 w-5 h-5 mr-2" />
        <div className="text-white font-pixel">
          <div className="text-md font-bold">{currentWeek}</div>
          <div className="text-xs flex items-center mt-1">
            <Clock className="text-primary-400 w-3 h-3 mr-1" />
            <span>{getDayName(dayOfWeek)}</span>
          </div>
        </div>
      </div>
      
      {/* Right side: Controls & Legend */}
      <div className="bg-gray-800 bg-opacity-80 p-3 rounded-lg shadow-lg">
        <div className="text-white font-pixel">
          <div className="text-md font-bold flex items-center">
            <Trophy className="text-primary-400 w-4 h-4 mr-1" />
            <span>Controls</span>
          </div>
          <div className="text-xs mt-1 grid grid-cols-2 gap-x-3 gap-y-1">
            <span><kbd className="bg-gray-700 px-1">WASD</kbd> Move</span>
            <span><kbd className="bg-gray-700 px-1">E</kbd> Interact</span>
            <span><kbd className="bg-gray-700 px-1">L</kbd> Leaderboard</span>
            <span><kbd className="bg-gray-700 px-1">ESC</kbd> Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;