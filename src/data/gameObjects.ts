export interface CollidableObject {
  id: string;
  type: 'house' | 'townHall' | 'emptyLand' | 'tree' | 'bush' | 'rock';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  interactable: boolean;
  ownerId?: string; // For houses and future ownership
  houseType?: number; // For houses
  visualStyle?: string; // For different visual representations
}

// Town Hall - Central building for team analytics
export const townHall: CollidableObject = {
  id: 'townhall-1',
  type: 'townHall',
  name: 'Town Hall',
  x: 820,
  y: 420,
  width: 440,
  height: 300,
  interactable: true,
};

// Empty lands available for future development
export const emptyLands: CollidableObject[] = [
  {
    id: 'empty-1',
    type: 'emptyLand',
    name: 'Riverside Plot',
    x: 520,
    y: 450,
    width: 128,
    height: 64,
    interactable: true,
  },
  {
    id: 'empty-2',
    type: 'emptyLand',
    name: 'Hilltop Haven',
    x: 970,
    y: 450,
    width: 128,
    height: 64,
    interactable: true,
  },
  {
    id: 'empty-3',
    type: 'emptyLand',
    name: 'Forest Edge',
    x: 300,
    y: 870,
    width: 128,
    height: 64,
    interactable: true,
  },
  {
    id: 'empty-4',
    type: 'emptyLand',
    name: 'Meadow View',
    x: 1045,
    y: 270,
    width: 128,
    height: 64,
    interactable: true,
  },
  {
    id: 'empty-5',
    type: 'emptyLand',
    name: 'Valley Vista',
    x: 610,
    y: 700,
    width: 128,
    height: 64,
    interactable: true,
  },
  {
    id: 'empty-6',
    type: 'emptyLand',
    name: 'Mountain Peak',
    x: 940,
    y: 870,
    width: 128,
    height: 64,
    interactable: true,
  },
  {
    id: 'empty-7',
    type: 'emptyLand',
    name: 'Lareina Valley',
    x: 650,
    y: 870,
    width: 128,
    height: 64,
    interactable: true,
  },
];

// Trees - Natural barriers that block movement
export const trees: CollidableObject[] = [
  {
    id: 'tree-1',
    type: 'tree',
    name: 'Oak Tree',
    x: 150,
    y: 300,
    width: 64,
    height: 96,
    interactable: false,
    visualStyle: 'oak',
  },
  {
    id: 'tree-2',
    type: 'tree',
    name: 'Pine Tree',
    x: 1800,
    y: 200,
    width: 64,
    height: 128,
    interactable: false,
    visualStyle: 'pine',
  },
  {
    id: 'tree-3',
    type: 'tree',
    name: 'Birch Tree',
    x: 400,
    y: 600,
    width: 48,
    height: 80,
    interactable: false,
    visualStyle: 'birch',
  },
  {
    id: 'tree-4',
    type: 'tree',
    name: 'Maple Tree',
    x: 1600,
    y: 800,
    width: 72,
    height: 100,
    interactable: false,
    visualStyle: 'maple',
  },
  {
    id: 'tree-5',
    type: 'tree',
    name: 'Willow Tree',
    x: 800,
    y: 1000,
    width: 80,
    height: 120,
    interactable: false,
    visualStyle: 'willow',
  },
];

// Bushes - Smaller barriers for path definition
export const bushes: CollidableObject[] = [
  {
    id: 'bush-1',
    type: 'bush',
    name: 'Rose Bush',
    x: 250,
    y: 150,
    width: 32,
    height: 32,
    interactable: false,
    visualStyle: 'rose',
  },
  {
    id: 'bush-2',
    type: 'bush',
    name: 'Hedge Bush',
    x: 1200,
    y: 350,
    width: 48,
    height: 24,
    interactable: false,
    visualStyle: 'hedge',
  },
  {
    id: 'bush-3',
    type: 'bush',
    name: 'Berry Bush',
    x: 600,
    y: 950,
    width: 40,
    height: 28,
    interactable: false,
    visualStyle: 'berry',
  },
  {
    id: 'bush-4',
    type: 'bush',
    name: 'Flower Bush',
    x: 1400,
    y: 600,
    width: 36,
    height: 30,
    interactable: false,
    visualStyle: 'flower',
  },
];

// Rocks - Decorative barriers
export const rocks: CollidableObject[] = [
  {
    id: 'rock-1',
    type: 'rock',
    name: 'Boulder',
    x: 100,
    y: 800,
    width: 64,
    height: 48,
    interactable: false,
    visualStyle: 'boulder',
  },
  {
    id: 'rock-2',
    type: 'rock',
    name: 'Stone Pile',
    x: 1700,
    y: 400,
    width: 48,
    height: 32,
    interactable: false,
    visualStyle: 'pile',
  },
  {
    id: 'rock-3',
    type: 'rock',
    name: 'Crystal Rock',
    x: 900,
    y: 150,
    width: 40,
    height: 56,
    interactable: false,
    visualStyle: 'crystal',
  },
];

// Combined array of all collidable objects
export const allCollidableObjects: CollidableObject[] = [
  townHall,
  ...emptyLands,
  ...trees,
  ...bushes,
  ...rocks,
];

// Helper functions for collision detection and object management
export const getObjectById = (id: string): CollidableObject | undefined => {
  return allCollidableObjects.find(obj => obj.id === id);
};

export const getObjectsByType = (type: CollidableObject['type']): CollidableObject[] => {
  return allCollidableObjects.filter(obj => obj.type === type);
};

export const getInteractableObjects = (): CollidableObject[] => {
  return allCollidableObjects.filter(obj => obj.interactable);
};

export const checkCollision = (
  playerX: number,
  playerY: number,
  playerWidth: number = 32,
  playerHeight: number = 32
): CollidableObject | null => {
  for (const obj of allCollidableObjects) {
    // Simple AABB (Axis-Aligned Bounding Box) collision detection
    if (
      playerX < obj.x + obj.width &&
      playerX + playerWidth > obj.x &&
      playerY < obj.y + obj.height &&
      playerY + playerHeight > obj.y
    ) {
      return obj;
    }
  }
  return null;
};

export const checkProximity = (
  playerX: number,
  playerY: number,
  proximityDistance: number = 64
): CollidableObject | null => {
  for (const obj of getInteractableObjects()) {
    const centerX = obj.x + obj.width / 2;
    const centerY = obj.y + obj.height / 2;
    const distance = Math.sqrt(
      Math.pow(playerX - centerX, 2) + Math.pow(playerY - centerY, 2)
    );
    
    if (distance <= proximityDistance) {
      return obj;
    }
  }
  return null;
};