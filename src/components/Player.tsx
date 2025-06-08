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

// Helper function to get avatar color for circle display
const getAvatarColor = (id: number) => {
  switch (id) {
    case 3: return 'bg-green-500';
    case 4: return 'bg-red-500';
    case 5: return 'bg-yellow-500';
    case 6: return 'bg-purple-500';
    case 7: return 'bg-orange-500';
    default: return 'bg-gray-500';
  }
};

const Player: React.FC<PlayerProps> = ({ position, avatarId, name, isMoving, direction }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [idleDirection, setIdleDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  
  // For now, we'll display circles instead of sprites
  const avatarColor = getAvatarColor(avatarId);
  
  // Animation frame handling (simplified for circles)
  useEffect(() => {
    let animationFrame: number;
    let lastTimestamp = 0;
    const frameInterval = 100; // Milliseconds between frames
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      
      const elapsed = timestamp - lastTimestamp;
      
      if (elapsed > frameInterval) {
        if (isMoving) {
          setCurrentFrame(prev => (prev + 1) % 6);
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
  }, [isMoving, direction]);

  const scaledWidth = 64;
  const scaledHeight = 64;
  
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
            width: `${scaledWidth * 0.3}px`,
            height: `8px`,
            bottom: '8px',
          }}
        />
        
        {/* Character circle */}
        <div 
          className={`absolute inset-0 rounded-full ${avatarColor} flex items-center justify-center border-4 border-white ${
            isMoving ? 'animate-pulse' : ''
          }`}
          style={{
            width: '48px',
            height: '48px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="text-white text-lg font-bold">{avatarId}</span>
        </div>
        
        {/* Player name */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap px-2 py-0.5 bg-gray-800/75 text-white text-xs rounded-md font-pixel">
          {name}
        </div>
      </div>
    </div>
  );
};

export default Player;