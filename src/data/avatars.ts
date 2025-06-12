export interface AvatarStage {
  level: number;
  name: string;
  spritePath: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  rowCount: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  unlockRequirement?: {
    type: 'activities' | 'badges' | 'weeks';
    count: number;
  };
}

export interface Avatar {
  id: number;
  name: string;
  category: 'civilian' | 'warrior' | 'mage' | 'rogue' | 'noble';
  locked: boolean;
  unlockRequirement?: {
    type: 'activities' | 'badges' | 'weeks';
    count: number;
  };
  stages: AvatarStage[];
}

export const avatars: Avatar[] = [
  {
    id: 1,
    name: 'Male Civilian',
    category: 'civilian',
    locked: false,
    stages: [
      {
        level: 1,
        name: 'Male Civilian',
        spritePath: '/lv1_male_civilian.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
      },
      {
        level: 2,
        name: 'Swordsman',
        spritePath: '/lv2_swordsman.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
        unlockRequirement: {
          type: 'activities',
          count: 15,
        },
      },
    ],
  },
  {
    id: 2,
    name: 'Female Civilian',
    category: 'civilian',
    locked: false, // Unlocked
    stages: [
      {
        level: 1,
        name: 'Female Civilian',
        spritePath: '/lv1_female_civilian.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
      },
      {
        level: 2,
        name: 'Swordswoman',
        spritePath: '/lv2_swordswoman.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
        unlockRequirement: {
          type: 'activities',
          count: 15,
        },
      },
    ],
  },
  {
    id: 5,
    name: 'Slime',
    category: 'mage',
    locked: false, // Unlocked and moved to front
    stages: [
      {
        level: 1,
        name: 'Slime',
        spritePath: '/lv1_slime.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 8,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
      },
      {
        level: 3,
        name: 'Bone Bobba',
        spritePath: '/lv3_bone_bobba.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 8,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
        unlockRequirement: {
          type: 'weeks',
          count: 4,
        },
      },
      {
        level: 5,
        name: 'Lava Lime',
        spritePath: '/lv5_lava_lime.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 8,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
        unlockRequirement: {
          type: 'weeks',
          count: 6,
        },
      },
    ],
  },
  {
    id: 3,
    name: 'Orc',
    category: 'warrior',
    locked: true, // Moved to back
    unlockRequirement: {
      type: 'activities',
      count: 25,
    },
    stages: [
      {
        level: 3,
        name: 'Orc',
        spritePath: '/lv3_orc.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
      },
      {
        level: 4,
        name: 'Sage Orc',
        spritePath: '/lv4_sage_orc.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
        unlockRequirement: {
          type: 'activities',
          count: 30,
        },
      },
      {
        level: 5,
        name: 'Orc Shaman',
        spritePath: '/lv5_orc_shaman.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
        unlockRequirement: {
          type: 'activities',
          count: 45,
        },
      },
    ],
  },
  {
    id: 4,
    name: 'Vampire',
    category: 'noble',
    locked: true, // Moved to back
    unlockRequirement: {
      type: 'badges',
      count: 3,
    },
    stages: [
      {
        level: 3,
        name: 'Vampire',
        spritePath: '/lv3_vampire.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
      },
      {
        level: 4,
        name: 'Blue Dracula',
        spritePath: '/lv4_blue_dracula.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
        unlockRequirement: {
          type: 'badges',
          count: 5,
        },
      },
      {
        level: 5,
        name: 'Count Dracula',
        spritePath: '/lv5_count_dracula.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
        unlockRequirement: {
          type: 'badges',
          count: 8,
        },
      },
    ],
  },
];

// Helper functions for easy access
export const getAvatarById = (id: number): Avatar | undefined => {
  return avatars.find(avatar => avatar.id === id);
};

export const getAvatarStage = (avatarId: number, level: number = 1): AvatarStage | undefined => {
  const avatar = getAvatarById(avatarId);
  if (!avatar) return undefined;
  
  // Find the exact level or the closest available level
  const exactStage = avatar.stages.find(stage => stage.level === level);
  if (exactStage) return exactStage;
  
  // If exact level not found, return the highest available level that's <= requested level
  const availableStages = avatar.stages.filter(stage => stage.level <= level);
  if (availableStages.length > 0) {
    return availableStages.sort((a, b) => b.level - a.level)[0];
  }
  
  // Fallback to first stage
  return avatar.stages[0];
};

export const getAvailableAvatars = (): Avatar[] => {
  return avatars.filter(avatar => !avatar.locked);
};

export const getAllAvatarIds = (): number[] => {
  return avatars.map(avatar => avatar.id);
};

export const getNextAvatarStage = (avatarId: number, currentLevel: number): AvatarStage | undefined => {
  const avatar = getAvatarById(avatarId);
  if (!avatar) return undefined;
  
  const nextStage = avatar.stages.find(stage => stage.level > currentLevel);
  return nextStage;
};

// New helper functions for HUD improvements
export const getPortraitPath = (avatarId: number): string => {
  return `/portraits/avatar_${avatarId}_portrait.png`;
};

export const getAvatarSpriteFallbackInfo = (avatarId: number): {
  spritePath: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  rowCount: number;
} | undefined => {
  const avatar = getAvatarById(avatarId);
  if (!avatar || !avatar.stages.length) return undefined;
  
  const stage = avatar.stages[0]; // Use first stage as fallback
  return {
    spritePath: stage.spritePath,
    frameWidth: stage.frameWidth,
    frameHeight: stage.frameHeight,
    frameCount: stage.frameCount,
    rowCount: stage.rowCount,
  };
};