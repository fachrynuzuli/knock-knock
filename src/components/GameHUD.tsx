import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Info, 
  Target, 
  Star,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronUp,
  User,
  Medal
} from 'lucide-react';
import { getPortraitPath, getAvatarSpriteFallbackInfo, getAvatarById } from '../data/avatars';
import BadgesDisplay from './BadgesDisplay';

const GameHUD: React.FC = () => {
  const { currentWeek, dayOfWeek, currentDate } = useSelector((state: RootState) => state.gameState);
  const [showControls, setShowControls] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [portraitError, setPortraitError] = useState(false);
  const [currentObjective, setCurrentObjective] = useState('');
  
  // Get player data from Redux store (single source of truth)
  const playerData = useSelector((state: RootState) => 
    state.teammates.items.find(teammate => teammate.isPlayer)
  );
  
  // Get activities for progress tracking
  const playerActivities = useSelector((state: RootState) => 
    state.activities.items.filter(activity => 
      activity.createdBy === (playerData?.name || 'Player') && activity.week === currentWeek
    )
  );
  
  // Get badges for achievement tracking
  const playerBadges = useSelector((state: RootState) => 
    state.badges.items.filter(badge => badge.earnedBy === (playerData?.name || 'Player'))
  );
  
  const getDayName = (day: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day] || 'Unknown';
  };
  
  const getProgressToNextLevel = () => {
    if (!playerData) return { current: 0, needed: 10, percentage: 0 };
    
    const current = playerData.stats.totalActivities;
    const currentLevel = playerData.houseLevel;
    const needed = currentLevel * 10; // 10 activities per level
    const percentage = Math.min((current % 10) / 10 * 100, 100);
    
    return { current: current % 10, needed: 10, percentage };
  };
  
  // Dynamic objective based on game state
  useEffect(() => {
    if (dayOfWeek === 5 && playerActivities.length === 0) {
      setCurrentObjective('Submit your weekly report by Friday!');
    } else if (playerActivities.length === 0) {
      setCurrentObjective('Start logging your weekly activities');
    } else if (playerActivities.length < 3) {
      setCurrentObjective('Add more activities to boost your score');
    } else {
      setCurrentObjective('Explore teammates\' boards for inspiration');
    }
  }, [dayOfWeek, playerActivities.length]);
  
  const handlePortraitError = () => {
    setPortraitError(true);
  };
  
  const getFallbackAvatar = () => {
    if (!playerData) return null;
    
    const fallbackInfo = getAvatarSpriteFallbackInfo(playerData.avatarId);
    if (!fallbackInfo) return null;
    
    return (
      <div 
        className="w-12 h-12 rounded-lg border-2 border-primary-400 shadow-pixel"
        style={{
          backgroundImage: `url("${fallbackInfo.spritePath}")`,
          backgroundSize: `${fallbackInfo.frameWidth * fallbackInfo.frameCount}px ${fallbackInfo.frameHeight * fallbackInfo.rowCount}px`,
          backgroundPosition: '0 0',
          imageRendering: 'pixelated',
        }}
      />
    );
  };
  
  const progress = getProgressToNextLevel();
  const avatar = playerData ? getAvatarById(playerData.avatarId) : null;
  
  // Format the current date for display
  const formatCurrentDate = () => {
    const date = new Date(currentDate);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <>
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-40">
        {/* Left side: Enhanced Player info with avatar portrait */}
        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            {/* Avatar Portrait */}
            <div className="relative">
              {!portraitError && playerData ? (
                <img
                  src={getPortraitPath(playerData.avatarId)}
                  alt={avatar?.name || 'Player Avatar'}
                  className="w-12 h-12 rounded-lg border-2 border-primary-400 shadow-pixel object-cover"
                  onError={handlePortraitError}
                  style={{ imageRendering: 'pixelated' }}
                />
              ) : (
                getFallbackAvatar() || (
                  <div className="w-12 h-12 rounded-lg border-2 border-primary-400 bg-gray-600 flex items-center justify-center">
                    <User className="text-white" size={24} />
                  </div>
                )
              )}
              
              {/* Level indicator */}
              <div className="absolute -bottom-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white">
                {playerData?.houseLevel || 1}
              </div>
            </div>
            
            {/* Player Info */}
            <div className="text-white font-pixel">
              <div className="text-primary-400 font-heading text-sm">{playerData?.name || 'Player'}</div>
              <div className="text-xs mt-1 flex items-center space-x-2">
                <span className="bg-success-600 px-2 py-0.5 rounded text-xs">Team lead</span>
                <span className="text-gray-300">House Lv.{playerData?.houseLevel || 1}</span>
              </div>
              
              {/* EXP display instead of progress bar */}
              <div className="mt-2 w-32">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>EXP</span>
                  <span>{playerData?.stats.totalActivities || 0}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Next level: {10 - progress.current} EXP
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Center: Enhanced Date/Time with actual date */}
        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Calendar className="text-primary-400 w-6 h-6" />
              {/* Day indicator dots for weekdays only */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                {[1, 2, 3, 4, 5].map((day) => (
                  <div
                    key={day}
                    className={`w-1 h-1 rounded-full ${
                      dayOfWeek >= day ? 'bg-primary-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-white font-pixel">
              <div className="text-md font-bold">{currentWeek}</div>
              <div className="text-xs flex items-center mt-1">
                <Clock className="text-primary-400 w-3 h-3 mr-1" />
                <span>{getDayName(dayOfWeek)}</span>
                {dayOfWeek === 5 && (
                  <span className="ml-2 bg-warning-600 px-1 py-0.5 rounded text-xs animate-pulse">
                    Report Due!
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {formatCurrentDate()}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side: Enhanced Controls & Stats */}
        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm">
          {/* Current Objective */}
          <div className="mb-3 p-2 bg-primary-900 bg-opacity-50 rounded border border-primary-700">
            <div className="flex items-center text-primary-400 text-xs font-pixel mb-1">
              <Target className="w-3 h-3 mr-1" />
              <span>Current Objective</span>
            </div>
            <div className="text-white text-xs font-pixel">{currentObjective}</div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <div className="text-primary-400 text-xs font-pixel">Activities</div>
              <div className="text-white font-bold">{playerActivities.length}</div>
            </div>
            <div className="text-center">
              <button
                onClick={() => setShowBadges(true)}
                className="text-center hover:bg-gray-700 rounded p-1 transition-colors"
              >
                <div className="text-secondary-400 text-xs font-pixel flex items-center justify-center">
                  <Medal className="w-3 h-3 mr-1" />
                  Badges
                </div>
                <div className="text-white font-bold">{playerBadges.length}</div>
              </button>
            </div>
            <div className="text-center">
              <div className="text-warning-400 text-xs font-pixel">Level</div>
              <div className="text-white font-bold">{playerData?.houseLevel || 1}</div>
            </div>
          </div>
          
          {/* Controls Toggle */}
          <div className="border-t border-gray-700 pt-3">
            <button
              onClick={() => setShowControls(!showControls)}
              className="flex items-center justify-between w-full text-white font-pixel text-sm hover:text-primary-400 transition-colors"
            >
              <div className="flex items-center">
                <Info className="w-4 h-4 mr-1" />
                <span>Controls</span>
              </div>
              {showControls ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {/* Collapsible Controls */}
            {showControls && (
              <div className="mt-2 text-xs grid grid-cols-2 gap-x-3 gap-y-1 text-gray-300 font-pixel">
                <span><kbd className="bg-gray-700 px-1 rounded">WASD</kbd> Move</span>
                <span><kbd className="bg-gray-700 px-1 rounded">E</kbd> Interact</span>
                <span><kbd className="bg-gray-700 px-1 rounded">L</kbd> Leaderboard</span>
                <span><kbd className="bg-gray-700 px-1 rounded">ESC</kbd> Close</span>
                <span><kbd className="bg-gray-700 px-1 rounded">↑↓←→</kbd> Pan</span>
                <span><kbd className="bg-gray-700 px-1 rounded">+/-</kbd> Zoom</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badges Display Modal */}
      {showBadges && (
        <BadgesDisplay onClose={() => setShowBadges(false)} />
      )}
    </>
  );
};

export default GameHUD;