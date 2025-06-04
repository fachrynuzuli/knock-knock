import React, { useState, useEffect } from 'react';
import Game from './components/Game';
import IntroScreen from './components/IntroScreen';
import { GameProvider } from './contexts/GameContext';
import { Maximize2 } from 'lucide-react';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showSizeWarning, setShowSizeWarning] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const checkScreenSize = () => {
    setShowSizeWarning(window.innerWidth < 1280 || window.innerHeight < 720);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setTimeout(checkScreenSize, 1000);
    } catch (err) {
      console.error('Could not enter fullscreen mode:', err);
    }
  };

  if (showSizeWarning) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full border-4 border-primary-600 text-center">
          <Maximize2 className="mx-auto mb-4 text-primary-400" size={48} />
          <h2 className="text-xl font-heading text-white mb-4">
            Screen Size Warning
          </h2>
          <p className="text-gray-300 font-pixel mb-6">
            For the best gaming experience, please switch to full screen mode. Click the expand button in the corner or press F11 to continue. Your eyes will thank you later!
          </p>
          <button
            onClick={handleFullscreen}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-pixel shadow-pixel button-pixel"
          >
            Go Fullscreen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <GameProvider>
        {!gameStarted ? (
          <IntroScreen onStartGame={handleStartGame} />
        ) : (
          <Game />
        )}
      </GameProvider>
    </div>
  );
}

export default App;