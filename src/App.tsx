import React, { useState, useEffect } from 'react';
import Game from './components/Game';
import IntroScreen from './components/IntroScreen';
import { GameProvider } from './contexts/GameContext';
import { Maximize2 } from 'lucide-react';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error('Could not enter fullscreen mode:', err);
    }
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <GameProvider>
        {!gameStarted ? (
          <IntroScreen onStartGame={handleStartGame} />
        ) : (
          <Game />
        )}
      </GameProvider>
      
      {/* Built on Bolt Badge */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="transform transition-transform hover:scale-105">
          <img 
            src="/built on bolt no Background.png" 
            alt="Built on Bolt" 
            className="h-40 w-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default App;