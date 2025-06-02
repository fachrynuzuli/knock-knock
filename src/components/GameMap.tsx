import React from 'react';

const GameMap: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      {/* Background grass pattern */}
      <div 
        className="absolute inset-0 bg-green-600 bg-opacity-70"
        style={{
          backgroundImage: 'url("https://i.imgur.com/XcYPfVr.png")',
          backgroundSize: '32px 32px',
          imageRendering: 'pixelated',
        }}
      />
      
      {/* Roads */}
      <div 
        className="absolute bg-gray-700"
        style={{
          left: '50%',
          top: '0',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '100%',
          backgroundImage: 'url("https://i.imgur.com/SLu6CfV.png")',
          backgroundSize: '100px 100px',
          backgroundRepeat: 'repeat-y',
          imageRendering: 'pixelated',
        }}
      />
      
      <div 
        className="absolute bg-gray-700"
        style={{
          left: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '100%',
          height: '100px',
          backgroundImage: 'url("https://i.imgur.com/EQsexkQ.png")',
          backgroundSize: '100px 100px',
          backgroundRepeat: 'repeat-x',
          imageRendering: 'pixelated',
        }}
      />
      
      {/* Grid overlay for debug purposes */}
      {/* <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} /> */}
      
      {/* Decorations: trees, rocks, etc. */}
      {Array.from({ length: 15 }).map((_, i) => {
        const x = Math.floor(Math.random() * 700) + 50;
        const y = Math.floor(Math.random() * 500) + 50;
        
        // Don't place decorations on roads
        const isOnRoad = 
          (x > 350 - 50 && x < 350 + 50) || 
          (y > 300 - 50 && y < 300 + 50);
        
        if (isOnRoad) return null;
        
        const decorationType = Math.floor(Math.random() * 3); // 0 = tree, 1 = rock, 2 = flower
        
        return (
          <div 
            key={i} 
            className="absolute"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              width: '32px',
              height: '32px',
              zIndex: y, // Closer objects appear in front
            }}
          >
            {decorationType === 0 && (
              <img 
                src="https://i.imgur.com/uJqLkRs.png" 
                alt="Tree"
                className="pixel-art w-full h-full"
              />
            )}
            {decorationType === 1 && (
              <img 
                src="https://i.imgur.com/I8CXhJo.png" 
                alt="Rock"
                className="pixel-art w-full h-full"
              />
            )}
            {decorationType === 2 && (
              <img 
                src="https://i.imgur.com/2Uk0mzL.png" 
                alt="Flowers"
                className="pixel-art w-full h-full"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GameMap;