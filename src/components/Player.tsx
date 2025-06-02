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

const Player: React.FC<PlayerProps> = ({ position, name, isMoving, direction }) => {
  const [currentFrame, setCurrentFrame] = useState(1); // Start with idle frame
  
  // Handle animation frames
  useEffect(() => {
    let animationInterval: number | null = null;
    
    if (isMoving) {
      animationInterval = window.setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % 3);
      }, 150); // Adjust timing for smooth animation
    } else {
      setCurrentFrame(1); // Reset to idle frame when not moving
    }
    
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [isMoving]);
  
  // Calculate sprite position based on direction
  const getBackgroundPosition = () => {
    const x = currentFrame * 32; // Each frame is 32px wide
    let y = 0;
    
    switch (direction) {
      case 'down':
        y = 0;
        break;
      case 'left':
        y = 48;
        break;
      case 'right':
        y = 96;
        break;
      case 'up':
        y = 144;
        break;
    }
    
    return `-${x}px -${y}px`;
  };
  
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
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/30 rounded-full"></div>
        
        {/* Character sprite */}
        <div 
          className="character"
          style={{
            width: '32px',
            height: '48px',
            backgroundImage: 'url("/Unarmed_Walk_full.png")',
            backgroundPosition: getBackgroundPosition(),
            imageRendering: 'pixelated',
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