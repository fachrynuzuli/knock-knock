import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { updatePlayerPosition, initializeGameTime } from './store/slices/gameStateSlice';
import Game from './components/Game';
import IntroScreen from './components/IntroScreen';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage';
import { GameProvider, useGameContext } from './contexts/GameContext';

// Create a wrapper component to access GameContext
const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const [isReturningUser, setIsReturningUser] = useState<boolean | null>(null); // null = checking
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false); // Changed to false initially
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // Access game context for form states
  const { isFormOpen, viewingTeammate } = useGameContext();
  
  // Get player position and teammate data from Redux
  const playerPosition = useSelector((state: RootState) => state.gameState.playerPosition);
  const playerTeammate = useSelector((state: RootState) => 
    state.teammates.items.find(teammate => teammate.isPlayer)
  );

  // Check if user is returning on app load
  useEffect(() => {
    const checkUserStatus = () => {
      const hasRegistered = localStorage.getItem('hasRegistered');
      const playerName = localStorage.getItem('playerName');
      const playerAvatar = localStorage.getItem('playerAvatar');
      
      const isReturning = hasRegistered === 'true' && playerName && playerAvatar;
      
      setIsReturningUser(isReturning);
      
      if (isReturning) {
        // Returning user - show loading and prepare to enter game
        setLoadingMessage('Welcome back! Loading your neighborhood...');
        setShowLandingPage(false);
        setIsLoadingAssets(true);
        
        // Simulate loading for returning users (shorter duration)
        setTimeout(() => {
          setIsLoadingAssets(false);
          setGameStarted(true);
          dispatch(initializeGameTime());
        }, 2000);
      } else {
        // New user - show landing page immediately (no loading)
        setShowLandingPage(true);
      }
    };

    checkUserStatus();
  }, [dispatch]);

  const handleEnterGameFlow = () => {
    setShowLandingPage(false);
    setIsLoadingAssets(true);
    setLoadingMessage('Loading game assets...');
    
    // Simulate asset loading for new users
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

  // Show loading screen only for returning users or when explicitly loading assets
  if (isLoadingAssets) {
    return <LoadingScreen message={loadingMessage} />;
  }

  // Show landing page for new users (with scroll enabled)
  if (showLandingPage && !isReturningUser) {
    return (
      <div className="relative">
        <LandingPage onEnterGameFlow={handleEnterGameFlow} />
        
        {/* Global Bolt Logo for landing page - with spinning animation and responsive sizing */}
        <img
          src="/white_circle_360x360.png"
          alt="Built with Bolt"
          className="fixed bottom-2 left-2 z-50 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 opacity-100 bolt-logo-spin"
          style={{ imageRendering: 'auto' }}
        />
      </div>
    );
  }

  // Show loading screen if game started but player position not initialized
  if (gameStarted && playerPosition === null) {
    return <LoadingScreen message="Preparing your house..." />;
  }

  return (
    <div className="w-full h-full overflow-hidden relative">
      {!gameStarted ? (
        <IntroScreen onStartGame={handleStartGame} />
      ) : (
        <Game />
      )}
      
      {/* Global Bolt Logo - positioned at bottom-left with conditional opacity, spinning animation, and responsive sizing */}
      <img
        src="/white_circle_360x360.png"
        alt="Built with Bolt"
        className={`absolute bottom-2 left-2 z-50 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 transition-opacity duration-300 bolt-logo-spin ${
          isFormOpen || viewingTeammate ? 'opacity-50' : 'opacity-100'
        }`}
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
};

function App() {
  return (
    <div className="w-full h-full overflow-hidden">
      <GameProvider>
        <AppContent />
      </GameProvider>
    </div>
  );
}

export default App;