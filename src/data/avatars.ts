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
    name: 'Civilian',
    category: 'civilian',
    locked: false,
    stages: [
      {
        level: 1,
        name: 'Unarmed Civilian',
        spritePath: '/Unarmed_Walk_full.png',
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
        name: 'Armed Civilian',
        spritePath: '/suittie_walk_full.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
        unlockRequirement: {
          type: 'activities',
          count: 10,
        },
      },
    ],
  },
  {
    id: 3,
    name: 'Orc Warrior',
    category: 'warrior',
    locked: true,
    unlockRequirement: {
      type: 'activities',
      count: 25,
    },
    stages: [
      {
        level: 1,
        name: 'Orc Recruit',
        spritePath: '/orc1_walk_full.png',
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
        name: 'Orc Veteran',
        spritePath: '/orc2_walk_full.png',
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
      {
        level: 3,
        name: 'Orc Champion',
        spritePath: '/orc3_walk_full.png',
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
    ],
  },
  {
    id: 4,
    name: 'Vampire Lord',
    category: 'noble',
    locked: true,
    unlockRequirement: {
      type: 'badges',
      count: 5,
    },
    stages: [
      {
        level: 1,
        name: 'Vampire Initiate',
        spritePath: '/Vampires1_Walk_full.png',
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
        name: 'Vampire Noble',
        spritePath: '/Vampires2_Walk_full.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
        unlockRequirement: {
          type: 'badges',
          count: 3,
        },
      },
    ],
  },
  {
    id: 5,
    name: 'Orc Shaman',
    category: 'mage',
    locked: true,
    unlockRequirement: {
      type: 'weeks',
      count: 4,
    },
    stages: [
      {
        level: 1,
        name: 'Apprentice Shaman',
        spritePath: '/orc2_walk_full.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
      },
    ],
  },
  {
    id: 6,
    name: 'Vampire Noble',
    category: 'noble',
    locked: true,
    unlockRequirement: {
      type: 'activities',
      count: 50,
    },
    stages: [
      {
        level: 1,
        name: 'Vampire Aristocrat',
        spritePath: '/Vampires2_Walk_full.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
      },
    ],
  },
  {
    id: 7,
    name: 'Orc Chief',
    category: 'warrior',
    locked: true,
    unlockRequirement: {
      type: 'activities',
      count: 75,
    },
    stages: [
      {
        level: 1,
        name: 'Orc Warlord',
        spritePath: '/orc3_walk_full.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
        scale: 2,
        offsetX: 0,
        offsetY: 0,
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
  return avatar?.stages.find(stage => stage.level === level) || avatar?.stages[0];
};

export const getAvailableAvatars = (): Avatar[] => {
  return avatars.filter(avatar => !avatar.locked);
};

export const getAllAvatarIds = (): number[] => {
  return avatars.map(avatar => avatar.id);
};