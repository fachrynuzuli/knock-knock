import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type BadgeType = 
  | 'first_submission'
  | 'early_bird'
  | 'pride_champion'
  | 'consistent_reporter'
  | 'team_player'
  | 'detailed_reporter'
  | 'helpful_commenter'
  | 'reaction_master'
  | 'supportive_teammate';

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  earnedAt: string;
  earnedBy: string;
}

interface BadgesState {
  items: Badge[];
  currentNotification: Badge | null;
}

const initialState: BadgesState = {
  items: [],
  currentNotification: null
};

const badgesSlice = createSlice({
  name: 'badges',
  initialState,
  reducers: {
    addBadge: (state, action: PayloadAction<Omit<Badge, 'id' | 'earnedAt'>>) => {
      const newBadge = {
        ...action.payload,
        id: uuidv4(),
        earnedAt: new Date().toISOString()
      };
      state.items.push(newBadge);
      state.currentNotification = newBadge;
    },
    clearBadgeNotification: (state) => {
      state.currentNotification = null;
    }
  }
});

export const { addBadge, clearBadgeNotification } = badgesSlice.actions;
export default badgesSlice.reducer;