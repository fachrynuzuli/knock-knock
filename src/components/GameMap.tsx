import React from 'react';

const GameMap: React.FC = () => {
  // Calculate map offsets for centering
  const mapWidth = 1280;
  const mapHeight = 720;
  const mapOffsetX = (window.innerWidth - mapWidth) / 2;
  const mapOffsetY = (window.innerHeight - mapHeight) / 2;

  return (
    <div className="absolute inset-0 z-0">
      {/* Main map container */}
      <div 
        className="absolute"
        style={{
          left: `${mapOffsetX}px`,
          top: `${mapOffsetY}px`,
          width: `${mapWidth}px`,
          height: `${mapHeight}px`,
          backgroundImage: 'url("/game_map.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
};

export default GameMap;