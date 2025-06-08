import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Teammate {
  id: string;
  name: string;
  avatarId: number;
  avatarLevel: number; // New field for avatar progression
  houseLevel: number;
  housePosition: {
    x: number;
    y: number;
  };
  houseType: number;
  stats: {
    projectCount: number;
    adhocCount: number;
    routineCount: number;
    totalActivities: number;
  };
  isPlayer?: boolean; // New field to identify the current player
}

interface TeammatesState {
  items: Teammate[];
}

const initialState: TeammatesState = {
  items: [
    {
      id: 'player',
      name: 'Player', // This will be updated when player sets their name
      avatarId: 1,
      avatarLevel: 1,
      houseLevel: 1,
      housePosition: { x: 782, y: 232 },
      houseType: 0,
      isPlayer: true,
      stats: {
        projectCount: 0,
        adhocCount: 0,
        routineCount: 0,
        totalActivities: 0,
      },
    },
    {
      id: '1',
      name: 'Alex',
      avatarId: 1,
      avatarLevel: 2,
      houseLevel: 2,
      housePosition: { x: 375, y: 180 },
      houseType: 1,
      stats: {
        projectCount: 12,
        adhocCount: 5,
        routineCount: 3,
        totalActivities: 20,
      },
    },
    {
      id: '2',
      name: 'Taylor',
      avatarId: 3,
      avatarLevel: 1,
      houseLevel: 1,
      housePosition: { x: 1000, y: 300 },
      houseType: 2,
      stats: {
        projectCount: 8,
        adhocCount: 6,
        routineCount: 4,
        totalActivities: 18,
      },
    },
    {
      id: '3',
      name: 'Prabowski',
      avatarId: 3,
      avatarLevel: 3,
      houseLevel: 3,
      housePosition: { x: 220, y: 520 },
      houseType: 3,
      stats: {
        projectCount: 15,
        adhocCount: 3,
        routineCount: 2,
        totalActivities: 20,
      },
    },
    {
      id: '4',
      name: 'Morgan',
      avatarId: 4,
      avatarLevel: 2,
      houseLevel: 2,
      housePosition: { x: 1210, y: 550 },
      houseType: 4,
      stats: {
        projectCount: 10,
        adhocCount: 7,
        routineCount: 5,
        totalActivities: 22,
      },
    },
  ],
};

const teammatesSlice = createSlice({
  name: 'teammates',
  initialState,
  reducers: {
    addTeammate: (state, action: PayloadAction<Omit<Teammate, 'stats' | 'avatarLevel'>>) => {
      const newTeammate = {
        ...action.payload,
        avatarLevel: 1, // Start at level 1
        stats: {
          projectCount: 0,
          adhocCount: 0,
          routineCount: 0,
          totalActivities: 0,
        },
      };
      state.items.push(newTeammate);
    },
    updateTeammate: (state, action: PayloadAction<{ id: string; updates: Partial<Teammate> }>) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex(teammate => teammate.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
      }
    },
    updatePlayerInfo: (state, action: PayloadAction<{ name: string; avatarId: number }>) => {
      const playerIndex = state.items.findIndex(teammate => teammate.isPlayer);
      if (playerIndex !== -1) {
        state.items[playerIndex].name = action.payload.name;
        state.items[playerIndex].avatarId = action.payload.avatarId;
        // Reset avatar level when changing avatar
        state.items[playerIndex].avatarLevel = 1;
      }
    },
    upgradeAvatarLevel: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const index = state.items.findIndex(teammate => teammate.id === id);
      
      if (index !== -1) {
        // Increment avatar level (you can add logic here to check if upgrade is available)
        state.items[index].avatarLevel += 1;
      }
    },
    incrementTeammateStats: (state, action: PayloadAction<{ id: string; category: 'project' | 'adhoc' | 'routine' }>) => {
      const { id, category } = action.payload;
      const index = state.items.findIndex(teammate => teammate.id === id);
      
      if (index !== -1) {
        // Increment the specific category count
        state.items[index].stats[`${category}Count`] += 1;
        // Increment total activities
        state.items[index].stats.totalActivities += 1;
        
        // Check if house level should be upgraded (every 10 activities)
        if (state.items[index].stats.totalActivities % 10 === 0 && state.items[index].houseLevel < 3) {
          state.items[index].houseLevel += 1;
        }
        
        // Check if avatar level should be upgraded (every 15 activities)
        if (state.items[index].stats.totalActivities % 15 === 0) {
          state.items[index].avatarLevel += 1;
        }
      }
    },
  },
});

export const { 
  addTeammate, 
  updateTeammate, 
  updatePlayerInfo, 
  upgradeAvatarLevel,
  incrementTeammateStats 
} = teammatesSlice.actions;

export default teammatesSlice.reducer;