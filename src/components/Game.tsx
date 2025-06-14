import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updatePlayerPosition, toggleActivityForm, toggleLeaderboard } from '../store/slices/gameStateSlice';
import { useGameContext } from '../contexts/GameContext';
import { addBadge } from '../store/slices/badgesSlice';
import { Plus, Minus, RotateCcw } from 'lucide-react';

import GameMap from './GameMap';
import Player from './Player';
import House from './House';
import ActivityBoard from './ActivityBoard';
import ActivityForm from './ActivityForm';
import Leaderboard from './Leaderboard';
import GameHUD from './GameHUD';
import BadgeNotification from './BadgeNotification';

// Import game objects and collision detection
import { 
  allCollidableObjects, 
  getObjectsByType, 
  checkCollision, 
  checkProximity,
  CollidableObject 
} from '../data/gameObjects';

// Map dimensions - updated for your new background
const MAP_WIDTH = 2048;
const MAP_HEIGHT = 1342;

// Zoom constants
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;
const ZOOM_STEP = 0.1;

// Camera panning speed
const CAMERA_PAN_SPEED = 4;

// Player dimensions for collision detection
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 32;

// Movement speed (1-10 scale, where 1 is very slow and 10 is extremely fast)
const MOVEMENT_SPEED = 2; // Reduced from 8 to 4 for better control

