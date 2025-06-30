import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updatePlayerPosition } from '../store/slices/gameStateSlice';
import { useGameContext } from '../contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Maximize2, RotateCcw, X, MessageCircle, Plus } from 'lucide-react';

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
  scale = 1.0, // Changed from 0.4 to 1.0 for 4x bigger appearance
  autoPlay = false,
  demoMode = true 
}) => {
  const dispatch = useDispatch();
  const { playerName } = useGameContext();
  
  // Demo-specific state
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [demoPlayerPosition, setDemoPlayerPosition] = useState({ x: 400, y: 300 });
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 }); // NEW: Camera panning
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});
  const [interactionPrompt, setInteractionPrompt] = useState<{show: boolean, message: string, target?: any}>({
    show: false,
    message: ''
  });
  
  // NEW: Modal states for interactions
  const [showActivityBoard, setShowActivityBoard] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [viewingTeammate, setViewingTeammate] = useState<any>(null);
  const [demoActivities, setDemoActivities] = useState([
    { id: '1', text: 'Completed user research for new portal', category: 'project', priority: 1 },
    { id: '2', text: 'Fixed critical bug in payment system', category: 'adhoc', priority: 2 },
    { id: '3', text: 'Weekly team standup meetings', category: 'routine', priority: 3 }
  ]);

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
    },
    {
      id: 'demo-taylor',
      name: 'Taylor',
      avatarId: 3,
      avatarLevel: 1,
      playerLevel: 3,
      houseLevel: 1,
      housePosition: { x: 1000, y: 300 },
      houseType: 2,
      stats: { projectCount: 8, adhocCount: 6, routineCount: 4, totalActivities: 18 }
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
            : `Press E to view ${teammate.name}'s board`,
          target: teammate
        };
      }
    }

    const nearbyObject = checkProximity(playerX, playerY, INTERACTION_CONFIG.OBJECT_PROXIMITY_DISTANCE);
    if (nearbyObject?.type === 'townHall') {
      return {
        show: true,
        message: 'Press E to enter Town Hall',
        target: 'townhall'
      };
    }

    return { show: false, message: '' };
  };

  // NEW: Calculate camera position to follow player
  const calculateCameraPosition = () => {
    const viewportWidth = 800; // Fixed demo viewport width
    const viewportHeight = 600; // Fixed demo viewport height
    
    // Center camera on player, then apply manual offset from arrow keys
    let cameraX = demoPlayerPosition.x - viewportWidth / 2 + cameraOffset.x;
    let cameraY = demoPlayerPosition.y - viewportHeight / 2 + cameraOffset.y;
    
    // Clamp camera to map boundaries
    cameraX = Math.max(0, Math.min(MAP_CONFIG.MAP_WIDTH - viewportWidth, cameraX));
    cameraY = Math.max(0, Math.min(MAP_CONFIG.MAP_HEIGHT - viewportHeight, cameraY));
    
    return { x: cameraX, y: cameraY };
  };

  // Demo movement and camera system
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'e', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
        setKeysPressed(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
      }
      
      // Handle interactions
      if ((e.key === 'e' || e.key === ' ') && interactionPrompt.show && interactionPrompt.target) {
        if (typeof interactionPrompt.target === 'object') {
          // House interaction
          if (interactionPrompt.target.isPlayer) {
            setShowActivityForm(true);
          } else {
            setViewingTeammate(interactionPrompt.target);
            setShowActivityBoard(true);
          }
        } else if (interactionPrompt.target === 'townhall') {
          // Town hall interaction - could show analytics
          alert('🏛️ Welcome to Town Hall! (Analytics would open in full game)');
        }
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
  }, [isPlaying, interactionPrompt]);

  // Movement loop for demo
  useEffect(() => {
    if (!isPlaying) return;

    const moveInterval = setInterval(() => {
      let newX = demoPlayerPosition.x;
      let newY = demoPlayerPosition.y;
      let newCameraOffsetX = cameraOffset.x;
      let newCameraOffsetY = cameraOffset.y;
      
      // WASD for player movement
      if (keysPressed.w) {
        const testY = demoPlayerPosition.y - MOVEMENT_CONFIG.MOVEMENT_SPEED;
        if (canMoveTo(demoPlayerPosition.x, testY)) {
          newY = testY;
        }
      }
      if (keysPressed.s) {
        const testY = demoPlayerPosition.y + MOVEMENT_CONFIG.MOVEMENT_SPEED;
        if (canMoveTo(demoPlayerPosition.x, testY)) {
          newY = testY;
        }
      }
      if (keysPressed.a) {
        const testX = demoPlayerPosition.x - MOVEMENT_CONFIG.MOVEMENT_SPEED;
        if (canMoveTo(testX, demoPlayerPosition.y)) {
          newX = testX;
        }
      }
      if (keysPressed.d) {
        const testX = demoPlayerPosition.x + MOVEMENT_CONFIG.MOVEMENT_SPEED;
        if (canMoveTo(testX, demoPlayerPosition.y)) {
          newX = testX;
        }
      }
      
      // NEW: Arrow keys for camera panning (independent of player movement)
      if (keysPressed.arrowup) {
        newCameraOffsetY -= MOVEMENT_CONFIG.CAMERA_PAN_SPEED;
      }
      if (keysPressed.arrowdown) {
        newCameraOffsetY += MOVEMENT_CONFIG.CAMERA_PAN_SPEED;
      }
      if (keysPressed.arrowleft) {
        newCameraOffsetX -= MOVEMENT_CONFIG.CAMERA_PAN_SPEED;
      }
      if (keysPressed.arrowright) {
        newCameraOffsetX += MOVEMENT_CONFIG.CAMERA_PAN_SPEED;
      }
      
      if (newX !== demoPlayerPosition.x || newY !== demoPlayerPosition.y) {
        setDemoPlayerPosition({ x: newX, y: newY });
      }
      
      if (newCameraOffsetX !== cameraOffset.x || newCameraOffsetY !== cameraOffset.y) {
        setCameraOffset({ x: newCameraOffsetX, y: newCameraOffsetY });
      }
      
      // Update interaction prompt
      const prompt = getInteractionPrompt(newX, newY);
      setInteractionPrompt(prompt);
      
    }, 16);
    
    return () => clearInterval(moveInterval);
  }, [keysPressed, demoPlayerPosition, cameraOffset, isPlaying]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setDemoPlayerPosition({ x: 400, y: 300 });
    setCameraOffset({ x: 0, y: 0 });
    setKeysPressed({});
    setInteractionPrompt({ show: false, message: '' });
    setShowActivityBoard(false);
    setShowActivityForm(false);
    setViewingTeammate(null);
  };

  const handleAddActivity = (text: string, category: string) => {
    const newActivity = {
      id: Date.now().toString(),
      text,
      category,
      priority: demoActivities.length + 1
    };
    setDemoActivities([...demoActivities, newActivity]);
    setShowActivityForm(false);
  };

  const cameraPosition = calculateCameraPosition();
  const scaledMapWidth = 600; // Fixed demo size
  const scaledMapHeight = 600; // Fixed demo size

  return (
    <div className="relative bg-gray-800 rounded-2xl overflow-hidden border-4 border-primary-600 shadow-2xl glow-border">
      {/* Game Container - NOW 4X BIGGER! */}
      <div 
        className="relative bg-gray-900 overflow-hidden"
        style={{
          width: `${scaledMapWidth}px`,
          height: `${scaledMapHeight}px`,
          maxWidth: '100%'
        }}
      >
        {/* Game World with Camera System */}
        <div 
          className="absolute"
          style={{
            width: `${MAP_CONFIG.MAP_WIDTH}px`,
            height: `${MAP_CONFIG.MAP_HEIGHT}px`,
            transform: `translate(-${cameraPosition.x}px, -${cameraPosition.y}px) scale(${scale})`,
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
              keysPressed.w || keysPressed.a || keysPressed.s || keysPressed.d
            }
            direction={
              keysPressed.w ? 'up' :
              keysPressed.s ? 'down' :
              keysPressed.a ? 'left' :
              keysPressed.d ? 'right' : 'down'
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
                isNearby={interactionPrompt.target === teammate}
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
          
          <div className="text-white font-pixel text-xs">
            {isPlaying ? 'WASD: Move | Arrows: Pan Camera | E: Interact' : 'Click Play to try the demo'}
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
          <div className="text-primary-400 font-pixel text-xs mb-1">🎮 LIVE DEMO - 4X ZOOM!</div>
          <div className="text-white font-pixel text-xs space-y-1">
            <div>🚶 WASD: Move around</div>
            <div>📹 Arrows: Pan camera</div>
            <div>🏠 E: Interact with houses</div>
          </div>
        </motion.div>
      )}

      {/* NEW: Activity Board Modal */}
      <AnimatePresence>
        {showActivityBoard && viewingTeammate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border-4 border-primary-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-heading text-lg">{viewingTeammate.name}'s Board</h3>
                <button
                  onClick={() => {
                    setShowActivityBoard(false);
                    setViewingTeammate(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-700 p-3 rounded border-l-4 border-success-600">
                  <div className="text-white font-pixel text-sm">✅ Completed user research for new portal</div>
                  <div className="text-success-400 text-xs mt-1">Project • Priority 1</div>
                </div>
                <div className="bg-gray-700 p-3 rounded border-l-4 border-warning-600">
                  <div className="text-white font-pixel text-sm">🔧 Fixed critical payment bug</div>
                  <div className="text-warning-400 text-xs mt-1">Ad Hoc • Priority 2</div>
                </div>
                <div className="bg-gray-700 p-3 rounded border-l-4 border-primary-600">
                  <div className="text-white font-pixel text-sm">📅 Weekly team standup meetings</div>
                  <div className="text-primary-400 text-xs mt-1">Routine • Priority 3</div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-gray-400 font-pixel text-xs">
                  💬 Comments and reactions available in full game!
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW: Activity Form Modal */}
      <AnimatePresence>
        {showActivityForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border-4 border-primary-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-heading text-lg">Add Activity</h3>
                <button
                  onClick={() => setShowActivityForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-pixel text-sm mb-2">What did you accomplish?</label>
                  <textarea
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white font-pixel text-sm"
                    placeholder="Describe your accomplishment..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-white font-pixel text-sm mb-2">Category:</label>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-success-600 text-white rounded font-pixel text-sm">Project</button>
                    <button className="px-3 py-1 bg-gray-600 text-white rounded font-pixel text-sm">Ad Hoc</button>
                    <button className="px-3 py-1 bg-gray-600 text-white rounded font-pixel text-sm">Routine</button>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowActivityForm(false)}
                    className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-pixel text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleAddActivity('Demo activity added!', 'project');
                      alert('🎉 Activity added! (Full functionality in complete game)');
                    }}
                    className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded font-pixel text-sm"
                  >
                    Add Activity
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MiniGameDemo;