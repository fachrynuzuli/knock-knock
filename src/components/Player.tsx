import React, { useState, useEffect } from 'react';

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

// Sprite configuration for different character types
const spriteConfig = {
  1: {
    path: '/Unarmed_Walk_full.png',
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 6,
    idleFrame: 0,
    scale: 2,
  },
  2: {
    path: '/suittie_walk_full.png',
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 4,
    idleFrame: 0,
    scale: 2,
  },
  3: {
    path: '/orc1_walk_full.png',
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 4,
    idleFrame: 0,
    scale: 2,
  },
  4: {
    path: '/Vampires1_Walk_full.png',
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 4,
    idleFrame: 0,
    scale: 2,
  },
  5: {
    path: '/orc2_walk_full.png',
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 4,
    idleFrame: 0,
    scale: 2,
  },
  6: {
    path: '/Vampires2_Walk_full.png',
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 4,
    idleFrame: 0,
    scale: 2,
  },
  7: {
    path: '/orc3_walk_full.png',
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 4,
    idleFrame: 0,
    scale: 2,
  }
};

const Player: React.FC<PlayerProps> = ({ position, avatarId, name, isMoving, direction }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const sprite = spriteConfig[avatarId as keyof typeof spriteConfig] || spriteConfig[1];
  
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
    
    return `-${x}px -${y}px`;
  };

  const scaledWidth = sprite.frameWidth * sprite.scale;
  const scaledHeight = sprite.frameHeight * sprite.scale;
  
  return (
    <div 
      className="absolute z-20"
      style={{
        left: `${position.x - (scaledWidth / 2)}px`,
        top: `${position.y - (scaledHeight / 2)}px`,
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
      }}
    >
      <div className="relative w-full h-full">
        {/* Character shadow */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-black/30"
          style={{
            width: `${scaledWidth * 0.75}px`,
            height: `${8 * sprite.scale}px`,
          }}
        />
        
        {/* Character sprite */}
        <div 
          className="character absolute inset-0"
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url("${sprite.path}")`,
            backgroundPosition: getBackgroundPosition(),
            backgroundSize: `${sprite.frameWidth * sprite.frameCount * sprite.scale}px ${sprite.frameHeight * 4 * sprite.scale}px`,
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