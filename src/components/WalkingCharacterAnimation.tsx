import React, { useState, useEffect } from 'react';
import { ANIMATION_CONFIG } from '../config/gameConfig';

interface WalkingCharacterAnimationProps {
  spritePath: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  directionRowIndex: number;
  className?: string;
  style?: React.CSSProperties;
}

const WalkingCharacterAnimation: React.FC<WalkingCharacterAnimationProps> = ({
  spritePath,
  frameWidth,
  frameHeight,
  frameCount,
  directionRowIndex,
  className = '',
  style = {},
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

  return (
    <div
      className={`${className}`}
      style={{
        backgroundImage: `url(${spritePath})`,
        backgroundPosition: `-${x}px -${y}px`,
        backgroundSize: `${frameWidth * frameCount}px ${frameHeight * 4}px`, // Assuming 4 rows for directions
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        backgroundColor: 'transparent',
        ...style,
      }}
    />
  );
};

export default WalkingCharacterAnimation;