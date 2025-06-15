import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type ReactionType = '👏' | '🔥' | '💡' | '❤️' | '🎯' | '⭐';

export interface Comment {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  replies?: Comment[];
}

export interface Reaction {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  type: ReactionType;
  timestamp: string;
}

interface InteractionsState {
  comments: Comment[];
  reactions: Reaction[];
}

const initialState: InteractionsState = {
  comments: [
    {
      id: uuidv4(),
      activityId: 'sample-activity-1',
      userId: 'user-2',
      userName: 'Taylor',
      text: 'Great work on the user research! This will really help with our portal design.',
      timestamp: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      activityId: 'sample-activity-1',
      userId: 'user-3',
      userName: 'Morgan',
      text: 'Love the thoroughness of this research. Can you share the key insights?',
      timestamp: new Date().toISOString(),
    },
  ],
  reactions: [
    {
      id: uuidv4(),
      activityId: 'sample-activity-1',
      userId: 'user-2',
      userName: 'Taylor',
      type: '👏',
      timestamp: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      activityId: 'sample-activity-1',
      userId: 'user-3',
      userName: 'Morgan',
      type: '🔥',
      timestamp: new Date().toISOString(),
    },
  ],
};

const interactionsSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<Omit<Comment, 'id' | 'timestamp'>>) => {
      const newComment = {
        ...action.payload,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
      };
      state.comments.push(newComment);
    },
    addReaction: (state, action: PayloadAction<Omit<Reaction, 'id' | 'timestamp'>>) => {
      // Check if user already reacted with this type to this activity
      const existingReaction = state.reactions.find(
        reaction => 
          reaction.activityId === action.payload.activityId && 
          reaction.userId === action.payload.userId &&
          reaction.type === action.payload.type
      );
      
      if (existingReaction) {
        // Remove existing reaction (toggle off)
        state.reactions = state.reactions.filter(reaction => reaction.id !== existingReaction.id);
      } else {
        // Add new reaction
        const newReaction = {
          ...action.payload,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
        };
        state.reactions.push(newReaction);
      }
    },
    removeReaction: (state, action: PayloadAction<{ activityId: string; userId: string; type: ReactionType }>) => {
      const { activityId, userId, type } = action.payload;
      state.reactions = state.reactions.filter(
        reaction => !(reaction.activityId === activityId && reaction.userId === userId && reaction.type === type)
      );
    },
    deleteComment: (state, action: PayloadAction<string>) => {
      state.comments = state.comments.filter(comment => comment.id !== action.payload);
    },
  },
});

export const { addComment, addReaction, removeReaction, deleteComment } = interactionsSlice.actions;
export default interactionsSlice.reducer;