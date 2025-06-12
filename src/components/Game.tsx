import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updatePlayerPosition, toggleActivityForm, toggleLeaderboard } from '../store/slices/gameStateSlice';
import { useGameContext } from '../contexts/GameContext';
import { addBadge } from '../store/slices/badgesSlice';
import { Plus, Minus, RotateCcw } from 'lucide-react';

import GameMap from './GameMap';
import Player from './Player';
import ActivityBoard from './ActivityBoard';
import ActivityForm from './ActivityForm';
import Leaderboard from './Leaderboard';
import GameHUD from './GameHUD';
import BadgeNotification from './BadgeNotification';

interface EmptyLand {
  id: string;
  name: string;
  x: number;
  y: number;
}

const emptyLands: EmptyLand[] = [
  { id: '1', name: 'Riverside Plot', x: 520, y: 450 },
  { id: '2', name: 'Hilltop Haven', x: 970, y: 450 },
  { id: '3', name: 'Forest Edge', x: 300, y: 870 },
  { id: '4', name: 'Meadow View', x: 1045, y: 270 },
  { id: '5', name: 'Valley Vista', x: 610, y: 700 },
  { id: '6', name: 'Mountain Peak', x: 940, y: 870 },
  { id: '7', name: 'Lareina Valley', x: 650, y: 870 }
];

const townHallPosition = {
  x: 820,
  y: 420
};

// Map dimensions - updated for your new background
const MAP_WIDTH = 2048;
const MAP_HEIGHT = 1342;

// Responsive zoom constants
const getZoomConstants = () => {
  const width = window.innerWidth;
  if (width < 640) {
    return { MIN_ZOOM: 0.3, MAX_ZOOM: 1.5, ZOOM_STEP: 0.1 };
  } else if (width < 1024) {
    return { MIN_ZOOM: 0.4, MAX_ZOOM: 1.8, ZOOM_STEP: 0.1 };
  } else {
    return { MIN_ZOOM: 0.5, MAX_ZOOM: 2.0, ZOOM_STEP: 0.1 };
  }
};

// Responsive camera panning speed
const getCameraPanSpeed = () => {
  const width = window.innerWidth;
  if (width < 640) return 12;
  if (width < 1024) return 15;
  return 18;
};

