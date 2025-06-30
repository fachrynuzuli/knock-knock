import React, { useState, useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MapPin, Lock, Users, UserPlus, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { getAvatarById, getAllAvatarIds, isAvatarUnlocked, getAvatarUnlockMessage } from '../data/avatars';
import AvatarCarousel from './AvatarCarousel';
import WalkingCharacterAnimation from './WalkingCharacterAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIMATION_CONFIG, EFFECTS_CONFIG, UI_CONFIG, ACCESSIBILITY_CONFIG } from '../config/gameConfig';

interface IntroScreenProps {
  onStartGame: () => void;
}

type ScreenMode = 'initial' | 'create' | 'join' | 'instructions';

const IntroScreen: React.FC<IntroScreenProps> = ({ onStartGame }) => {
  const { setPlayerName, setPlayerAvatar } = useGameContext();
  const [screenMode, setScreenMode] = useState<ScreenMode>('initial');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState(1);
  const [lockedMessage, setLockedMessage] = useState('');
  const [isWaitingApproval, setIsWaitingApproval] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Get player level from Redux store
  const playerData = useSelector((state: RootState) => 
    state.teammates.items.find(teammate => teammate.isPlayer)
  );
  const playerLevel = playerData?.playerLevel || 0;

  // Collapsible sections state for join form
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    access: true,
    character: true,
  });

  const avatarOptions = getAllAvatarIds();

  // Focus management for accessibility
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  // CRITICAL: Strict validation for locked avatars based on player level
  const validateAvatarSelection = (avatarId: number): { isValid: boolean; message?: string } => {
    const avatar = getAvatarById(avatarId);
    
    if (!avatar) {
      return { isValid: false, message: 'Invalid avatar selection. Please choose a different character.' };
    }
    
    if (!isAvatarUnlocked(avatarId, playerLevel)) {
      const unlockMessage = getAvatarUnlockMessage(avatarId, playerLevel);
      return { isValid: false, message: unlockMessage || 'This avatar is locked.' };
    }
    
    return { isValid: true };
  };

  // Enhanced loading simulation with centralized timing
  const simulateLoading = (callback: () => void) => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const increment = Math.random() * UI_CONFIG.LOADING_PROGRESS_MAX_INCREMENT + UI_CONFIG.LOADING_PROGRESS_MIN_INCREMENT;
        const newProgress = Math.min(prev + increment, 100);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            setLoadingProgress(0);
            callback();
          }, 500);
        }
        
        return newProgress;
      });
    }, ANIMATION_CONFIG.LOADING_PROGRESS_INTERVAL);
  };

  // Save user registration data to localStorage
  const saveUserRegistration = (playerName: string, avatarId: number) => {
    localStorage.setItem('hasRegistered', 'true');
    localStorage.setItem('playerName', playerName);
    localStorage.setItem('playerAvatar', avatarId.toString());
    localStorage.setItem('registrationDate', new Date().toISOString());
  };

  const handleStartGame = () => {
    // CRITICAL: Gate-keeping logic - validate everything before proceeding
    if (!name.trim()) {
      setLockedMessage('Please enter your name to continue.');
      setTimeout(() => setLockedMessage(''), ANIMATION_CONFIG.BADGE_NOTIFICATION_DURATION);
      return;
    }

    // CRITICAL: Strict avatar validation based on player level
    const validation = validateAvatarSelection(selectedAvatarId);
    if (!validation.isValid) {
      setLockedMessage(validation.message || 'Invalid avatar selection.');
      setTimeout(() => setLockedMessage(''), ANIMATION_CONFIG.BADGE_NOTIFICATION_DURATION);
      return;
    }

    console.log('AVATAR SELECTION: Starting game with validated avatar:', {
      avatarId: selectedAvatarId,
      avatarName: getAvatarById(selectedAvatarId)?.name,
      playerName: name,
      playerLevel: playerLevel,
      isUnlocked: isAvatarUnlocked(selectedAvatarId, playerLevel)
    });

    // Enhanced loading experience
    simulateLoading(() => {
      // Save registration data
      saveUserRegistration(name, selectedAvatarId);
      
      setPlayerName(name);
      setPlayerAvatar(selectedAvatarId);
      onStartGame();
    });
  };

  const handleJoinRequest = () => {
    // CRITICAL: Same validation for join flow
    if (!name.trim()) {
      setLockedMessage('Please enter your name to continue.');
      setTimeout(() => setLockedMessage(''), ANIMATION_CONFIG.BADGE_NOTIFICATION_DURATION);
      return;
    }

    if (!inviteCode.trim()) {
      setLockedMessage('Please enter an invitation code.');
      setTimeout(() => setLockedMessage(''), ANIMATION_CONFIG.BADGE_NOTIFICATION_DURATION);
      return;
    }

    // CRITICAL: Strict avatar validation for join flow based on player level
    const validation = validateAvatarSelection(selectedAvatarId);
    if (!validation.isValid) {
      setLockedMessage(validation.message || 'Invalid avatar selection.');
      setTimeout(() => setLockedMessage(''), ANIMATION_CONFIG.BADGE_NOTIFICATION_DURATION);
      return;
    }

    const upperCode = inviteCode.trim().toUpperCase();
    
    if (upperCode === 'HACKED') {
      console.log('AVATAR SELECTION: Joining with validated avatar:', {
        avatarId: selectedAvatarId,
        avatarName: getAvatarById(selectedAvatarId)?.name,
        playerName: name,
        playerLevel: playerLevel,
        isUnlocked: isAvatarUnlocked(selectedAvatarId, playerLevel)
      });

      simulateLoading(() => {
        // Save registration data
        saveUserRegistration(name, selectedAvatarId);
        
        setPlayerName(name);
        setPlayerAvatar(selectedAvatarId);
        onStartGame();
      });
    } else if (upperCode === 'HACKATHON') {
      setIsWaitingApproval(true);
    } else {
      setLockedMessage('Invalid invitation code. Please try again.');
      setTimeout(() => setLockedMessage(''), ANIMATION_CONFIG.BADGE_NOTIFICATION_DURATION);
    }
  };

  const handleAvatarSelect = (avatarId: number) => {
    setSelectedAvatarId(avatarId);
    console.log('AVATAR SELECTION: Selected avatar:', avatarId, getAvatarById(avatarId)?.name, 'Player Level:', playerLevel);
  };

  const handleLockedMessage = (message: string) => {
    setLockedMessage(message);
    if (message) {
      setTimeout(() => setLockedMessage(''), ANIMATION_CONFIG.BADGE_NOTIFICATION_DURATION);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Enhanced keyboard navigation with accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screenMode === 'initial') return;
      
      if (e.key === 'Enter' && !isLoading) {
        if (screenMode === 'create') {
          handleStartGame();
        } else if (screenMode === 'join') {
          handleJoinRequest();
        }
      } else if (e.key === 'Escape' && ACCESSIBILITY_CONFIG.ESCAPE_KEY_CLOSES_MODALS) {
        setScreenMode('initial');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screenMode, name, inviteCode, selectedAvatarId, isLoading]);

  // Initialize selected avatar to first unlocked avatar based on player level
  useEffect(() => {
    const firstUnlockedAvatar = avatarOptions.find(id => isAvatarUnlocked(id, playerLevel));
    if (firstUnlockedAvatar && firstUnlockedAvatar !== selectedAvatarId) {
      setSelectedAvatarId(firstUnlockedAvatar);
      console.log('AVATAR SELECTION: Auto-selected first unlocked avatar:', firstUnlockedAvatar, 'for player level:', playerLevel);
    }
  }, [playerLevel]);

  // Screen transition variants
  const screenVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  // Loading overlay
  if (isLoading) {
    return (
      <div 
        className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50"
        role="dialog"
        aria-label="Loading game"
        aria-live="polite"
      >
        {/* Scanlines effect */}
        <div className="absolute inset-0 pointer-events-none z-10 scanlines-effect" aria-hidden="true" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-20"
        >
          <div className="text-4xl font-heading text-primary-400 mb-8 glow-text animate-pulse">
            JOINING NEIGHBORHOOD...
          </div>
          
          {/* Enhanced loading bar */}
          <div 
            className="w-96 h-6 bg-gray-800 border-2 border-primary-600 rounded-lg overflow-hidden shadow-pixel glow-border"
            role="progressbar"
            aria-valuenow={Math.round(loadingProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Loading progress: ${Math.round(loadingProgress)}%`}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-400 loading-shimmer"
              style={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <div className="mt-4 text-primary-300 font-pixel">
            {Math.round(loadingProgress)}% Complete
          </div>
        </motion.div>
      </div>
    );
  }

  const renderInitialScreen = () => (
    <motion.div 
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: ANIMATION_CONFIG.MODAL_TRANSITION_DURATION / 1000, ease: "easeInOut" }}
      className="game-panel glow-border pulse-border max-w-4xl w-full mx-auto"
      role="main"
      aria-label="Welcome screen"
    >
      <h2 className="text-2xl md:text-3xl font-heading text-white mb-6 md:mb-8 text-center glow-text">
        Welcome to the Neighborhood!
      </h2>
      
      {/* Player Level Display */}
      <div className="text-center mb-6">
        <div className="bg-gray-800 bg-opacity-50 p-3 rounded-lg border border-gray-700 inline-block">
          <p className="text-gray-400 text-sm mb-1">Your Current Level</p>
          <p className="text-primary-400 font-heading text-lg">Level {playerLevel}</p>
          {playerLevel === 0 && (
            <p className="text-gray-300 text-xs mt-1">Complete the tutorial to advance!</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <motion.button
          onClick={() => setScreenMode('create')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="neon-button bg-primary-600 hover:bg-primary-700 p-6 md:p-8 rounded-lg text-white transition-all border-2 border-primary-400 shadow-pixel"
          aria-label="Create a new neighborhood as team lead"
          onFocus={() => setFocusedElement('create')}
          onBlur={() => setFocusedElement(null)}
        >
          <Users className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 floating-icon" aria-hidden="true" />
          <h3 className="text-lg md:text-xl font-heading mb-2">Create Neighborhood</h3>
          <p className="font-pixel text-xs md:text-sm text-primary-200">Start a new team space as the neighborhood Team lead</p>
        </motion.button>
        
        <motion.button
          onClick={() => setScreenMode('join')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="neon-button bg-secondary-600 hover:bg-secondary-700 p-6 md:p-8 rounded-lg text-white transition-all border-2 border-secondary-400 shadow-pixel"
          aria-label="Join an existing neighborhood with invite code"
          onFocus={() => setFocusedElement('join')}
          onBlur={() => setFocusedElement(null)}
        >
          <UserPlus className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 floating-icon" aria-hidden="true" />
          <h3 className="text-lg md:text-xl font-heading mb-2">Join Neighborhood</h3>
          <p className="font-pixel text-xs md:text-sm text-secondary-200">Join an existing team using an invite code</p>
        </motion.button>
      </div>
      
      <motion.button
        onClick={() => setScreenMode('instructions')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-6 md:mt-8 w-full py-3 md:py-4 rounded-lg font-heading text-white bg-gray-600 hover:bg-gray-700 shadow-pixel neon-button transition-all"
        aria-label="View game instructions and controls"
        onFocus={() => setFocusedElement('instructions')}
        onBlur={() => setFocusedElement(null)}
      >
        How To Play
      </motion.button>
    </motion.div>
  );

  const renderCreateScreen = () => (
    <motion.div 
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: ANIMATION_CONFIG.MODAL_TRANSITION_DURATION / 1000, ease: "easeInOut" }}
      className="game-panel glow-border max-w-lg w-full mx-auto max-h-[85vh] overflow-y-auto"
      role="main"
      aria-label="Create neighborhood form"
    >
      <div className="flex items-center mb-4">
        <motion.button
          onClick={() => setScreenMode('initial')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors neon-button"
          aria-label="Go back to welcome screen"
        >
          <ArrowLeft className="text-white" />
        </motion.button>
        <h2 className="text-xl font-heading text-white glow-text">Create Neighborhood</h2>
      </div>
      
      <form onSubmit={(e) => { e.preventDefault(); handleStartGame(); }}>
        <div className="space-y-4">
          <div>
            <label htmlFor="create-name" className="block text-white font-pixel mb-2 text-base glow-text-subtle">
              Your Name: <span className="text-red-400" aria-label="required">*</span>
            </label>
            <input
              type="text"
              id="create-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="cyber-input w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-pixel focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="Enter your name"
              required
              aria-describedby="name-help"
              maxLength={50}
            />
            <div id="name-help" className="sr-only">
              Enter your display name for the game. This will be visible to other players.
            </div>
          </div>

          <div>
            <AvatarCarousel
              selectedAvatarId={selectedAvatarId}
              onAvatarSelect={handleAvatarSelect}
              onLockedMessage={handleLockedMessage}
              playerLevel={playerLevel}
            />
          </div>

          {lockedMessage ? (
            <div 
              className="w-full py-3 rounded-lg font-heading text-red-300 shadow-pixel text-sm bg-red-900 bg-opacity-30 border border-red-700 text-center"
              role="alert"
              aria-live="polite"
            >
              {lockedMessage}
            </div>
          ) : (
            <motion.button
              type="submit"
              disabled={!name.trim()}
              whileHover={name.trim() ? { scale: 1.05 } : {}}
              whileTap={name.trim() ? { scale: 0.98 } : {}}
              className={`w-full py-3 md:py-4 rounded-lg font-heading text-white shadow-pixel text-base md:text-lg transition-all ${
                name.trim() 
                  ? 'bg-primary-600 hover:bg-primary-700 neon-button glow-border' 
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
              aria-describedby="create-button-help"
            >
              Create Neighborhood
            </motion.button>
          )}
          <div id="create-button-help" className="sr-only">
            {name.trim() ? 'Click to create your neighborhood and start the game' : 'Please enter your name to continue'}
          </div>
        </div>
      </form>
    </motion.div>
  );

  const renderJoinScreen = () => (
    <motion.div 
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: ANIMATION_CONFIG.MODAL_TRANSITION_DURATION / 1000, ease: "easeInOut" }}
      className="game-panel glow-border max-w-lg w-full mx-auto max-h-[85vh] overflow-y-auto"
      role="main"
      aria-label="Join neighborhood form"
    >
      {isWaitingApproval ? (
        <div className="text-center py-6" role="status" aria-live="polite">
          <motion.div 
            className="animate-pulse mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            aria-hidden="true"
          >
            <Users className="w-12 h-12 md:w-16 md:h-16 text-secondary-400 mx-auto floating-icon" />
          </motion.div>
          <h3 className="text-lg md:text-xl font-heading text-white mb-3 glow-text">Waiting for Approval</h3>
          <p className="text-gray-300 font-pixel mb-4 text-sm">
            Your request to join the neighborhood has been sent to the team lead.
            You'll be notified once it's approved!
          </p>
          <motion.button
            onClick={() => {
              setIsWaitingApproval(false);
              setScreenMode('initial');
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg font-pixel shadow-pixel neon-button"
            aria-label="Return to welcome screen"
          >
            Back to Home
          </motion.button>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-4">
            <motion.button
              onClick={() => setScreenMode('initial')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors neon-button"
              aria-label="Go back to welcome screen"
            >
              <ArrowLeft className="text-white" />
            </motion.button>
            <h2 className="text-xl font-heading text-white glow-text">Join Neighborhood</h2>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleJoinRequest(); }}>
            <div className="space-y-3">
              {/* Personal Information Section */}
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('personal')}
                  className="w-full p-3 bg-gray-800 hover:bg-gray-750 transition-colors flex items-center justify-between"
                  aria-expanded={expandedSections.personal}
                  aria-controls="personal-section"
                >
                  <h3 className="text-base font-pixel text-secondary-400 glow-text-subtle">
                    Personal Information
                  </h3>
                  {expandedSections.personal ? (
                    <ChevronUp className="text-gray-400" size={16} aria-hidden="true" />
                  ) : (
                    <ChevronDown className="text-gray-400" size={16} aria-hidden="true" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections.personal && (
                    <motion.div
                      id="personal-section"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: ANIMATION_CONFIG.MODAL_TRANSITION_DURATION / 1000 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 space-y-3">
                        <div>
                          <label htmlFor="join-name" className="block text-white font-pixel mb-1 text-sm glow-text-subtle">
                            Your Name: <span className="text-red-400" aria-label="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="join-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="cyber-input w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-pixel focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all text-sm"
                            placeholder="Enter your name"
                            required
                            aria-describedby="join-name-help"
                            maxLength={50}
                          />
                          <p id="join-name-help" className="mt-1 text-xs text-gray-400 font-pixel">
                            This will be displayed to your teammates
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Neighborhood Access Section */}
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('access')}
                  className="w-full p-3 bg-gray-800 hover:bg-gray-750 transition-colors flex items-center justify-between"
                  aria-expanded={expandedSections.access}
                  aria-controls="access-section"
                >
                  <h3 className="text-base font-pixel text-secondary-400 glow-text-subtle">
                    Neighborhood Access
                  </h3>
                  {expandedSections.access ? (
                    <ChevronUp className="text-gray-400" size={16} aria-hidden="true" />
                  ) : (
                    <ChevronDown className="text-gray-400" size={16} aria-hidden="true" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections.access && (
                    <motion.div
                      id="access-section"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: ANIMATION_CONFIG.MODAL_TRANSITION_DURATION / 1000 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 space-y-3">
                        <div>
                          <label htmlFor="inviteCode" className="block text-white font-pixel mb-1 text-sm glow-text-subtle">
                            Invitation Code: <span className="text-red-400" aria-label="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="inviteCode"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            className="cyber-input w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-pixel focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all uppercase text-sm"
                            placeholder="Enter the invitation code"
                            required
                            aria-describedby="invite-code-help"
                            maxLength={20}
                          />
                          <p id="invite-code-help" className="mt-1 text-xs text-gray-400 font-pixel">
                            Get this code from your team lead
                          </p>
                        </div>

                        <div className="bg-gray-900 bg-opacity-75 px-3 py-2 rounded-lg border border-gray-700 glow-border-subtle">
                          <h4 className="text-sm font-pixel text-gray-300 mb-1">Demo Codes:</h4>
                          <div className="space-y-1">
                            <p className="text-xs font-pixel text-gray-400">
                              <span className="text-secondary-400 font-bold glow-text-subtle">HACKATHON</span> - Queue for team approval
                            </p>
                            <p className="text-xs font-pixel text-gray-400">
                              <span className="text-secondary-400 font-bold glow-text-subtle">HACKED</span> - Direct access (demo mode)
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Character Selection Section */}
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('character')}
                  className="w-full p-3 bg-gray-800 hover:bg-gray-750 transition-colors flex items-center justify-between"
                  aria-expanded={expandedSections.character}
                  aria-controls="character-section"
                >
                  <h3 className="text-base font-pixel text-secondary-400 glow-text-subtle">
                    Character Selection
                  </h3>
                  {expandedSections.character ? (
                    <ChevronUp className="text-gray-400" size={16} aria-hidden="true" />
                  ) : (
                    <ChevronDown className="text-gray-400" size={16} aria-hidden="true" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections.character && (
                    <motion.div
                      id="character-section"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: ANIMATION_CONFIG.MODAL_TRANSITION_DURATION / 1000 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3">
                        <AvatarCarousel
                          selectedAvatarId={selectedAvatarId}
                          onAvatarSelect={handleAvatarSelect}
                          onLockedMessage={handleLockedMessage}
                          playerLevel={playerLevel}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {lockedMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-3 py-2 rounded-lg font-pixel text-sm glow-border-error"
                  role="alert"
                  aria-live="polite"
                >
                  {lockedMessage}
                </motion.div>
              )}

              <div className="pt-3 border-t border-gray-700">
                <motion.button
                  type="submit"
                  disabled={!name.trim() || !inviteCode.trim()}
                  whileHover={name.trim() && inviteCode.trim() ? { scale: 1.05 } : {}}
                  whileTap={name.trim() && inviteCode.trim() ? { scale: 0.98 } : {}}
                  className={`w-full py-3 rounded-lg font-heading text-white shadow-pixel text-base transition-all ${
                    name.trim() && inviteCode.trim()
                      ? 'bg-secondary-600 hover:bg-secondary-700 neon-button glow-border'
                      : 'bg-gray-600 cursor-not-allowed opacity-50'
                  }`}
                  aria-describedby="join-button-help"
                >
                  Submit Join Request
                </motion.button>
                <p id="join-button-help" className="mt-2 text-xs text-gray-400 font-pixel text-center">
                  Your request will be sent to the team lead for approval
                </p>
              </div>
            </div>
          </form>
        </>
      )}
    </motion.div>
  );

  const renderInstructionsScreen = () => (
    <motion.div 
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: ANIMATION_CONFIG.MODAL_TRANSITION_DURATION / 1000, ease: "easeInOut" }}
      className="game-panel glow-border max-w-2xl w-full mx-auto text-white font-pixel max-h-[85vh] overflow-y-auto"
      role="main"
      aria-label="Game instructions"
    >
      <div className="flex items-center mb-4">
        <motion.button
          onClick={() => setScreenMode('initial')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors neon-button"
          aria-label="Go back to welcome screen"
        >
          <ArrowLeft className="text-white" />
        </motion.button>
        <h2 className="text-xl font-heading text-white flex items-center glow-text">
          <MapPin className="mr-2 floating-icon" aria-hidden="true" /> How To Play
        </h2>
      </div>
      
      <div className="space-y-4 mb-6 text-sm">
        <p>Welcome to <span className="text-primary-400 glow-text-subtle">"Knock Knock, Shippers!"</span> - a team management game where you track your weekly accomplishments!</p>
        
        <div>
          <h3 className="font-heading text-secondary-400 mb-2 glow-text-subtle">Player Progression:</h3>
          <ul className="list-disc pl-5 space-y-1" role="list">
            <li><span className="text-primary-400">Level 0</span>: Choose between Male or Female Civilian (Slime, Orc, Vampire locked)</li>
            <li><span className="text-primary-400">Level 1</span>: Complete tutorial and submit first activity report</li>
            <li><span className="text-primary-400">Level 2</span>: Unlock Slime avatar option</li>
            <li><span className="text-primary-400">Level 3</span>: Unlock Orc and Vampire avatar options</li>
            <li>Higher levels unlock advanced avatar stages and abilities</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-heading text-secondary-400 mb-2 glow-text-subtle">Game Basics:</h3>
          <ul className="list-disc pl-5 space-y-1" role="list">
            <li>Walk around the neighborhood to see other team members' houses</li>
            <li>Each house has a board showing weekly accomplishments</li>
            <li>Update your board every Friday with tasks you completed</li>
            <li>Categorize tasks as: Project, Ad Hoc, or Routine</li>
            <li>Rank your tasks by priority (most important first!)</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-heading text-secondary-400 mb-2 glow-text-subtle">Controls:</h3>
          <ul className="list-disc pl-5 space-y-1" role="list">
            <li>Use arrow keys or WASD to move your character</li>
            <li>Press Space or E to interact with boards and objects</li>
            <li>Press ESC to open menu</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-heading text-secondary-400 mb-2 glow-text-subtle">Task Categories:</h3>
          <ul className="list-disc pl-5 space-y-1" role="list">
            <li><span className="text-success-400 glow-text-subtle">Project</span>: Major tasks moving your projects forward</li>
            <li><span className="text-warning-400 glow-text-subtle">Ad Hoc</span>: One-time tasks not related to main projects</li>
            <li><span className="text-primary-400 glow-text-subtle">Routine</span>: Recurring tasks and maintenance work</li>
          </ul>
        </div>
      </div>
      
      <motion.button
        onClick={() => setScreenMode('initial')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-lg font-heading text-white bg-secondary-600 hover:bg-secondary-700 shadow-pixel neon-button transition-all"
        aria-label="Return to welcome screen"
      >
        Back to Home
      </motion.button>
    </motion.div>
  );

  return (
    <div 
      className="w-full min-h-screen flex flex-col bg-gray-900 px-4 relative overflow-hidden pt-14"
      role="application"
      aria-label="Knock Knock Shippers Game Setup"
    >
      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none z-10 scanlines-effect" aria-hidden="true" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[...Array(EFFECTS_CONFIG.INTRO_PARTICLES)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0.2, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Animated Header */}
      <motion.div 
        className="py-4 z-30 text-center w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          // Floating animation
          y: [0, -8, 0],
        }}
        transition={{ 
          opacity: { duration: 0.8 },
          y: { 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }
        }}
        role="banner"
      >
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-6xl font-heading text-primary-400 mb-2 glow-text title-glow"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Knock-Knock,Shippers!
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl lg:text-2xl font-pixel text-white glow-text-subtle"
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          A non-boring task reporting management
        </motion.p>
      </motion.div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto flex flex-col items-center relative z-20 py-4">
        <AnimatePresence mode="wait">
          {screenMode === 'initial' && (
            <motion.div key="initial">
              {renderInitialScreen()}
            </motion.div>
          )}
          {screenMode === 'create' && (
            <motion.div key="create">
              {renderCreateScreen()}
            </motion.div>
          )}
          {screenMode === 'join' && (
            <motion.div key="join">
              {renderJoinScreen()}
            </motion.div>
          )}
          {screenMode === 'instructions' && (
            <motion.div key="instructions">
              {renderInstructionsScreen()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {/* Screen mode announcements */}
        {screenMode === 'create' && 'Create neighborhood form opened'}
        {screenMode === 'join' && 'Join neighborhood form opened'}
        {screenMode === 'instructions' && 'Game instructions opened'}
        {isWaitingApproval && 'Waiting for team lead approval'}
      </div>
    </div>
  );
};

export default IntroScreen;