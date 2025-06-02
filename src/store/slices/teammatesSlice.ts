import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Teammate {
  id: string;
  name: string;
  avatarId: number;
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
}

interface TeammatesState {
  items: Teammate[];
}

const initialState: TeammatesState = {
  items: [
    {
      id: '1',
      name: 'Alex',
      avatarId: 1,
      houseLevel: 2,
      housePosition: { x: 90, y: 150 },
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
      avatarId: 2,
      houseLevel: 1,
      housePosition: { x: 500, y: 150 },
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
      name: 'Jordan',
      avatarId: 3,
      houseLevel: 3,
      housePosition: { x: 200, y: 400 },
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
      houseLevel: 2,
      housePosition: { x: 500, y: 400 },
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
    addTeammate: (state, action: PayloadAction<Omit<Teammate, 'stats'>>) => {
      const newTeammate = {
        ...action.payload,
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
      }
    },
  },
});

export const { addTeammate, updateTeammate, incrementTeammateStats } = teammatesSlice.actions;

export default teammatesSlice.reducer;