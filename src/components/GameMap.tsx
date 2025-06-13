import React from 'react';

const GameMap: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      {/* Main map container - now fills the entire game world */}
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: 'url("/game_map_large_0.png")',
          backgroundSize: '100% 100%',
          backgroundPosition: 'top left',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      >
        {/* Dynamic lighting overlay for lively atmosphere */}
        <div 
          className="absolute inset-0 pointer-events-none z-10 animate-day-night"
        />
        
        {/* Optional grid overlay for debugging */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0"
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