import React from 'react';

const GameMap: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
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