const Game: React.FC = () => {
  const dispatch = useDispatch();
  const { isFormOpen, openForm, closeForm, viewingTeammate, setViewingTeammate } = useGameContext();
  const { playerPosition, isLeaderboardOpen } = useSelector((state: RootState) => state.gameState);
  const teammates = useSelector((state: RootState) => state.teammates.items);
  
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});
  const [interactionPrompt, setInteractionPrompt] = useState<{show: boolean, message: string, x: number, y: number}>({
    show: false,
    message: '',
    x: 0,
    y: 0
  });

  // Camera state
  const [cameraOffsetX, setCameraOffsetX] = useState(0);
  const [cameraOffsetY, setCameraOffsetY] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Get player's house from teammates array
  const playerHouse = teammates.find(teammate => teammate.isPlayer);
  
  // Get game objects by type for rendering
  const townHallObjects = getObjectsByType('townHall');
  const emptyLandObjects = getObjectsByType('emptyLand');
  const treeObjects = getObjectsByType('tree');
  const bushObjects = getObjectsByType('bush');
  const rockObjects = getObjectsByType('rock');
  
  // Calculate camera position to center player on screen
  const calculateCameraPosition = () => {
    if (!playerPosition) return { x: 0, y: 0 };
    
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
  
  // Zoom functions
  const handleZoomIn = () => {
    const newZoom = zoomLevel + ZOOM_STEP;
    const clampedZoom = Math.min(MAX_ZOOM, newZoom);
    setZoomLevel(clampedZoom);
  };

  const handleZoomOut = () => {
    const newZoom = zoomLevel - ZOOM_STEP;
    const clampedZoom = Math.max(MIN_ZOOM, newZoom);
    setZoomLevel(clampedZoom);
  };

  const handleZoomReset = () => {
    setZoomLevel(1.0);
    setCameraOffsetX(0);
    setCameraOffsetY(0);
  };

  // Enhanced collision detection function
  const canMoveTo = (newX: number, newY: number): boolean => {
    // Check map boundaries
    if (newX < PLAYER_WIDTH/2 || newX > MAP_WIDTH - PLAYER_WIDTH/2 || 
        newY < PLAYER_HEIGHT/2 || newY > MAP_HEIGHT - PLAYER_HEIGHT/2) {
      return false;
    }

    // Check collision with static objects
    const collision = checkCollision(
      newX - PLAYER_WIDTH/2, 
      newY - PLAYER_HEIGHT/2, 
      PLAYER_WIDTH, 
      PLAYER_HEIGHT
    );

    return collision === null;
  };

  // Enhanced interaction detection
  const getInteractionPrompt = (playerX: number, playerY: number): {show: boolean, message: string, x: number, y: number} => {
    // Check proximity to interactable objects
    const nearbyObject = checkProximity(playerX, playerY, 96);
    
    if (nearbyObject) {
      let message = '';
      
      switch (nearbyObject.type) {
        case 'townHall':
          message = 'Press E to enter Town Hall';
          break;
        case 'emptyLand':
          message = `${nearbyObject.name} - Available for development`;
          break;
        default:
          message = `Press E to interact with ${nearbyObject.name}`;
      }
      
      return {
        show: true,
        message,
        x: nearbyObject.x + nearbyObject.width / 2,
        y: nearbyObject.y - 40
      };
    }

    // Check if near any teammate houses (including player's own house)
    for (const teammate of teammates) {
      const dx = Math.abs(playerX - (teammate.housePosition.x + 32));
      const dy = Math.abs(playerY - (teammate.housePosition.y + 32));
      
      if (dx < 64 && dy < 64) {
        return {
          show: true,
          message: teammate.isPlayer 
            ? 'Press E to update your board'
            : `Press E to view ${teammate.name}'s board`,
          x: teammate.housePosition.x,
          y: teammate.housePosition.y - 40
        };
      }
    }

    return { show: false, message: '', x: 0, y: 0 };
  };

  // Check if player is near a specific house
  const isPlayerNearHouse = (teammate: any): boolean => {
    if (!playerPosition) return false;
    
    const dx = Math.abs(playerPosition.x - (teammate.housePosition.x + 32));
    const dy = Math.abs(playerPosition.y - (teammate.housePosition.y + 32));
    
    return dx < 64 && dy < 64;
  };

  // Render environmental objects
  const renderEnvironmentalObject = (obj: CollidableObject) => {
    let bgColor = 'bg-gray-600';
    let borderColor = 'border-gray-800';
    let content = obj.name;

    switch (obj.type) {
      case 'tree':
        bgColor = 'bg-green-700';
        borderColor = 'border-green-900';
        content = '🌳';
        break;
      case 'bush':
        bgColor = 'bg-green-600';
        borderColor = 'border-green-800';
        content = '🌿';
        break;
      case 'rock':
        bgColor = 'bg-gray-500';
        borderColor = 'border-gray-700';
        content = '🪨';
        break;
    }

    return (
      <div 
        key={obj.id}
        className={`absolute ${bgColor} ${borderColor} border-2 rounded flex items-center justify-center text-white font-pixel text-xs`}
        style={{
          left: `${obj.x}px`,
          top: `${obj.y}px`,
          width: `${obj.width}px`,
          height: `${obj.height}px`,
        }}
      >
        {content}
      </div>
    );
  };
  
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
        const nearbyObject = checkProximity(playerPosition!.x, playerPosition!.y, 96);
        
        if (nearbyObject?.type === 'townHall') {
          dispatch(toggleLeaderboard());
          return;
        }

        // Find which teammate's house we're near
        const nearbyTeammate = teammates.find(teammate => {
          const dx = Math.abs(playerPosition!.x - (teammate.housePosition.x + 32));
          const dy = Math.abs(playerPosition!.y - (teammate.housePosition.y + 32));
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
    if (!playerPosition) return;
    
    const moveInterval = setInterval(() => {
      let newX = playerPosition.x;
      let newY = playerPosition.y;
      let newCameraOffsetX = cameraOffsetX;
      let newCameraOffsetY = cameraOffsetY;
      
      // WASD keys for player movement with collision detection
      if (keysPressed.w) {
        const testY = playerPosition.y - MOVEMENT_SPEED;
        if (canMoveTo(playerPosition.x, testY)) {
          newY = testY;
        }
      }
      if (keysPressed.s) {
        const testY = playerPosition.y + MOVEMENT_SPEED;
        if (canMoveTo(playerPosition.x, testY)) {
          newY = testY;
        }
      }
      if (keysPressed.a) {
        const testX = playerPosition.x - MOVEMENT_SPEED;
        if (canMoveTo(testX, playerPosition.y)) {
          newX = testX;
        }
      }
      if (keysPressed.d) {
        const testX = playerPosition.x + MOVEMENT_SPEED;
        if (canMoveTo(testX, playerPosition.y)) {
          newX = testX;
        }
      }
      
      // Arrow keys for camera panning
      if (keysPressed.arrowup) {
        newCameraOffsetY -= CAMERA_PAN_SPEED;
      }
      if (keysPressed.arrowdown) {
        newCameraOffsetY += CAMERA_PAN_SPEED;
      }
      if (keysPressed.arrowleft) {
        newCameraOffsetX -= CAMERA_PAN_SPEED;
      }
      if (keysPressed.arrowright) {
        newCameraOffsetX += CAMERA_PAN_SPEED;
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
      
      // Update interaction prompt
      const prompt = getInteractionPrompt(newX, newY);
      setInteractionPrompt(prompt);
      
    }, 16); // Maintained 60fps for smooth animation
    
    return () => clearInterval(moveInterval);
  }, [keysPressed, playerPosition, cameraOffsetX, cameraOffsetY, dispatch, teammates]);
  
  // Don't render if player position is not set
  if (!playerPosition || !playerHouse) {
    return null;
  }
  
  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-900">
      {/* Game World Container - This is what pans and zooms */}
      <div 
        className="absolute"
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
          playerData={{
            name: playerHouse.name,
            avatarId: playerHouse.avatarId,
            avatarLevel: playerHouse.avatarLevel
          }}
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
        
        {/* Town Hall - Rendered from game objects data */}
        {townHallObjects.map((townHall) => (
          <div 
            key={townHall.id}
            className="absolute"
            style={{
              left: `${townHall.x}px`,
              top: `${townHall.y}px`,
              width: `${townHall.width}px`,
              height: `${townHall.height}px`,
            }}
          >
            <div className="w-full h-full bg-primary-600 bg-opacity-50 border-4 border-primary-800 rounded-lg flex items-center justify-center relative">
              <div className="text-white text-lg font-pixel text-center">{townHall.name}</div>
            </div>
          </div>
        ))}

        {/* Empty Lands - Rendered from game objects data */}
        {emptyLandObjects.map((land) => (
          <div 
            key={land.id}
            className="absolute"
            style={{
              left: `${land.x}px`,
              top: `${land.y}px`,
              width: `${land.width}px`,
              height: `${land.height}px`,
            }}
          >
            <div className="w-full h-full bg-gray-700 bg-opacity-50 border-2 border-dashed border-gray-500 flex items-center justify-center">
              <div className="text-white text-xs font-pixel text-center">{land.name}</div>
            </div>
          </div>
        ))}

        {/* Environmental Objects - Trees, Bushes, Rocks */}
        {treeObjects.map(renderEnvironmentalObject)}
        {bushObjects.map(renderEnvironmentalObject)}
        {rockObjects.map(renderEnvironmentalObject)}
        
        {/* All Houses using the new House component */}
        {teammates.map((teammate) => (
          <div 
            key={teammate.id}
            className="absolute"
            style={{
              left: `${teammate.housePosition.x}px`,
              top: `${teammate.housePosition.y}px`,
            }}
          >
            <House 
              teammate={teammate} 
              isNearby={isPlayerNearHouse(teammate)}
            />
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
      
      {/* Zoom Controls - Moved to bottom right */}
      <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-80 p-3 rounded-lg">
        <div className="text-white font-pixel text-sm mb-2 text-center">
          Zoom: {Math.round(zoomLevel * 100)}%
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= MIN_ZOOM}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold transition-all ${
              zoomLevel <= MIN_ZOOM 
                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                : 'bg-primary-600 hover:bg-primary-700 shadow-pixel button-pixel'
            }`}
          >
            <Minus size={16} />
          </button>
          <button
            onClick={handleZoomReset}
            disabled={zoomLevel === 1.0 && cameraOffsetX === 0 && cameraOffsetY === 0}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold transition-all ${
              zoomLevel === 1.0 && cameraOffsetX === 0 && cameraOffsetY === 0
                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                : 'bg-secondary-600 hover:bg-secondary-700 shadow-pixel button-pixel'
            }`}
            title="Reset to 100%"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= MAX_ZOOM}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold transition-all ${
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