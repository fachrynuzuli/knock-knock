import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Position {
  x: number;
  y: number;
}

interface GameStateState {
  playerPosition: Position | null; // Changed to allow null for dynamic initialization
  currentDate: string; // Changed to string for Redux serialization
  currentWeek: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday) to match JavaScript Date
  playerHouseLevel: number;
  isFormOpen: boolean;
  isLeaderboardOpen: boolean;
}

// Helper function to get week string from date
const getWeekString = (date: Date): string => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return `Week ${weekNumber}`;
};

// Helper function to check if date is a weekday (Monday-Friday)
const isWeekday = (date: Date): boolean => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday = 1, Friday = 5
};

// Helper function to get next weekday
const getNextWeekday = (date: Date): Date => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  // If it's Saturday (6), skip to Monday
  if (nextDay.getDay() === 6) {
    nextDay.setDate(nextDay.getDate() + 2);
  }
  // If it's Sunday (0), skip to Monday
  else if (nextDay.getDay() === 0) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
};

const now = new Date();
const initialState: GameStateState = {
  playerPosition: null, // Start as null - will be set dynamically based on house
  currentDate: now.toISOString(), // Convert to string for serialization
  currentWeek: getWeekString(now),
  dayOfWeek: now.getDay(), // 0-6 (Sunday-Saturday)
  playerHouseLevel: 1,
  isFormOpen: false,
  isLeaderboardOpen: false,
};

const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
    updatePlayerPosition: (state, action: PayloadAction<Position>) => {
      state.playerPosition = action.payload;
    },
    initializeGameTime: (state) => {
      const now = new Date();
      state.currentDate = now.toISOString(); // Convert to string
      state.currentWeek = getWeekString(now);
      state.dayOfWeek = now.getDay();
    },
    setCurrentWeek: (state, action: PayloadAction<string>) => {
      state.currentWeek = action.payload;
    },
    setDayOfWeek: (state, action: PayloadAction<number>) => {
      state.dayOfWeek = action.payload;
    },
    incrementDay: (state) => {
      const currentDate = new Date(state.currentDate); // Convert from string to Date
      const nextDay = getNextWeekday(currentDate);
      
      state.currentDate = nextDay.toISOString(); // Convert back to string
      state.dayOfWeek = nextDay.getDay();
      state.currentWeek = getWeekString(nextDay);
    },
    upgradeHouse: (state) => {
      if (state.playerHouseLevel < 3) {
        state.playerHouseLevel += 1;
      }
    },
    toggleActivityForm: (state) => {
      state.isFormOpen = !state.isFormOpen;
    },
    toggleLeaderboard: (state) => {
      state.isLeaderboardOpen = !state.isLeaderboardOpen;
    },
  },
});

export const {
  updatePlayerPosition,
  initializeGameTime,
  setCurrentWeek,
  setDayOfWeek,
  incrementDay,
  upgradeHouse,
  toggleActivityForm,
  toggleLeaderboard,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;