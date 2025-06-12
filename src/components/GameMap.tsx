import React from 'react';

const containerStyle: React.CSSProperties = {
  backgroundImage: 'url("/game_map_large_0.png")',
  backgroundSize: '100% 100%',
  backgroundPosition: 'center', // Centered the map
  backgroundRepeat: 'no-repeat',
  imageRendering: 'pixelated',
  width: '100%',
  height: '100%',
  position: 'relative', // Important for the overlay
};

const gridStyle: React.CSSProperties = {
  backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
  backgroundSize: '32px 32px',
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  opacity: 0, // This is currently hidden
};

const GameMap: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      {/* Main map container */}
      <div style={containerStyle}>
        {/* Optional grid overlay for debugging */}
        <div style={gridStyle} />
      </div>
    </div>
  );
};

export default GameMap