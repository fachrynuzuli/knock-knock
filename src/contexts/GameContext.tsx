import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePlayerInfo } from '../store/slices/teammatesSlice';
import { RootState } from '../store';

interface GameContextType {
  playerName: string;
  playerAvatar: number;
  playerAvatarLevel: number;
  setPlayerName: (name: string) => void;
  setPlayerAvatar: (avatar: number) => void;
  currentWeek: string;
  setCurrentWeek: (week: string) => void;
  isFormOpen: boolean;
  openForm: () => void;
  closeForm: () => void;
  viewingTeammate: string | null;
  setViewingTeammate: (name: string | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const [playerName, setPlayerNameState] = useState('Player');
  const [playerAvatar, setPlayerAvatarState] = useState(1);
  const [currentWeek, setCurrentWeek] = useState('Week 1');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingTeammate, setViewingTeammate] = useState<string | null>(null);

  // Get player's avatar level from Redux store
  const playerData = useSelector((state: RootState) => 
    state.teammates.items.find(teammate => teammate.isPlayer)
  );
  const playerAvatarLevel = playerData?.avatarLevel || 1;

  // Load saved player data from localStorage on initialization
  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    const savedAvatar = localStorage.getItem('playerAvatar');
    
    if (savedName) {
      setPlayerNameState(savedName);
    }
    
    if (savedAvatar) {
      const avatarId = parseInt(savedAvatar, 10);
      if (!isNaN(avatarId)) {
        setPlayerAvatarState(avatarId);
      }
    }
    
    // Update Redux store with saved data
    if (savedName || savedAvatar) {
      dispatch(updatePlayerInfo({ 
        name: savedName || 'Player', 
        avatarId: savedAvatar ? parseInt(savedAvatar, 10) : 1 
      }));
    }
  }, [dispatch]);

  const setPlayerName = (name: string) => {
    console.log('GameContext: Setting player name to:', name, 'Current avatar:', playerAvatar, 'Current level:', playerAvatarLevel);
    setPlayerNameState(name);
    dispatch(updatePlayerInfo({ name, avatarId: playerAvatar }));
    // Save to localStorage
    localStorage.setItem('playerName', name);
  };

  const setPlayerAvatar = (avatar: number) => {
    console.log('GameContext: Setting player avatar to:', avatar, 'Current name:', playerName, 'Current level:', playerAvatarLevel);
    setPlayerAvatarState(avatar);
    dispatch(updatePlayerInfo({ name: playerName, avatarId: avatar }));
    // Save to localStorage
    localStorage.setItem('playerAvatar', avatar.toString());
  };

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const value = {
    playerName,
    setPlayerName,
    playerAvatar,
    setPlayerAvatar,
    playerAvatarLevel,
    currentWeek,
    setCurrentWeek,
    isFormOpen,
    openForm,
    closeForm,
    viewingTeammate,
    setViewingTeammate,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};