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
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 6,
    rowCount: 4,
    scale: 3,
    offsetX: 0,
    offsetY: 0,
  },
  3: {
    path: '/orc1_walk_full.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 6,
    rowCount: 4,
    scale: 2,
    offsetX: 0,
    offsetY: 0,
  },
  4: {
    path: '/Vampires1_Walk_full.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 6,
    rowCount: 4,
    scale: 2,
    offsetX: 0,
    offsetY: 0,
  },
  5: {
    path: '/orc2_walk_full.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 6,
    rowCount: 4,
    scale: 2,
    offsetX: 0,
    offsetY: 0,
  },
  6: {
    path: '/Vampires2_Walk_full.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 6,
    rowCount: 4,
    scale: 2,
    offsetX: 0,
    offsetY: 0,
  },
  7: {
    path: '/orc3_walk_full.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 6,
    rowCount: 4,
    scale: 2,
    offsetX: 0,
    offsetY: 0,
  }
};

const Player: React.FC<PlayerProps> = ({ position, avatarId, name, isMoving, direction }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [idleDirection, setIdleDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const sprite = spriteConfig[avatarId as keyof typeof spriteConfig] || spriteConfig[1];
  
  // Animation frame handling
  useEffect(() => {
    let animationFrame: number;
    let lastTimestamp = 0;
    const frameInterval = 100; // Milliseconds between frames
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      
      const elapsed = timestamp - lastTimestamp;
      
      if (elapsed > frameInterval) {
        if (isMoving) {
          setCurrentFrame(prev => (prev + 1) % sprite.frameCount);
          // Update idle direction only when moving
          setIdleDirection(direction);
        } else {
          setCurrentFrame(0); // Reset to idle frame when not moving
        }
        lastTimestamp = timestamp;
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isMoving, direction, sprite.frameCount]);

  // Get the row index based on direction
  const getDirectionRow = () => {
    const directionToUse = isMoving ? direction : idleDirection;
    
    switch (directionToUse) {
      case 'down': return 0;
      case 'left': return 1;
      case 'right': return 2;
      case 'up': return 3;
      default: return 0;
    }
  };

  const scaledWidth = sprite.frameWidth * sprite.scale;
  const scaledHeight = sprite.frameHeight * sprite.scale;
  
  // Calculate background position
  const x = currentFrame * sprite.frameWidth + sprite.offsetX;
  const y = getDirectionRow() * sprite.frameHeight + sprite.offsetY;
  
  return (
    <div 
      className="absolute transition-transform duration-75"
      style={{
        left: `${position.x - (scaledWidth / 2)}px`,
        top: `${position.y - (scaledHeight / 2)}px`,
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        zIndex: Math.floor(position.y),
      }}
    >
      <div className="relative w-full h-full">
        {/* Character shadow */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black/30"
          style={{
            width: `${scaledWidth * 0.2}px`,
            height: `${8 * sprite.scale}px`,
            bottom: '50px',
          }}
        />
        
        {/* Character sprite */}
        <div 
          className="character absolute inset-0"
          style={{
            backgroundImage: `url(${sprite.path})`,
            backgroundPosition: `-${x * sprite.scale}px -${y * sprite.scale}px`,
            backgroundSize: `${sprite.frameWidth * sprite.frameCount * sprite.scale}px ${sprite.frameHeight * sprite.rowCount * sprite.scale}px`,
          }}
        />
        
        {/* Player name */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap px-2 py-0.5 bg-gray-800/75 text-white text-xs rounded-md font-pixel">
          {name}
        </div>
      </div>
    </div>
  );
};

export default Player;