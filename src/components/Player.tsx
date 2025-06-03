import React, { useState, useEffect } from 'react';
import { spriteConfig } from '../utils/spriteConfig';

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
  const [currentFrame, setCurrentFrame] = useState(0);
  const sprite = spriteConfig[avatarId] || spriteConfig[1];
  
  // Handle animation frames
  useEffect(() => {
    let animationInterval: number | null = null;
    
    if (isMoving) {
      animationInterval = window.setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % sprite.frameCount);
      }, 150); // Adjust timing for smooth animation
    } else {
      setCurrentFrame(sprite.idleFrame);
    }
    
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [isMoving, sprite.frameCount, sprite.idleFrame]);
  
  // Calculate sprite position based on direction and current frame
  const getBackgroundPosition = () => {
    const x = currentFrame * sprite.frameWidth;
    let y = 0;
    
    switch (direction) {
      case 'down':
        y = 0;
        break;
      case 'left':
        y = sprite.frameHeight;
        break;
      case 'right':
        y = sprite.frameHeight * 2;
        break;
      case 'up':
        y = sprite.frameHeight * 3;
        break;
    }
    
    return `-${x - 1}px -${y - 1}px`;
  };
  
  return (
    <div 
      className="absolute z-20"
      style={{
        left: `${position.x - sprite.frameWidth/2}px`,
        top: `${position.y - sprite.frameHeight/2}px`,
      }}
    >
      <div className="relative">
        {/* Character shadow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/30 rounded-full"></div>
        
        {/* Character sprite */}
        <div 
          className="character"
          style={{
            width: `${sprite.frameWidth}px`,
            height: `${sprite.frameHeight}px`,
            backgroundImage: `url("${sprite.path}")`,
            backgroundPosition: getBackgroundPosition(),
          }}
        />
        
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