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
    <div className="game-hud flex justify-between items-start mobile-stack mobile-text-center">
      {/* Left side: Player info */}
      <div className="hud-panel mobile-full-width">
        <div className="text-white font-pixel">
          <span className="text-primary-400 font-heading text-responsive-md">{playerName}</span>
          <div className="text-responsive-sm mt-1 flex items-center mobile-justify-center">
            <span className="bg-success-600 px-2 py-0.5 rounded mr-2 text-responsive-sm">Manager</span>
            <span className="text-responsive-sm">Level 1</span>
          </div>
        </div>
      </div>
      
      {/* Center: Date/Time */}
      <div className="hud-panel flex items-center mobile-full-width mobile-justify-center">
        <Calendar className="text-primary-400 w-4 h-4 md:w-5 md:h-5 mr-2" />
        <div className="text-white font-pixel">
          <div className="text-responsive-md font-bold">{currentWeek}</div>
          <div className="text-responsive-sm flex items-center mt-1 mobile-justify-center">
            <Clock className="text-primary-400 w-3 h-3 mr-1" />
            <span>{getDayName(dayOfWeek)}</span>
          </div>
        </div>
      </div>
      
      {/* Right side: Controls & Legend */}
      <div className="hud-panel mobile-full-width mobile-hidden">
        <div className="text-white font-pixel">
          <div className="text-responsive-md font-bold flex items-center">
            <Trophy className="text-primary-400 w-4 h-4 mr-1" />
            <span>Controls</span>
          </div>
          <div className="text-responsive-sm mt-1 responsive-grid-2 gap-x-3 gap-y-1">
            <span><kbd className="bg-gray-700 px-1 text-xs">WASD</kbd> Move</span>
            <span><kbd className="bg-gray-700 px-1 text-xs">E</kbd> Interact</span>
            <span><kbd className="bg-gray-700 px-1 text-xs">L</kbd> Leaderboard</span>
            <span><kbd className="bg-gray-700 px-1 text-xs">ESC</kbd> Close</span>
            <span className="mobile-hidden"><kbd className="bg-gray-700 px-1 text-xs">↑↓←→</kbd> Pan</span>
            <span className="mobile-hidden"><kbd className="bg-gray-700 px-1 text-xs">+/-</kbd> Zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;