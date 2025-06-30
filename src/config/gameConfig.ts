/**
 * Centralized Game Configuration
 * All game constants, thresholds, and tunable parameters in one place
 */

// Movement and Camera Configuration
export const MOVEMENT_CONFIG = {
  MOVEMENT_SPEED: 2, // Player movement speed (1-10 scale)
  CAMERA_PAN_SPEED: 5, // Camera panning speed with arrow keys
  RECENTER_SPEED: 0.1, // Camera recentering speed (0.1 = 10% per frame)
  RECENTER_THRESHOLD: 1, // Stop recentering when offset is within this many pixels
} as const;

// Zoom Configuration
export const ZOOM_CONFIG = {
  MIN_ZOOM: 0.5,
  MAX_ZOOM: 2.0,
  ZOOM_STEP: 0.1,
  DEFAULT_ZOOM: 1.0,
} as const;

// Map and Collision Configuration
export const MAP_CONFIG = {
  MAP_WIDTH: 2048,
  MAP_HEIGHT: 1342,
  PLAYER_WIDTH: 32,
  PLAYER_HEIGHT: 32,
} as const;

// Animation Timing Configuration
export const ANIMATION_CONFIG = {
  // Loading screen
  LOADING_DURATION: 3000, // 3 seconds
  LOADING_PROGRESS_INTERVAL: 150, // Progress update interval
  
  // Character animation
  CHARACTER_FRAME_INTERVAL: 100, // Milliseconds between animation frames
  
  // UI transitions
  MODAL_TRANSITION_DURATION: 300, // Modal open/close animation
  BADGE_NOTIFICATION_DURATION: 5000, // Badge notification display time
  SUCCESS_ANIMATION_DURATION: 3000, // Activity submission success animation
  
  // Carousel
  CAROUSEL_TRANSITION_DURATION: 400, // Avatar carousel slide transition
  
  // Button interactions
  BUTTON_PRESS_DURATION: 100, // Button press animation
  
  // Hover effects
  HOVER_TRANSITION_DURATION: 200, // General hover transition duration
  
  // Framer Motion Spring Configuration
  SPRING_CONFIG: {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  },
} as const;

// Interaction and Proximity Configuration
export const INTERACTION_CONFIG = {
  HOUSE_INTERACTION_DISTANCE: 64, // Distance to interact with houses
  OBJECT_PROXIMITY_DISTANCE: 96, // Distance to show interaction prompts
  DRAG_THRESHOLD: 60, // Minimum drag distance to trigger carousel movement
} as const;

// Game Progression Configuration
export const PROGRESSION_CONFIG = {
  ACTIVITIES_PER_HOUSE_LEVEL: 10, // Activities needed for house level upgrade
  ACTIVITIES_PER_AVATAR_LEVEL: 15, // Activities needed for avatar level upgrade
  MAX_HOUSE_LEVEL: 3,
  MAX_AVATAR_LEVEL: 5,
  
  // Player level thresholds
  LEVEL_THRESHOLDS: {
    FIRST_ACTIVITY: 1, // Level 1 after first activity
    LEVEL_2: 15, // Level 2 after 15 activities
    LEVEL_3: 30, // Level 3 after 30 activities
    LEVEL_4: 50, // Level 4 after 50 activities
  },
} as const;

// UI Configuration
export const UI_CONFIG = {
  // Form validation
  MAX_ACTIVITY_LENGTH: 250, // Maximum characters for activity description
  MIN_SCREEN_WIDTH: 1280, // Minimum recommended screen width
  MIN_SCREEN_HEIGHT: 720, // Minimum recommended screen height
  
  // Carousel
  CAROUSEL_ITEM_SPACING: 160, // Spacing between carousel items
  CAROUSEL_EXTENDED_MULTIPLIER: 3, // How many times to extend carousel for infinite scroll
  
  // Loading progress
  LOADING_PROGRESS_MIN_INCREMENT: 5, // Minimum progress increment
  LOADING_PROGRESS_MAX_INCREMENT: 15, // Maximum progress increment
} as const;

// Visual Effects Configuration
export const EFFECTS_CONFIG = {
  // Particle counts
  INTRO_PARTICLES: 30, // Number of background particles on intro screen
  LOADING_PARTICLES: 20, // Number of particles on loading screen
  
  // Glow and shadow effects
  SHADOW_PIXEL_OFFSET: 4, // Pixel shadow offset
  GLOW_INTENSITY: 0.8, // Glow effect intensity
  
  // House effects
  HOUSE_SCALE_NEARBY: 1.1, // Scale factor when player is nearby
  HOUSE_GLOW_OPACITY: 0.2, // Player house glow opacity
} as const;

// Accessibility Configuration
export const ACCESSIBILITY_CONFIG = {
  // Focus management
  FOCUS_TRAP_ENABLED: true, // Enable focus trapping in modals
  FOCUS_VISIBLE_OUTLINE: '2px solid #6366f1', // Focus outline style
  
  // Keyboard navigation
  KEYBOARD_NAVIGATION_ENABLED: true, // Enable keyboard navigation
  ESCAPE_KEY_CLOSES_MODALS: true, // ESC key closes modals
  
  // Screen reader
  ANNOUNCE_LEVEL_CHANGES: true, // Announce level changes to screen readers
  ANNOUNCE_BADGE_EARNED: true, // Announce new badges to screen readers
} as const;

// Error Fallback Configuration
export const FALLBACK_CONFIG = {
  // Default sprite configuration for error cases
  DEFAULT_SPRITE: {
    spritePath: '/lv1_male_civilian.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 6,
    rowCount: 4,
    scale: 2,
    offsetX: 0,
    offsetY: 0,
    directionMap: {
      down: 0,
      left: 1,
      right: 2,
      up: 3,
    },
  },
  
  // Fallback avatar info
  DEFAULT_AVATAR_NAME: 'Default Avatar',
  DEFAULT_PLAYER_NAME: 'Player',
  
  // Error messages
  SPRITE_LOAD_ERROR: 'Unable to load character sprite',
  AVATAR_DATA_ERROR: 'Avatar data unavailable',
} as const;

// Export all configurations as a single object for easy importing
export const GAME_CONFIG = {
  MOVEMENT: MOVEMENT_CONFIG,
  ZOOM: ZOOM_CONFIG,
  MAP: MAP_CONFIG,
  ANIMATION: ANIMATION_CONFIG,
  INTERACTION: INTERACTION_CONFIG,
  PROGRESSION: PROGRESSION_CONFIG,
  UI: UI_CONFIG,
  EFFECTS: EFFECTS_CONFIG,
  ACCESSIBILITY: ACCESSIBILITY_CONFIG,
  FALLBACK: FALLBACK_CONFIG,
} as const;

// Type exports for TypeScript support
export type GameConfig = typeof GAME_CONFIG;
export type MovementConfig = typeof MOVEMENT_CONFIG;
export type ZoomConfig = typeof ZOOM_CONFIG;
export type MapConfig = typeof MAP_CONFIG;
export type AnimationConfig = typeof ANIMATION_CONFIG;
export type InteractionConfig = typeof INTERACTION_CONFIG;
export type ProgressionConfig = typeof PROGRESSION_CONFIG;
export type UIConfig = typeof UI_CONFIG;
export type EffectsConfig = typeof EFFECTS_CONFIG;
export type AccessibilityConfig = typeof ACCESSIBILITY_CONFIG;
export type FallbackConfig = typeof FALLBACK_CONFIG;