import React from 'react';

const GameMap: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      {/* Main map container */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1280px] h-[720px]"
        style={{
          backgroundImage: 'url("/game_map.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          imageRendering: 'pixelated',
        }}
      >
        {/* Optional grid overlay for debugging */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>
    </div>
  );
};

export default GameMap;