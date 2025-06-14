import React, { useState, useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { MapPin, Lock, Users, UserPlus, ArrowLeft } from 'lucide-react';
import { getAvatarById, getAllAvatarIds } from '../data/avatars';
import AvatarCarousel from './AvatarCarousel';
import { motion, AnimatePresence } from 'framer-motion';

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

  const avatarOptions = getAllAvatarIds();

  // CRITICAL: Strict validation for locked avatars
  const validateAvatarSelection = (avatarId: number): { isValid: boolean; message?: string } => {
    const avatar = getAvatarById(avatarId);
    
    if (!avatar) {
      return { isValid: false, message: 'Invalid avatar selection. Please choose a different character.' };
    }
    
    if (avatar.locked) {
      const requirement = avatar.unlockRequirement;
      let message = 'This avatar is locked. Play more to unlock!';
      
      if (requirement) {
        switch (requirement.type) {
          case 'activities':
            message = `Complete ${requirement.count} activities to unlock this avatar!`;
            break;
          case 'badges':
            message = `Earn ${requirement.count} badges to unlock this avatar!`;
            break;
          case 'weeks':
            message = `Play for ${requirement.count} weeks to unlock this avatar!`;
            break;
        }
      }
      
      return { isValid: false, message };
    }
    
    return { isValid: true };
  };

  // Enhanced loading simulation
  const simulateLoading = (callback: () => void) => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const increment = Math.random() * 15 + 5;
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
    }, 150);
  };

  const handleStartGame = () => {
    // CRITICAL: Gate-keeping logic - validate everything before proceeding
    if (!name.trim()) {
      setLockedMessage('Please enter your name to continue.');
      setTimeout(() => setLockedMessage(''), 3000);
      return;
    }

    // CRITICAL: Strict avatar validation
    const validation = validateAvatarSelection(selectedAvatarId);
    if (!validation.isValid) {
      setLockedMessage(validation.message || 'Invalid avatar selection.');
      setTimeout(() => setLockedMessage(''), 3000);
      return;
    }

    console.log('AVATAR SELECTION: Starting game with validated avatar:', {
      avatarId: selectedAvatarId,
      avatarName: getAvatarById(selectedAvatarId)?.name,
      playerName: name,
      isLocked: getAvatarById(selectedAvatarId)?.locked
    });

    // Enhanced loading experience
    simulateLoading(() => {
      setPlayerName(name);
      setPlayerAvatar(selectedAvatarId);
      onStartGame();
    });
  };

  const handleJoinRequest = () => {
    // CRITICAL: Same validation for join flow
    if (!name.trim()) {
      setLockedMessage('Please enter your name to continue.');
      setTimeout(() => setLockedMessage(''), 3000);
      return;
    }

    if (!inviteCode.trim()) {
      setLockedMessage('Please enter an invitation code.');
      setTimeout(() => setLockedMessage(''), 3000);
      return;
    }

    // CRITICAL: Strict avatar validation for join flow
    const validation = validateAvatarSelection(selectedAvatarId);
    if (!validation.isValid) {
      setLockedMessage(validation.message || 'Invalid avatar selection.');
      setTimeout(() => setLockedMessage(''), 3000);
      return;
    }

    const upperCode = inviteCode.trim().toUpperCase();
    
    if (upperCode === 'HACKED') {
      console.log('AVATAR SELECTION: Joining with validated avatar:', {
        avatarId: selectedAvatarId,
        avatarName: getAvatarById(selectedAvatarId)?.name,
        playerName: name,
        isLocked: getAvatarById(selectedAvatarId)?.locked
      });

      simulateLoading(() => {
        setPlayerName(name);
        setPlayerAvatar(selectedAvatarId);
        onStartGame();
      });
    } else if (upperCode === 'HACKATHON') {
      setIsWaitingApproval(true);
    } else {
      setLockedMessage('Invalid invitation code. Please try again.');
      setTimeout(() => setLockedMessage(''), 3000);
    }
  };

  const handleAvatarSelect = (avatarId: number) => {
    setSelectedAvatarId(avatarId);
    console.log('AVATAR SELECTION: Selected avatar:', avatarId, getAvatarById(avatarId)?.name);
  };

  const handleLockedMessage = (message: string) => {
    setLockedMessage(message);
    if (message) {
      setTimeout(() => setLockedMessage(''), 3000);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screenMode === 'initial') return;
      
      if (e.key === 'Enter' && !isLoading) {
        if (screenMode === 'create') {
          handleStartGame();
        } else if (screenMode === 'join') {
          handleJoinRequest();
        }
      } else if (e.key === 'Escape') {
        setScreenMode('initial');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screenMode, name, inviteCode, selectedAvatarId, isLoading]);

  // Initialize selected avatar to first unlocked avatar
  useEffect(() => {
    const firstUnlockedAvatar = avatarOptions.find(id => {
      const avatar = getAvatarById(id);
      return avatar && !avatar.locked;
    });
    if (firstUnlockedAvatar) {
      setSelectedAvatarId(firstUnlockedAvatar);
    }
  }, []);

  // Screen transition variants
  const screenVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  // Loading overlay
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
        {/* Scanlines effect */}
        <div className="absolute inset-0 pointer-events-none z-10 scanlines-effect" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-20"
        >
          <div className="text-4xl font-heading text-primary-400 mb-8 glow-text animate-pulse">
            INITIALIZING NEIGHBORHOOD...
          </div>
          
          {/* Enhanced loading bar */}
          <div className="w-96 h-6 bg-gray-800 border-2 border-primary-600 rounded-lg overflow-hidden shadow-pixel glow-border">
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
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="game-panel glow-border pulse-border max-w-4xl w-full"
    >
      <h2 className="text-3xl font-heading text-white mb-8 text-center glow-text">
        Welcome to the Neighborhood!
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.button
          onClick={() => setScreenMode('create')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="neon-button bg-primary-600 hover:bg-primary-700 p-8 rounded-lg text-white transition-all border-2 border-primary-400 shadow-pixel"
        >
          <Users className="w-16 h-16 mx-auto mb-4 floating-icon" />
          <h3 className="text-xl font-heading mb-2">Create Neighborhood</h3>
          <p className="font-pixel text-sm text-primary-200">Start a new team space as the neighborhood manager</p>
        </motion.button>
        
        <motion.button
          onClick={() => setScreenMode('join')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="neon-button bg-secondary-600 hover:bg-secondary-700 p-8 rounded-lg text-white transition-all border-2 border-secondary-400 shadow-pixel"
        >
          <UserPlus className="w-16 h-16 mx-auto mb-4 floating-icon" />
          <h3 className="text-xl font-heading mb-2">Join Neighborhood</h3>
          <p className="font-pixel text-sm text-secondary-200">Join an existing team using an invite code</p>
        </motion.button>
      </div>
      
      <motion.button
        onClick={() => setScreenMode('instructions')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-8 w-full py-4 rounded-lg font-heading text-white bg-gray-600 hover:bg-gray-700 shadow-pixel neon-button transition-all"
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
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="game-panel glow-border max-w-lg w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center mb-4">
        <motion.button
          onClick={() => setScreenMode('initial')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors neon-button"
        >
          <ArrowLeft className="text-white" />
        </motion.button>
        <h2 className="text-xl font-heading text-white glow-text">Create Neighborhood</h2>
      </div>
      
      <div className="mb-4 space-y-4">
        <div>
          <label htmlFor="name" className="block text-white font-pixel mb-2 text-base glow-text-subtle">
            Your Name: <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="cyber-input w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-pixel focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <AvatarCarousel
            selectedAvatarId={selectedAvatarId}
            onAvatarSelect={handleAvatarSelect}
            onLockedMessage={handleLockedMessage}
          />
        </div>

        {lockedMessage ? (
  <div className="w-full py-2 rounded-lg font-heading text-red-300 shadow-pixel text-lg bg-red-900 bg-opacity-30 border border-red-700 text-center">
    {lockedMessage}
  </div>
) : (
  <motion.button
    onClick={handleStartGame}
    disabled={!name.trim()}
    whileHover={name.trim() ? { scale: 1.05 } : {}}
    whileTap={name.trim() ? { scale: 0.98 } : {}}
    className={`w-full py-4 rounded-lg font-heading text-white shadow-pixel text-lg transition-all ${
      name.trim() 
        ? 'bg-primary-600 hover:bg-primary-700 neon-button glow-border' 
        : 'bg-gray-600 cursor-not-allowed opacity-50'
    }`}
  >
    Create Neighborhood
  </motion.button>
)}
      </div>
    </motion.div>
  );

  const renderJoinScreen = () => (
    <motion.div 
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="game-panel glow-border max-w-lg w-full max-h-[90vh] overflow-y-auto"
    >
      {isWaitingApproval ? (
        <div className="text-center py-8">
          <motion.div 
            className="animate-pulse mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Users className="w-16 h-16 text-secondary-400 mx-auto floating-icon" />
          </motion.div>
          <h3 className="text-xl font-heading text-white mb-4 glow-text">Waiting for Approval</h3>
          <p className="text-gray-300 font-pixel mb-6">
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
              aria-label="Go back to home"
            >
              <ArrowLeft className="text-white" />
            </motion.button>
            <h2 className="text-xl font-heading text-white glow-text">Join Neighborhood</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-lg font-pixel text-secondary-400 border-b border-gray-700 pb-2 glow-text-subtle">
                Personal Information
              </h3>
              
              <div>
                <label htmlFor="name" className="block text-white font-pixel mb-2 text-base glow-text-subtle">
                  Your Name: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="cyber-input w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-pixel focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all"
                  placeholder="Enter your name"
                  required
                  aria-describedby="name-help"
                />
                <p id="name-help" className="mt-1 text-xs text-gray-400 font-pixel">
                  This will be displayed to your teammates
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-pixel text-secondary-400 border-b border-gray-700 pb-2 glow-text-subtle">
                Neighborhood Access
              </h3>
              
              <div>
                <label htmlFor="inviteCode" className="block text-white font-pixel mb-2 text-base glow-text-subtle">
                  Invitation Code: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="inviteCode"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="cyber-input w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-pixel focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all uppercase"
                  placeholder="Enter the invitation code"
                  required
                  aria-describedby="invite-help"
                />
                <p id="invite-help" className="mt-1 text-xs text-gray-400 font-pixel">
                  Get this code from your team lead
                </p>
              </div>

              <div className="bg-gray-900 bg-opacity-75 px-3 py-3 rounded-lg border border-gray-700 glow-border-subtle">
                <h4 className="text-sm font-pixel text-gray-300 mb-2">Demo Codes:</h4>
                <div className="space-y-1">
                  <p className="text-xs font-pixel text-gray-400">
                    <span className="text-secondary-400 font-bold glow-text-subtle">HACKATHON</span> - Queue for team approval
                  </p>
                  <p className="text-xs font-pixel text-gray-400">
                    <span className="text-secondary-400 font-bold glow-text-subtle">HACKED</span> - Direct access (demo mode)
                  </p>
                </div>
              </div>

              {lockedMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded-lg font-pixel text-sm glow-border-error"
                >
                  {lockedMessage}
                </motion.div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-pixel text-secondary-400 border-b border-gray-700 pb-2 glow-text-subtle">
                Character Selection
              </h3>
              <AvatarCarousel
                selectedAvatarId={selectedAvatarId}
                onAvatarSelect={handleAvatarSelect}
                onLockedMessage={handleLockedMessage}
              />
            </div>

            <div className="pt-4 border-t border-gray-700">
              <motion.button
                onClick={handleJoinRequest}
                disabled={!name.trim() || !inviteCode.trim()}
                whileHover={name.trim() && inviteCode.trim() ? { scale: 1.05 } : {}}
                whileTap={name.trim() && inviteCode.trim() ? { scale: 0.98 } : {}}
                className={`w-full py-4 rounded-lg font-heading text-white shadow-pixel text-lg transition-all ${
                  name.trim() && inviteCode.trim()
                    ? 'bg-secondary-600 hover:bg-secondary-700 neon-button glow-border'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
                aria-describedby="submit-help"
              >
                Submit Join Request
              </motion.button>
              <p id="submit-help" className="mt-2 text-xs text-gray-400 font-pixel text-center">
                Your request will be sent to the team lead for approval
              </p>
            </div>
          </div>
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
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="game-panel glow-border max-w-2xl w-full text-white font-pixel max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center mb-6">
        <motion.button
          onClick={() => setScreenMode('initial')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors neon-button"
        >
          <ArrowLeft className="text-white" />
        </motion.button>
        <h2 className="text-xl font-heading text-white flex items-center glow-text">
          <MapPin className="mr-2 floating-icon" /> How To Play
        </h2>
      </div>
      
      <div className="space-y-6 mb-8">
        <p>Welcome to <span className="text-primary-400 glow-text-subtle">"Knock Knock, Shippers!"</span> - a team management game where you track your weekly accomplishments!</p>
        
        <div>
          <h3 className="font-heading text-secondary-400 mb-3 glow-text-subtle">Game Basics:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Walk around the neighborhood to see other team members' houses</li>
            <li>Each house has a board showing weekly accomplishments</li>
            <li>Update your board every Friday with tasks you completed</li>
            <li>Categorize tasks as: Project, Ad Hoc, or Routine</li>
            <li>Rank your tasks by priority (most important first!)</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-heading text-secondary-400 mb-3 glow-text-subtle">Controls:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use arrow keys or WASD to move your character</li>
            <li>Press Space or E to interact with boards and objects</li>
            <li>Press ESC to open menu</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-heading text-secondary-400 mb-3 glow-text-subtle">Task Categories:</h3>
          <ul className="list-disc pl-5 space-y-2">
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
        className="w-full py-4 rounded-lg font-heading text-white bg-secondary-600 hover:bg-secondary-700 shadow-pixel neon-button transition-all"
      >
        Back to Home
      </motion.button>
    </motion.div>
  );

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-900 px-4 relative overflow-hidden pt-14">
      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none z-10 scanlines-effect" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
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

      {/* Header - Now in document flow */}
      <motion.div 
        className="py-4 bg-gray-900/80 backdrop-blur-sm z-30 text-center w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-heading text-primary-400 mb-2 glow-text title-glow">
          Knock-Knock,Shippers!
        </h1>
        <p className="text-xl md:text-2xl font-pixel text-white glow-text-subtle">
          A non-boring task reporting management
        </p>
      </motion.div>

      {/* Content Area - Now flex-grow with overflow-y-auto */}
      <div className="flex-grow overflow-y-auto flex flex-col items-center relative z-20">
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
    </div>
  );
};

export default IntroScreen;