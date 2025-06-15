import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { updatePlayerPosition, initializeGameTime } from './store/slices/gameStateSlice';
import Game from './components/Game';
import IntroScreen from './components/IntroScreen';
import LoadingScreen from './components/LoadingScreen';
import { GameProvider } from './contexts/GameContext';
import { Maximize2 } from 'lucide-react';

function App() {
  const dispatch = useDispatch();
  const [gameStarted, setGameStarted] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  
  // Get player position and teammate data from Redux
  const playerPosition = useSelector((state: RootState) => state.gameState.playerPosition);
  const playerTeammate = useSelector((state: RootState) => 
    state.teammates.items.find(teammate => teammate.isPlayer)
  );

  const handleStartGame = () => {
    // Initialize game time when starting
    dispatch(initializeGameTime());
    setGameStarted(true);
  };

  const handleFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error('Could not enter fullscreen mode:', err);
    }
  };

  // Loading screen effect
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoadingAssets(false);
    }, 3000); // 3 second loading simulation

    return () => clearTimeout(loadingTimer);
  }, []);

  // Dynamic player spawn position initialization
  useEffect(() => {
    if (gameStarted && playerTeammate && playerPosition === null) {
      // Calculate spawn position in front of player's house
      const houseX = playerTeammate.housePosition.x;
      const houseY = playerTeammate.housePosition.y;
      
      // Spawn player in front of their house (64 pixels south of house center)
      const initialPlayerX = houseX + 32; // Center horizontally with house
      const initialPlayerY = houseY + 80; // Position in front (south) of house
      
      console.log('Initializing player spawn position:', {
        playerName: playerTeammate.name,
        housePosition: playerTeammate.housePosition,
        spawnPosition: { x: initialPlayerX, y: initialPlayerY }
      });
      
      dispatch(updatePlayerPosition({ x: initialPlayerX, y: initialPlayerY }));
    }
  }, [gameStarted, playerTeammate, playerPosition, dispatch]);

  // Show loading screen first
  if (isLoadingAssets) {
    return <LoadingScreen />;
  }

  // Show loading screen if game started but player position not initialized
  if (gameStarted && playerPosition === null) {
    return <LoadingScreen message="Preparing your house..." />;
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
      
      {/* Built on Bolt Badge - COMMENTED OUT */}
      {/*
      <div className="fixed bottom-0 left-0 z-50">
        <div className="transform transition-transform hover:scale-105">
          <img 
            src="/built_on_bolt_new.png" 
            alt="Built on Bolt" 
            className="max-w-32"
          />
        </div>
      </div>
      */}
    </div>
  );
}

export default App;