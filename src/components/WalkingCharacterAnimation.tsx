import React, { useState, useEffect } from 'react';
import { ANIMATION_CONFIG } from '../config/gameConfig';

interface WalkingCharacterAnimationProps {
  spritePath: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  directionRowIndex: number;
  rowCount: number; // Added rowCount prop for better sprite sheet compatibility
  className?: string;
  style?: React.CSSProperties;
  scale?: number;
}

const WalkingCharacterAnimation: React.FC<WalkingCharacterAnimationProps> = ({
  spritePath,
  frameWidth,
  frameHeight,
  frameCount,
  directionRowIndex,
  rowCount, // Now using the rowCount prop
  className = '',
  style = {},
  scale = 3,
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % frameCount);
    }, ANIMATION_CONFIG.CHARACTER_FRAME_INTERVAL);

    return () => clearInterval(interval);
  }, [frameCount]);

  // Calculate background position for current frame
  const x = currentFrame * frameWidth;
  const y = directionRowIndex * frameHeight;

  // Calculate scaled dimensions using the provided rowCount
  const scaledWidth = frameWidth * scale;
  const scaledHeight = frameHeight * scale;
  const totalSpriteWidth = frameWidth * frameCount * scale;
  const totalSpriteHeight = frameHeight * rowCount * scale; // Now uses rowCount prop

  return (
    <div
      className={`${className}`}
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        backgroundImage: `url(${spritePath})`,
        backgroundPosition: `-${x * scale}px -${y * scale}px`,
        backgroundSize: `${totalSpriteWidth}px ${totalSpriteHeight}px`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        backgroundColor: 'transparent',
        ...style,
      }}
    />
  );
};

export default WalkingCharacterAnimation;