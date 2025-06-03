export interface SpriteConfig {
  path: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  idleFrame: number;
}

export const spriteConfig: Record<number, SpriteConfig> = {
  1: {
    path: '/Unarmed_Walk_full.png',
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 6,
    idleFrame: 1,
  },
  2: {
    path: '/suittie_walk_full.png',
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 6,
    idleFrame: 1,
  },
  3: {
    path: '/orc1_walk_full.png',
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 6,
    idleFrame: 1,
  },
  4: {
    path: '/Vampires1_Walk_full.png',
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 6,
    idleFrame: 1,
  },
  5: {
    path: '/orc2_walk_full.png',
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 6,
    idleFrame: 1,
  },
  6: {
    path: '/Vampires2_Walk_full.png',
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 6,
    idleFrame: 1,
  },
  7: {
    path: '/orc3_walk_full.png',
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 6,
    idleFrame: 1,
  }
};