import React, { useState } from 'react';
import Game from './components/Game';
import IntroScreen from './components/IntroScreen';
import { GameProvider } from './contexts/GameContext';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
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
    </div>
  );
}

export default App;