const Game: React.FC = () => {
  const dispatch = useDispatch();
  const { playerName, playerAvatar, playerAvatarLevel, isFormOpen, openForm, closeForm, viewingTeammate, setViewingTeammate } = useGameContext();
  const { playerPosition, isLeaderboardOpen } = useSelector((state: RootState) => state.gameState);
  const teammates = useSelector((state: RootState) => state.teammates.items);
  
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});
  const [interactionPrompt, setInteractionPrompt] = useState<{show: boolean, message: string, x: number, y: number}>({
    show: false,
    message: '',
    x: 0,
    y: 0
  });

  // Responsive camera state
  const [cameraOffsetX, setCameraOffsetX] = useState(0);
  const [cameraOffsetY, setCameraOffsetY] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(() => {
    // Set initial zoom based on screen size
    const width = window.innerWidth;
    if (width < 640) return 0.6;
    if (width < 1024) return 0.8;
    return 1.0;
  });

  // Get player's house from teammates array
  const playerHouse = teammates.find(teammate => teammate.isPlayer);
  
  // Calculate camera position to center player on screen
  const calculateCameraPosition = () => {
    const viewportWidth = window.innerWidth / zoomLevel;
    const viewportHeight = window.innerHeight / zoomLevel;
    
    // Center the camera on the player, then apply manual offset
    let cameraX = playerPosition.x - viewportWidth / 2 + cameraOffsetX;
    let cameraY = playerPosition.y - viewportHeight / 2 + cameraOffsetY;
    
    // Check if the viewport is larger than the map
    if (viewportWidth >= MAP_WIDTH) {
      // Center the map horizontally
      cameraX = -(viewportWidth - MAP_WIDTH) / 2;
    } else {
      // Clamp camera to map boundaries horizontally
      cameraX = Math.max(0, Math.min(MAP_WIDTH - viewportWidth, cameraX));
    }
    
    if (viewportHeight >= MAP_HEIGHT) {
      // Center the map vertically
      cameraY = -(viewportHeight - MAP_HEIGHT) / 2;
    } else {
      // Clamp camera to map boundaries vertically
      cameraY = Math.max(0, Math.min(MAP_HEIGHT - viewportHeight, cameraY));
    }
    
    return { x: cameraX, y: cameraY };
  };

  const cameraPosition = calculateCameraPosition();
  
  // Responsive zoom functions
  const handleZoomIn = () => {
    const { MAX_ZOOM, ZOOM_STEP } = getZoomConstants();
    const newZoom = zoomLevel + ZOOM_STEP;
    const clampedZoom = Math.min(MAX_ZOOM, newZoom);
    setZoomLevel(clampedZoom);
  };

  const handleZoomOut = () => {
    const { MIN_ZOOM, ZOOM_STEP } = getZoomConstants();
    const newZoom = zoomLevel - ZOOM_STEP;
    const clampedZoom = Math.max(MIN_ZOOM, newZoom);
    setZoomLevel(clampedZoom);
  };

  const handleZoomReset = () => {
    const width = window.innerWidth;
    const defaultZoom = width < 640 ? 0.6 : width < 1024 ? 0.8 : 1.0;
    setZoomLevel(defaultZoom);
    setCameraOffsetX(0);
    setCameraOffsetY(0);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Adjust zoom level if it's outside the new bounds
      const { MIN_ZOOM, MAX_ZOOM } = getZoomConstants();
      if (zoomLevel < MIN_ZOOM) setZoomLevel(MIN_ZOOM);
      if (zoomLevel > MAX_ZOOM) setZoomLevel(MAX_ZOOM);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [zoomLevel]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
      
      // Reset camera offset when WASD is pressed (recenter on player)
      if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        setCameraOffsetX(0);
        setCameraOffsetY(0);
      }
      
      if ((e.key === 'e' || e.key === ' ') && interactionPrompt.show) {
        // Check if near Town Hall
        const dxTownHall = Math.abs(playerPosition.x - (townHallPosition.x + 48));
        const dyTownHall = Math.abs(playerPosition.y - (townHallPosition.y + 48));
        
        if (dxTownHall < 96 && dyTownHall < 96) {
          dispatch(toggleLeaderboard());
          return;
        }

        // Find which teammate's house we're near
        const nearbyTeammate = teammates.find(teammate => {
          const dx = Math.abs(playerPosition.x - (teammate.housePosition.x + 32));
          const dy = Math.abs(playerPosition.y - (teammate.housePosition.y + 32));
          return dx < 64 && dy < 64;
        });
        
        if (nearbyTeammate) {
          if (nearbyTeammate.isPlayer) {
            openForm();
          } else {
            setViewingTeammate(nearbyTeammate.name);
          }
        }
      }
      
      if (e.key === 'Escape') {
        if (viewingTeammate) {
          setViewingTeammate(null);
        } else if (isFormOpen) {
          closeForm();
        } else if (isLeaderboardOpen) {
          dispatch(toggleLeaderboard());
        }
      }
      
      if (e.key.toLowerCase() === 'l') {
        dispatch(toggleLeaderboard());
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playerPosition, interactionPrompt, teammates, dispatch, openForm, closeForm, isFormOpen, isLeaderboardOpen, viewingTeammate, setViewingTeammate]);
  
  useEffect(() => {
    const moveSpeed = window.innerWidth < 640 ? 3 : window.innerWidth < 1024 ? 4 : 5;
    const cameraPanSpeed = getCameraPanSpeed();
    
    const moveInterval = setInterval(() => {
      let newX = playerPosition.x;
      let newY = playerPosition.y;
      let newCameraOffsetX = cameraOffsetX;
      let newCameraOffsetY = cameraOffsetY;
      
      // WASD keys for player movement
      if (keysPressed.w && playerPosition.y > 32) {
        newY -= moveSpeed;
      }
      if (keysPressed.s && playerPosition.y < MAP_HEIGHT - 32) {
        newY += moveSpeed;
      }
      if (keysPressed.a && playerPosition.x > 32) {
        newX -= moveSpeed;
      }
      if (keysPressed.d && playerPosition.x < MAP_WIDTH - 32) {
        newX += moveSpeed;
      }
      
      // Arrow keys for camera panning (disabled on mobile)
      if (window.innerWidth >= 640) {
        if (keysPressed.arrowup) {
          newCameraOffsetY -= cameraPanSpeed;
        }
        if (keysPressed.arrowdown) {
          newCameraOffsetY += cameraPanSpeed;
        }
        if (keysPressed.arrowleft) {
          newCameraOffsetX -= cameraPanSpeed;
        }
        if (keysPressed.arrowright) {
          newCameraOffsetX += cameraPanSpeed;
        }
      }
      
      // Update player position if changed
      if (newX !== playerPosition.x || newY !== playerPosition.y) {
        dispatch(updatePlayerPosition({ x: newX, y: newY }));
      }
      
      // Update camera offset if changed
      if (newCameraOffsetX !== cameraOffsetX || newCameraOffsetY !== cameraOffsetY) {
        setCameraOffsetX(newCameraOffsetX);
        setCameraOffsetY(newCameraOffsetY);
      }
      
      let foundInteraction = false;
      
      // Check if near Town Hall
      const dxTownHall = Math.abs(newX - (townHallPosition.x + 48));
      const dyTownHall = Math.abs(newY - (townHallPosition.y + 48));
      
      if (dxTownHall < 96 && dyTownHall < 96) {
        setInteractionPrompt({
          show: true,
          message: 'Press E to enter Town Hall',
          x: townHallPosition.x,
          y: townHallPosition.y - 40
        });
        foundInteraction = true;
      }
      
      // Check if near any teammate houses (including player's own house)
      if (!foundInteraction) {
        for (const teammate of teammates) {
          const dx = Math.abs(newX - (teammate.housePosition.x + 32));
          const dy = Math.abs(newY - (teammate.housePosition.y + 32));
          
          if (dx < 64 && dy < 64) {
            setInteractionPrompt({
              show: true,
              message: teammate.isPlayer 
                ? 'Press E to update your board'
                : `Press E to view ${teammate.name}'s board`,
              x: teammate.housePosition.x,
              y: teammate.housePosition.y - 40
            });
            foundInteraction = true;
            break;
          }
        }
      }

      // Check for nearby empty lands
      if (!foundInteraction) {
        for (const land of emptyLands) {
          const dx = Math.abs(newX - (land.x + 32));
          const dy = Math.abs(newY - (land.y + 32));
          
          if (dx < 64 && dy < 64) {
            setInteractionPrompt({
              show: true,
              message: `${land.name} - Available for development`,
              x: land.x,
              y: land.y - 40
            });
            foundInteraction = true;
            break;
          }
        }
      }
      
      if (!foundInteraction) {
        setInteractionPrompt({ show: false, message: '', x: 0, y: 0 });
      }
      
    }, 33);
    
    return () => clearInterval(moveInterval);
  }, [keysPressed, playerPosition, cameraOffsetX, cameraOffsetY, dispatch, teammates]);
  
  const { MIN_ZOOM, MAX_ZOOM } = getZoomConstants();
  
  return (
    <div className="game-container landscape-adjust">
      {/* Game World Container - This is what pans and zooms */}
      <div 
        className="absolute transition-transform duration-150 ease-linear"
        style={{
          width: `${MAP_WIDTH}px`,
          height: `${MAP_HEIGHT}px`,
          transform: `translate(-${cameraPosition.x}px, -${cameraPosition.y}px) scale(${zoomLevel})`,
          transformOrigin: 'top left',
        }}
      >
        <GameMap />
        
        <Player
          position={playerPosition}
          avatarId={playerAvatar}
          avatarLevel={playerAvatarLevel}
          name={playerName}
          isMoving={
            keysPressed.w || keysPressed.a || keysPressed.s || keysPressed.d
          }
          direction={
            keysPressed.w ? 'up' :
            keysPressed.s ? 'down' :
            keysPressed.a ? 'left' :
            keysPressed.d ? 'right' : 'down'
          }
        />
        
        {/* Town Hall - Positioned for the new map */}
        <div 
          className="absolute"
          style={{
            left: `${townHallPosition.x}px`,
            top: `${townHallPosition.y}px`,
          }}
        >
          <div className="w-[440px] h-[300px] bg-primary-600 bg-opacity-50 border-4 border-primary-800 rounded-lg flex items-center justify-center relative">
            <div className="text-white text-lg font-pixel text-center">Town Hall</div>
          </div>
        </div>

        {/* Empty Lands - Repositioned for new map */}
        {emptyLands.map((land) => (
          <div 
            key={land.id}
            className="absolute"
            style={{
              left: `${land.x}px`,
              top: `${land.y}px`,
            }}
          >
            <div className="w-32 h-16 bg-gray-700 bg-opacity-50 border-2 border-dashed border-gray-500 flex items-center justify-center">
              <div className="text-white text-xs font-pixel text-center">{land.name}</div>
            </div>
          </div>
        ))}
        
        {/* All Houses (including player's house) */}
        {teammates.map((teammate) => (
          <div 
            key={teammate.id}
            className="absolute"
            style={{
              left: `${teammate.housePosition.x}px`,
              top: `${teammate.housePosition.y}px`,
            }}
          >
            <div className={`w-16 h-16 ${teammate.isPlayer ? 'bg-blue-500' : 'bg-red-500'} bg-opacity-50 border-2 ${teammate.isPlayer ? 'border-blue-700' : 'border-red-700'} flex items-center justify-center`}>
              <div className="text-white text-xs font-pixel text-center">{teammate.name}</div>
            </div>
          </div>
        ))}
        
        {/* Interaction Prompt */}
        {interactionPrompt.show && (
          <div 
            className="absolute bg-gray-800 bg-opacity-80 px-3 py-1 rounded-lg text-white text-sm font-pixel z-30 animate-bounce-slow"
            style={{
              left: `${interactionPrompt.x - 100}px`,
              top: `${interactionPrompt.y}px`,
              width: '200px',
              textAlign: 'center',
            }}
          >
            {interactionPrompt.message}
          </div>
        )}
      </div>
      
      {/* Fixed UI Elements - These don't pan with the map */}
      <GameHUD />
      
      {/* Zoom Controls - Responsive positioning */}
      <div className="zoom-controls">
        <div className="text-white font-pixel text-responsive-sm mb-2 text-center">
          Zoom: {Math.round(zoomLevel * 100)}%
        </div>
        <div className="flex items-center space-responsive-x">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= MIN_ZOOM}
            className={`zoom-button text-white font-bold transition-all ${
              zoomLevel <= MIN_ZOOM 
                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                : 'bg-primary-600 hover:bg-primary-700 shadow-pixel button-pixel'
            }`}
          >
            <Minus size={16} />
          </button>
          <button
            onClick={handleZoomReset}
            disabled={zoomLevel === (window.innerWidth < 640 ? 0.6 : window.innerWidth < 1024 ? 0.8 : 1.0) && cameraOffsetX === 0 && cameraOffsetY === 0}
            className={`zoom-button text-white font-bold transition-all ${
              zoomLevel === (window.innerWidth < 640 ? 0.6 : window.innerWidth < 1024 ? 0.8 : 1.0) && cameraOffsetX === 0 && cameraOffsetY === 0
                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                : 'bg-secondary-600 hover:bg-secondary-700 shadow-pixel button-pixel'
            }`}
            title="Reset to default"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= MAX_ZOOM}
            className={`zoom-button text-white font-bold transition-all ${
              zoomLevel >= MAX_ZOOM 
                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                : 'bg-primary-600 hover:bg-primary-700 shadow-pixel button-pixel'
            }`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      {isFormOpen && <ActivityForm onClose={closeForm} />}
      
      {viewingTeammate && (
        <ActivityBoard 
          teammate={viewingTeammate} 
          onClose={() => setViewingTeammate(null)} 
        />
      )}
      
      {isLeaderboardOpen && <Leaderboard />}
      
      <BadgeNotification />
    </div>
  );
};

export default Game;