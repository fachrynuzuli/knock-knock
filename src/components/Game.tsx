import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updatePlayerPosition, toggleActivityForm, toggleLeaderboard } from '../store/slices/gameStateSlice';
import { useGameContext } from '../contexts/GameContext';

import GameMap from './GameMap';
import Player from './Player';
import ActivityBoard from './ActivityBoard';
import ActivityForm from './ActivityForm';
import Leaderboard from './Leaderboard';
import GameHUD from './GameHUD';

const Game: React.FC = () => {
  const dispatch = useDispatch();
  const { playerName, playerAvatar, isFormOpen, openForm, closeForm, viewingTeammate, setViewingTeammate } = useGameContext();
  const { playerPosition, isLeaderboardOpen } = useSelector((state: RootState) => state.gameState);
  const teammates = useSelector((state: RootState) => state.teammates.items);
  
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});
  const [interactionPrompt, setInteractionPrompt] = useState<{show: boolean, message: string, x: number, y: number}>({
    show: false,
    message: '',
    x: 0,
    y: 0
  });
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
      
      if ((e.key === 'e' || e.key === ' ') && interactionPrompt.show) {
        const nearbyTeammate = teammates.find(teammate => {
          const dx = Math.abs((playerPosition.x) - (teammate.housePosition.x + 32));
          const dy = Math.abs((playerPosition.y) - (teammate.housePosition.y + 32));
          return dx < 64 && dy < 64;
        });
        
        if (nearbyTeammate) {
          setViewingTeammate(nearbyTeammate.name);
        } else {
          const playerHouse = {
            x: 782,
            y: 232
          };
          
          const dx = Math.abs((playerPosition.x) - (playerHouse.x + 32));
          const dy = Math.abs((playerPosition.y) - (playerHouse.y + 32));
          
          if (dx < 64 && dy < 64) {
            openForm();
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
    const moveSpeed = 5;
    
    const moveInterval = setInterval(() => {
      let newX = playerPosition.x;
      let newY = playerPosition.y;
      
      if ((keysPressed.w || keysPressed.arrowup) && playerPosition.y > 24) {
        newY -= moveSpeed;
      }
      if ((keysPressed.s || keysPressed.arrowdown) && playerPosition.y < 696) {
        newY += moveSpeed;
      }
      if ((keysPressed.a || keysPressed.arrowleft) && playerPosition.x > 16) {
        newX -= moveSpeed;
      }
      if ((keysPressed.d || keysPressed.arrowright) && playerPosition.x < 1264) {
        newX += moveSpeed;
      }
      
      if (newX !== playerPosition.x || newY !== playerPosition.y) {
        dispatch(updatePlayerPosition({ x: newX, y: newY }));
      }
      
      const playerHouse = {
        x: 782,
        y: 232
      };
      
      let foundInteraction = false;
      
      const dxPlayer = Math.abs((newX) - (playerHouse.x + 32));
      const dyPlayer = Math.abs((newY) - (playerHouse.y + 32));
      
      if (dxPlayer < 64 && dyPlayer < 64) {
        setInteractionPrompt({
          show: true,
          message: 'Press E to update your board',
          x: playerHouse.x,
          y: playerHouse.y - 40
        });
        foundInteraction = true;
      }
      
      if (!foundInteraction) {
        for (const teammate of teammates) {
          const dx = Math.abs((newX) - (teammate.housePosition.x + 32));
          const dy = Math.abs((newY) - (teammate.housePosition.y + 32));
          
          if (dx < 64 && dy < 64) {
            setInteractionPrompt({
              show: true,
              message: `Press E to view ${teammate.name}'s board`,
              x: teammate.housePosition.x,
              y: teammate.housePosition.y - 40
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
  }, [keysPressed, playerPosition, dispatch, teammates]);
  
  return (
    <div className="relative bg-gray-900 w-full h-full max-w-[1280px] max-h-[720px] aspect-video mx-auto my-auto overflow-hidden">
      <GameMap />
      
      <Player
        position={playerPosition}
        avatarId={playerAvatar}
        name={playerName}
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
      
      {teammates.map((teammate) => (
        <div 
          key={teammate.id}
          className="absolute"
          style={{
            left: `${teammate.housePosition.x}px`,
            top: `${teammate.housePosition.y}px`,
          }}
        >
          <div className="house" style={{ width: '64px', height: '64px' }}>
            <img 
              src={`/houses/house-${teammate.houseType}-level-${teammate.houseLevel}.png`}
              alt={`${teammate.name}'s house`}
              className="pixel-art opacity-0"
              style={{ width: '64px', height: '64px' }}
            />
            <div className="text-white text-xs font-pixel text-center mt-1">{teammate.name}</div>
          </div>
        </div>
      ))}
      
      <div 
        className="absolute"
        style={{
          left: '750px',
          top: '200px',
        }}
      >
        <div className="house" style={{ width: '64px', height: '64px' }}>
          <img 
            src="/houses/house-0-level-1.png"
            alt="Your house"
            className="pixel-art opacity-0"
            style={{ width: '64px', height: '64px' }}
          />
          <div className="text-white text-xs font-pixel text-center mt-1">{playerName}</div>
        </div>
      </div>
      
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
      
      <GameHUD />
      
      {isFormOpen && <ActivityForm onClose={closeForm} />}
      
      {viewingTeammate && (
        <ActivityBoard 
          teammate={viewingTeammate} 
          onClose={() => setViewingTeammate(null)} 
        />
      )}
      
      {isLeaderboardOpen && <Leaderboard />}
    </div>
  );
};

export default Game;