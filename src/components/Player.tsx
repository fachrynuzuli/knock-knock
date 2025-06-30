import React, { useState, useEffect } from 'react';
import { getAvatarStage } from '../data/avatars';
import { ANIMATION_CONFIG, FALLBACK_CONFIG } from '../config/gameConfig';

interface PlayerProps {
  position: {
    x: number;
    y: number;
  };
  playerData: {
    name: string;
    avatarId: number;
    avatarLevel: number;
  };
  isMoving: boolean;
  direction: 'up' | 'down' | 'left' | 'right';
}

const Player: React.FC<PlayerProps> = ({ 
  position, 
  playerData,
  isMoving, 
  direction
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [idleDirection, setIdleDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  
  // Get sprite configuration from centralized data with robust fallback
  const spriteConfig = getAvatarStage(playerData.avatarId, playerData.avatarLevel);
  
  // Debug logging for avatar rendering
  console.log('Player component rendering with:', { 
    avatarId: playerData.avatarId, 
    avatarLevel: playerData.avatarLevel, 
    name: playerData.name, 
    spriteConfig 
  });
  
  // Robust fallback handling - use default sprite if config is missing
  const finalSpriteConfig = spriteConfig || FALLBACK_CONFIG.DEFAULT_SPRITE;
  
  // Additional validation for direction map
  if (!finalSpriteConfig.directionMap) {
    console.error(`CRITICAL: No directionMap found for avatarId: ${playerData.avatarId}, level: ${playerData.avatarLevel}. Using fallback.`);
    finalSpriteConfig.directionMap = FALLBACK_CONFIG.DEFAULT_SPRITE.directionMap;
  }
  
  // Animation frame handling with centralized timing
  useEffect(() => {
    let animationFrame: number;
    let lastTimestamp = 0;
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      
      const elapsed = timestamp - lastTimestamp;
      
      if (elapsed > ANIMATION_CONFIG.CHARACTER_FRAME_INTERVAL) {
        if (isMoving) {
          setCurrentFrame(prev => (prev + 1) % finalSpriteConfig.frameCount);
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
  }, [isMoving, direction, finalSpriteConfig.frameCount]);

  // Get the row index based on direction using the avatar's specific direction mapping
  const getDirectionRow = () => {
    const directionToUse = isMoving ? direction : idleDirection;
    
    // Use the avatar's specific direction mapping with fallback
    const rowIndex = finalSpriteConfig.directionMap[directionToUse];
    
    // Validate that the row index is valid
    if (rowIndex === undefined || rowIndex < 0 || rowIndex >= finalSpriteConfig.rowCount) {
      console.error(`Invalid direction mapping for ${directionToUse}: ${rowIndex}. Using fallback row 0.`);
      return 0;
    }
    
    return rowIndex;
  };

  const scaledWidth = finalSpriteConfig.frameWidth * finalSpriteConfig.scale;
  const scaledHeight = finalSpriteConfig.frameHeight * finalSpriteConfig.scale;
  
  // Calculate background position
  const x = currentFrame * finalSpriteConfig.frameWidth + finalSpriteConfig.offsetX;
  const y = getDirectionRow() * finalSpriteConfig.frameHeight + finalSpriteConfig.offsetY;
  
  // Show error fallback if original sprite config was missing
  const isUsingFallback = !spriteConfig;
  
  return (
    <div 
      className="absolute"
      style={{
        left: `${position.x - (scaledWidth / 2)}px`,
        top: `${position.y - (scaledHeight / 2)}px`,
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        zIndex: Math.floor(position.y),
      }}
      role="img"
      aria-label={`${playerData.name} character at position ${Math.round(position.x)}, ${Math.round(position.y)}`}
    >
      <div className="relative w-full h-full">
        {/* Character shadow */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black/30"
          style={{
            width: `${scaledWidth * 0.2}px`,
            height: `${5 * finalSpriteConfig.scale}px`,
            bottom: '45px',
          }}
          aria-hidden="true"
        />
        
        {/* Character sprite or fallback */}
        {isUsingFallback ? (
          // Fallback visual indicator
          <div 
            className="character absolute inset-0 bg-gray-600 border-2 border-gray-800 rounded flex items-center justify-center"
            title={FALLBACK_CONFIG.SPRITE_LOAD_ERROR}
            aria-label={FALLBACK_CONFIG.AVATAR_DATA_ERROR}
          >
            <div className="text-white text-xs font-pixel text-center">
              <div>⚠️</div>
              <div className="text-xs">Avatar</div>
              <div className="text-xs">Error</div>
            </div>
          </div>
        ) : (
          // Normal character sprite
          <div 
            className="character absolute inset-0"
            style={{
              backgroundImage: `url(${finalSpriteConfig.spritePath})`,
              backgroundPosition: `-${x * finalSpriteConfig.scale}px -${y * finalSpriteConfig.scale}px`,
              backgroundSize: `${finalSpriteConfig.frameWidth * finalSpriteConfig.frameCount * finalSpriteConfig.scale}px ${finalSpriteConfig.frameHeight * finalSpriteConfig.rowCount * finalSpriteConfig.scale}px`,
            }}
            aria-hidden="true"
          />
        )}
        
        {/* Player name */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap px-2 py-0.5 bg-gray-800/75 text-white text-xs rounded-md font-pixel"
          aria-label={`Player name: ${playerData.name}`}
        >
          {playerData.name}
        </div>
        
        {/* Screen reader only movement announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {isMoving && `${playerData.name} is moving ${direction}`}
        </div>
      </div>
    </div>
  );
};

export default Player;