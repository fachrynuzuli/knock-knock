import React from 'react';

interface PlayerProps {
  position: {
    x: number;
    y: number;
  };
  avatarId: number;
  name: string;
  isMoving: boolean;
  direction: 'up' | 'down' | 'left' | 'right';
}

const Player: React.FC<PlayerProps> = ({ position, avatarId, name, isMoving, direction }) => {
  // Fallback character image URLs - in a real implementation, these would be sprite sheets
  const characterImages = {
    1: 'https://i.imgur.com/q5TYbm3.png',
    2: 'https://i.imgur.com/tUVuHY5.png',
    3: 'https://i.imgur.com/GKDJ9W4.png',
    4: 'https://i.imgur.com/VygpJHz.png',
  };
  
  // Get character image or fallback
  const characterImage = characterImages[avatarId as keyof typeof characterImages] || characterImages[1];
  
  return (
    <div 
      className="absolute transition-all duration-200 ease-linear z-20"
      style={{
        left: `${position.x - 16}px`, // Center character
        top: `${position.y - 24}px`, // Offset for feet position
      }}
    >
      <div className="relative">
        {/* Character shadow */}
        <div className="character-shadow"></div>
        
        {/* Character sprite */}
        <div 
          className={`character ${isMoving ? 'animate-bounce-slow' : ''}`}
          style={{ width: '32px', height: '48px' }}
        >
          <img 
            src={characterImage}
            alt="Character"
            className="pixel-art w-full h-full"
            style={{
              transform: direction === 'left' ? 'scaleX(-1)' : 'none',
            }}
          />
        </div>
        
        {/* Player name */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 -top-6 whitespace-nowrap px-2 py-0.5 bg-gray-800 bg-opacity-75 text-white text-xs rounded-md font-pixel"
        >
          {name}
        </div>
      </div>
    </div>
  );
};

export default Player;