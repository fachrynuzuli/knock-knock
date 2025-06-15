import React from 'react';
import { Teammate } from '../store/slices/teammatesSlice';
import { Home, Crown, Star, Zap } from 'lucide-react';

interface HouseProps {
  teammate: Teammate;
  isNearby?: boolean;
}

const House: React.FC<HouseProps> = ({ teammate, isNearby = false }) => {
  // House level styling based on progression
  const getHouseLevelStyles = (level: number) => {
    switch (level) {
      case 1:
        return {
          container: 'bg-amber-700 border-amber-900',
          roof: 'bg-red-700 border-red-900',
          door: 'bg-amber-900',
          window: 'bg-yellow-300',
          size: 'w-16 h-16',
          roofHeight: 'h-3'
        };
      case 2:
        return {
          container: 'bg-amber-600 border-amber-800',
          roof: 'bg-red-600 border-red-800',
          door: 'bg-amber-800',
          window: 'bg-yellow-200',
          size: 'w-20 h-20',
          roofHeight: 'h-4'
        };
      case 3:
        return {
          container: 'bg-amber-500 border-amber-700',
          roof: 'bg-red-500 border-red-700',
          door: 'bg-amber-700',
          window: 'bg-yellow-100',
          size: 'w-24 h-24',
          roofHeight: 'h-5'
        };
      default:
        return {
          container: 'bg-amber-700 border-amber-900',
          roof: 'bg-red-700 border-red-900',
          door: 'bg-amber-900',
          window: 'bg-yellow-300',
          size: 'w-16 h-16',
          roofHeight: 'h-3'
        };
    }
  };

  // House type styling for variety
  const getHouseTypeStyles = (type: number) => {
    const types = [
      { accent: 'border-blue-500', special: 'bg-blue-100' },
      { accent: 'border-green-500', special: 'bg-green-100' },
      { accent: 'border-purple-500', special: 'bg-purple-100' },
      { accent: 'border-pink-500', special: 'bg-pink-100' },
      { accent: 'border-orange-500', special: 'bg-orange-100' },
    ];
    return types[type % types.length];
  };

  const levelStyles = getHouseLevelStyles(teammate.houseLevel);
  const typeStyles = getHouseTypeStyles(teammate.houseType);
  
  // Activity indicator - shows if player has recent activities
  const hasRecentActivity = teammate.stats.totalActivities > 0;
  
  // Special effects for player's own house
  const isPlayerHouse = teammate.isPlayer;

  return (
    <div className="relative">
      {/* House Structure */}
      <div className={`relative ${levelStyles.size} transition-all duration-300 ${isNearby ? 'scale-110' : ''}`}>
        {/* Roof */}
        <div 
          className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-full ${levelStyles.roofHeight} ${levelStyles.roof} border-2 rounded-t-lg`}
          style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            width: '110%',
          }}
        />
        
        {/* Main House Body */}
        <div className={`w-full h-full ${levelStyles.container} border-2 ${typeStyles.accent} rounded-lg relative overflow-hidden`}>
          {/* Windows */}
          <div className="absolute top-1 left-1 right-1 flex justify-between">
            <div className={`w-2 h-2 ${levelStyles.window} border border-gray-600 rounded-sm`} />
            <div className={`w-2 h-2 ${levelStyles.window} border border-gray-600 rounded-sm`} />
          </div>
          
          {/* Door */}
          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-4 ${levelStyles.door} border border-gray-800 rounded-t-md`} />
          
          {/* Door Handle */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-1 w-0.5 h-0.5 bg-yellow-400 rounded-full" />
          
          {/* Activity Indicator - Chimney Smoke */}
          {hasRecentActivity && (
            <div className="absolute -top-1 right-2">
              <div className="animate-pulse">
                <div className="w-1 h-2 bg-gray-800 rounded-sm" />
                <div className="w-2 h-1 bg-gray-600 opacity-70 animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1.5 h-1 bg-gray-500 opacity-50 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}
          
          {/* Special Player House Glow */}
          {isPlayerHouse && (
            <div className="absolute inset-0 bg-blue-400 opacity-20 rounded-lg animate-pulse" />
          )}
          
          {/* House Level Indicator */}
          {teammate.houseLevel > 1 && (
            <div className="absolute -top-1 -right-1 bg-warning-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
              {teammate.houseLevel === 2 ? <Star size={8} /> : <Crown size={8} />}
            </div>
          )}
        </div>
        
        {/* Activity Board Post */}
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-amber-800 border border-amber-900" />
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-3 h-4 bg-amber-100 border border-amber-600 rounded-sm flex items-center justify-center">
          <div className="w-2 h-2 bg-amber-200 rounded-sm" />
        </div>
      </div>
      
      {/* Name Label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <div className={`px-2 py-1 rounded-md text-xs font-pixel text-center transition-all ${
          isPlayerHouse 
            ? 'bg-blue-600 text-white border border-blue-400' 
            : 'bg-gray-800 text-white border border-gray-600'
        }`}>
          {teammate.name}
          {isPlayerHouse && <span className="ml-1">👑</span>}
        </div>
      </div>
    </div>
  );
};

export default House;