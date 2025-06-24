import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { updatePlayerPosition, initializeGameTime } from './store/slices/gameStateSlice';
import Game from './components/Game';
import IntroScreen from './components/IntroScreen';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage';
import { GameProvider } from './contexts/GameContext';

function App() {
  const dispatch = useDispatch();
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  
  // Get player position and teammate data from Redux
  const playerPosition = useSelector((state: RootState) => state.gameState.playerPosition);
  const playerTeammate = useSelector((state: RootState) => 
    state.teammates.items.find(teammate => teammate.isPlayer)
  );

  const handleEnterGameFlow = () => {
    setShowLandingPage(false);
    // Start loading assets when entering game flow
    setIsLoadingAssets(true);
    
    // Simulate asset loading
    setTimeout(() => {
      setIsLoadingAssets(false);
    }, 3000);
  };

  const handleStartGame = () => {
    // Initialize game time when starting
    dispatch(initializeGameTime());
    setGameStarted(true);
  };

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

  // Show landing page first
  if (showLandingPage) {
    return <LandingPage onEnterGameFlow={handleEnterGameFlow} />;
  }

  // Show loading screen during asset loading
  if (isLoadingAssets) {
    return <LoadingScreen message="Loading your neighborhood..." />;
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
    </div>
  );
}

export default App;