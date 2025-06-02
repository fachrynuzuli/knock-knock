import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type ActivityCategory = 'project' | 'adhoc' | 'routine';
export type ProjectMilestone = 'pre-project' | 'preparation' | 'initiation' | 'realization' | 'finished' | 'go-live';

export interface Activity {
  id: string;
  text: string;
  category: ActivityCategory;
  projectMilestone?: ProjectMilestone;
  priority: number;
  week: string;
  createdBy: string;
  createdAt: string;
}

interface ActivitiesState {
  items: Activity[];
}

const initialState: ActivitiesState = {
  items: [
    {
      id: uuidv4(),
      text: 'Completed user research for new portal',
      category: 'project',
      projectMilestone: 'preparation',
      priority: 1,
      week: 'Week 1',
      createdBy: 'Alex',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      text: 'Helped CEO prepare quarterly presentation',
      category: 'adhoc',
      priority: 2,
      week: 'Week 1',
      createdBy: 'Alex',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      text: 'Weekly status meeting with stakeholders',
      category: 'routine',
      priority: 3,
      week: 'Week 1',
      createdBy: 'Alex',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      text: 'Finalized design specs for mobile app',
      category: 'project',
      projectMilestone: 'realization',
      priority: 1,
      week: 'Week 1',
      createdBy: 'Taylor',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      text: 'Mentored new team member',
      category: 'adhoc',
      priority: 2,
      week: 'Week 1',
      createdBy: 'Taylor',
      createdAt: new Date().toISOString(),
    },
  ],
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    addActivity: (state, action: PayloadAction<Omit<Activity, 'id' | 'createdAt'>>) => {
      const newActivity = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      state.items.push(newActivity);
    },
    updateActivity: (state, action: PayloadAction<{ id: string; updates: Partial<Activity> }>) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex(activity => activity.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
      }
    },
    deleteActivity: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(activity => activity.id !== action.payload);
    },
    reorderActivities: (state, action: PayloadAction<{ createdBy: string; week: string; orderedIds: string[] }>) => {
      const { createdBy, week, orderedIds } = action.payload;
      
      // Filter the activities for the specific user and week
      const activitiesToReorder = state.items.filter(
        activity => activity.createdBy === createdBy && activity.week === week
      );
      
      // Update priorities based on the new order
      orderedIds.forEach((id, index) => {
        const activityIndex = state.items.findIndex(activity => activity.id === id);
        if (activityIndex !== -1) {
          state.items[activityIndex].priority = index + 1;
        }
      });
    },
  },
});

export const { addActivity, updateActivity, deleteActivity, reorderActivities } = activitiesSlice.actions;

export default activitiesSlice.reducer;