import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  const [playerName, setPlayerName] = useState('Player');
  const [playerAvatar, setPlayerAvatar] = useState(1);
  const [currentWeek, setCurrentWeek] = useState('Week 1');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingTeammate, setViewingTeammate] = useState<string | null>(null);

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