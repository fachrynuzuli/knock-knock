import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updatePlayerPosition } from '../store/slices/gameStateSlice';
import { useGameContext } from '../contexts/GameContext';
import { motion } from 'framer-motion';
import { Play, Maximize2, RotateCcw } from 'lucide-react';

import GameMap from './GameMap';
import Player from './Player';
import House from './House';
import { MAP_CONFIG, MOVEMENT_CONFIG, INTERACTION_CONFIG } from '../config/gameConfig';
import { allCollidableObjects, checkCollision, checkProximity } from '../data/gameObjects';

interface MiniGameDemoProps {
  onFullGameRequest: () => void;
  scale?: number;
  autoPlay?: boolean;
  demoMode?: boolean;
}

const MiniGameDemo: React.FC<MiniGameDemoProps> = ({ 
  onFullGameRequest, 
  scale = 0.4, 
  autoPlay = false,
  demoMode = true 
}) => {
  const dispatch = useDispatch();
  const { playerName } = useGameContext();
  
  // Demo-specific state
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [demoPlayerPosition, setDemoPlayerPosition] = useState({ x: 400, y: 300 });
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});
  const [interactionPrompt, setInteractionPrompt] = useState<{show: boolean, message: string}>({
    show: false,
    message: ''
  });

  // Get teammates for demo (use actual data or demo data)
  const teammates = useSelector((state: RootState) => state.teammates.items);
  const demoTeammates = teammates.length > 0 ? teammates : [
    {
      id: 'demo-player',
      name: playerName || 'You',
      avatarId: 1,
      avatarLevel: 1,
      playerLevel: 1,
      houseLevel: 1,
      housePosition: { x: 782, y: 232 },
      houseType: 0,
      isPlayer: true,
      stats: { projectCount: 3, adhocCount: 2, routineCount: 1, totalActivities: 6 }
    },
    {
      id: 'demo-alex',
      name: 'Alex',
      avatarId: 2,
      avatarLevel: 2,
      playerLevel: 3,
      houseLevel: 2,
      housePosition: { x: 375, y: 180 },
      houseType: 1,
      stats: { projectCount: 12, adhocCount: 5, routineCount: 3, totalActivities: 20 }
    }
  ];

  // Collision detection for demo
  const canMoveTo = (newX: number, newY: number): boolean => {
    if (newX < MAP_CONFIG.PLAYER_WIDTH/2 || newX > MAP_CONFIG.MAP_WIDTH - MAP_CONFIG.PLAYER_WIDTH/2 || 
        newY < MAP_CONFIG.PLAYER_HEIGHT/2 || newY > MAP_CONFIG.MAP_HEIGHT - MAP_CONFIG.PLAYER_HEIGHT/2) {
      return false;
    }

    const collision = checkCollision(
      newX - MAP_CONFIG.PLAYER_WIDTH/2, 
      newY - MAP_CONFIG.PLAYER_HEIGHT/2, 
      MAP_CONFIG.PLAYER_WIDTH, 
      MAP_CONFIG.PLAYER_HEIGHT
    );

    return collision === null;
  };

  // Interaction detection for demo
  const getInteractionPrompt = (playerX: number, playerY: number) => {
    for (const teammate of demoTeammates) {
      const dx = Math.abs(playerX - (teammate.housePosition.x + 32));
      const dy = Math.abs(playerY - (teammate.housePosition.y + 32));
      
      if (dx < INTERACTION_CONFIG.HOUSE_INTERACTION_DISTANCE && dy < INTERACTION_CONFIG.HOUSE_INTERACTION_DISTANCE) {
        return {
          show: true,
          message: teammate.isPlayer 
            ? 'Press E to update your board'
            : `Press E to view ${teammate.name}'s board`
        };
      }
    }

    const nearbyObject = checkProximity(playerX, playerY, INTERACTION_CONFIG.OBJECT_PROXIMITY_DISTANCE);
    if (nearbyObject?.type === 'townHall') {
      return {
        show: true,
        message: 'Press E to enter Town Hall'
      };
    }

    return { show: false, message: '' };
  };

  // Demo movement system
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        setKeysPressed(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
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
  }, [isPlaying]);

  // Movement loop for demo
  useEffect(() => {
    if (!isPlaying) return;

    const moveInterval = setInterval(() => {
      let newX = demoPlayerPosition.x;
      let newY = demoPlayerPosition.y;
      
      if (keysPressed.w || keysPressed.arrowup) {
        const testY = demoPlayerPosition.y - MOVEMENT_CONFIG.MOVEMENT_SPEED;
        if (canMoveTo(demoPlayerPosition.x, testY)) {
          newY = testY;
        }
      }
      if (keysPressed.s || keysPressed.arrowdown) {
        const testY = demoPlayerPosition.y + MOVEMENT_CONFIG.MOVEMENT_SPEED;
        if (canMoveTo(demoPlayerPosition.x, testY)) {
          newY = testY;
        }
      }
      if (keysPressed.a || keysPressed.arrowleft) {
        const testX = demoPlayerPosition.x - MOVEMENT_CONFIG.MOVEMENT_SPEED;
        if (canMoveTo(testX, demoPlayerPosition.y)) {
          newX = testX;
        }
      }
      if (keysPressed.d || keysPressed.arrowright) {
        const testX = demoPlayerPosition.x + MOVEMENT_CONFIG.MOVEMENT_SPEED;
        if (canMoveTo(testX, demoPlayerPosition.y)) {
          newX = testX;
        }
      }
      
      if (newX !== demoPlayerPosition.x || newY !== demoPlayerPosition.y) {
        setDemoPlayerPosition({ x: newX, y: newY });
      }
      
      // Update interaction prompt
      const prompt = getInteractionPrompt(newX, newY);
      setInteractionPrompt(prompt);
      
    }, 16);
    
    return () => clearInterval(moveInterval);
  }, [keysPressed, demoPlayerPosition, isPlaying]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setDemoPlayerPosition({ x: 400, y: 300 });
    setKeysPressed({});
    setInteractionPrompt({ show: false, message: '' });
  };

  const scaledMapWidth = MAP_CONFIG.MAP_WIDTH * scale;
  const scaledMapHeight = MAP_CONFIG.MAP_HEIGHT * scale;

  return (
    <div className="relative bg-gray-800 rounded-2xl overflow-hidden border-4 border-primary-600 shadow-2xl glow-border">
      {/* Game Container */}
      <div 
        className="relative bg-gray-900 overflow-hidden"
        style={{
          width: `${scaledMapWidth}px`,
          height: `${scaledMapHeight}px`,
          maxWidth: '100%',
          aspectRatio: `${MAP_CONFIG.MAP_WIDTH} / ${MAP_CONFIG.MAP_HEIGHT}`
        }}
      >
        {/* Game World */}
        <div 
          className="absolute"
          style={{
            width: `${MAP_CONFIG.MAP_WIDTH}px`,
            height: `${MAP_CONFIG.MAP_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <GameMap />
          
          {/* Player Character */}
          <Player
            position={demoPlayerPosition}
            playerData={{
              name: playerName || 'You',
              avatarId: 1,
              avatarLevel: 1
            }}
            isMoving={
              keysPressed.w || keysPressed.a || keysPressed.s || keysPressed.d ||
              keysPressed.arrowup || keysPressed.arrowleft || keysPressed.arrowdown || keysPressed.arrowright
            }
            direction={
              keysPressed.w || keysPressed.arrowup ? 'up' :
              keysPressed.s || keysPressed.arrowdown ? 'down' :
              keysPressed.a || keysPressed.arrowleft ? 'left' :
              keysPressed.d || keysPressed.arrowright ? 'right' : 'down'
            }
          />
          
          {/* Houses */}
          {demoTeammates.map((teammate) => (
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
                isNearby={false}
              />
            </div>
          ))}
          
          {/* Town Hall */}
          <div 
            className="absolute"
            style={{
              left: '820px',
              top: '420px',
              width: '440px',
              height: '300px',
            }}
          >
            <div className="w-full h-full bg-primary-600 bg-opacity-50 border-4 border-primary-800 rounded-lg flex items-center justify-center">
              <div className="text-white text-lg font-pixel text-center">Town Hall</div>
            </div>
          </div>
          
          {/* Interaction Prompt */}
          {interactionPrompt.show && (
            <div 
              className="absolute bg-gray-800 bg-opacity-90 px-3 py-2 rounded-lg text-white text-sm font-pixel z-30 animate-bounce-slow border-2 border-primary-500"
              style={{
                left: `${demoPlayerPosition.x - 100}px`,
                top: `${demoPlayerPosition.y - 60}px`,
                width: '200px',
                textAlign: 'center',
              }}
            >
              {interactionPrompt.message}
            </div>
          )}
        </div>

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.button
              onClick={handlePlayToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-6 shadow-2xl glow-border"
            >
              <Play className="w-16 h-16" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Demo Controls */}
      <div className="absolute bottom-4 left-4 right-4 bg-gray-900/90 rounded-lg p-3 flex items-center justify-between backdrop-blur-sm border border-gray-700">
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePlayToggle}
            className="text-white hover:text-primary-400 transition-colors"
          >
            {isPlaying ? <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 bg-red-500 rounded-full"
            /> : <Play className="w-5 h-5" />}
          </button>
          
          <button
            onClick={handleReset}
            className="text-white hover:text-primary-400 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <div className="text-white font-pixel text-sm">
            {isPlaying ? 'Use WASD or Arrow Keys to move!' : 'Click Play to try the demo'}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onFullGameRequest}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-pixel text-sm transition-all flex items-center space-x-2"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Play Full Game</span>
          </button>
          
          <div className="text-white font-pixel text-xs bg-primary-600 px-2 py-1 rounded">
            LIVE DEMO
          </div>
        </div>
      </div>

      {/* Instructions Overlay */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 bg-gray-900/80 rounded-lg p-3 border border-primary-500"
        >
          <div className="text-primary-400 font-pixel text-xs mb-1">🎮 LIVE DEMO</div>
          <div className="text-white font-pixel text-xs">
            Walk around and explore!
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MiniGameDemo;