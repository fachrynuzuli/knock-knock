import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updatePlayerInfo } from '../store/slices/teammatesSlice';

interface GameContextType {
  playerName: string;
  playerAvatar: number;
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

  const setPlayerName = (name: string) => {
    setPlayerNameState(name);
    dispatch(updatePlayerInfo({ name, avatarId: playerAvatar }));
  };

  const setPlayerAvatar = (avatar: number) => {
    setPlayerAvatarState(avatar);
    dispatch(updatePlayerInfo({ name: playerName, avatarId: avatar }));
  };

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const value = {
    playerName,
    setPlayerName,
    playerAvatar,
    setPlayerAvatar,
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