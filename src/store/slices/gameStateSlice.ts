import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Position {
  x: number;
  y: number;
}

interface GameStateState {
  playerPosition: Position;
  currentWeek: string;
  dayOfWeek: number; // 1-5 (Monday-Friday)
  playerHouseLevel: number;
  isFormOpen: boolean;
  isLeaderboardOpen: boolean;
}

const initialState: GameStateState = {
  playerPosition: { x: 650, y: 300 },
  currentWeek: 'Week 1',
  dayOfWeek: 5, // Starting on Friday
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
    setCurrentWeek: (state, action: PayloadAction<string>) => {
      state.currentWeek = action.payload;
    },
    setDayOfWeek: (state, action: PayloadAction<number>) => {
      state.dayOfWeek = action.payload;
    },
    incrementDay: (state) => {
      if (state.dayOfWeek < 5) {
        state.dayOfWeek += 1;
      } else {
        state.dayOfWeek = 1;
        // Increment week
        const weekNumber = parseInt(state.currentWeek.split(' ')[1], 10);
        state.currentWeek = `Week ${weekNumber + 1}`;
      }
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
  setCurrentWeek,
  setDayOfWeek,
  incrementDay,
  upgradeHouse,
  toggleActivityForm,
  toggleLeaderboard,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;