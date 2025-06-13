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

    // Only proceed if all validations pass
    setPlayerName(name);
    setPlayerAvatar(selectedAvatarId);
    onStartGame();
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

      setPlayerName(name);
      setPlayerAvatar(selectedAvatarId);
      onStartGame();
    } else if (upperCode === 'HACKATHON') {
      setIsWaitingApproval(true);
    } else {
      setLockedMessage('Invalid invitation code. Please try again.');
      setTimeout(() => setLockedMessage(''), 3000);
    }
  };

  const handleAvatarSelect = (avatarId: number) => {
    // Simply update the selected avatar ID - no validation here
    setSelectedAvatarId(avatarId);
    console.log('AVATAR SELECTION: Selected avatar:', avatarId, getAvatarById(avatarId)?.name);
  };

  const handleLockedMessage = (message: string) => {
    setLockedMessage(message);
    if (message) {
      setTimeout(() => setLockedMessage(''), 3000);
    }
  };

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

  const renderInitialScreen = () => (
    <motion.div 
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl w-full border-4 border-primary-600"
    >
      <h2 className="text-2xl font-heading text-white mb-8 text-center">Welcome to the Neighborhood!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button
          onClick={() => setScreenMode('create')}
          className="bg-primary-600 hover:bg-primary-700 p-8 rounded-lg text-white transition-all transform hover:scale-105 border-2 border-primary-400 shadow-pixel button-pixel"
        >
          <Users className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-heading mb-2">Create Neighborhood</h3>
          <p className="font-pixel text-sm text-primary-200">Start a new team space as the neighborhood manager</p>
        </button>
        
        <button
          onClick={() => setScreenMode('join')}
          className="bg-secondary-600 hover:bg-secondary-700 p-8 rounded-lg text-white transition-all transform hover:scale-105 border-2 border-secondary-400 shadow-pixel button-pixel"
        >
          <UserPlus className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-heading mb-2">Join Neighborhood</h3>
          <p className="font-pixel text-sm text-secondary-200">Join an existing team using an invite code</p>
        </button>
      </div>
      
      <button
        onClick={() => setScreenMode('instructions')}
        className="mt-8 w-full py-4 rounded-lg font-heading text-white bg-gray-600 hover:bg-gray-700 shadow-pixel button-pixel transition-all"
      >
        How To Play
      </button>
    </motion.div>
  );

  const renderCreateScreen = () => (
    <motion.div 
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="gradient-primary p-4 rounded-lg shadow-lg max-w-lg w-full border-4 border-primary-600 max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center mb-4">
        <button
          onClick={() => setScreenMode('initial')}
          className="mr-4 p-2 hover:bg-gray-700 hover:bg-opacity-30 rounded-lg transition-colors"
        >
          <ArrowLeft className="text-white" />
        </button>
        <h2 className="text-xl font-heading text-white">Create Your Character</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-white font-pixel mb-2 text-base">
            Your Name: <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 bg-opacity-80 border border-gray-600 rounded-lg text-white font-pixel focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors"
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

        {lockedMessage && (
          <div className="bg-red-900 bg-opacity-50 border border-red-400 text-red-200 px-4 py-3 rounded-lg font-pixel text-sm">
            {lockedMessage}
          </div>
        )}

        <button
          onClick={handleStartGame}
          disabled={!name.trim()}
          className={`w-full py-4 rounded-lg font-heading text-white shadow-pixel button-pixel text-lg transition-all ${
            name.trim() 
              ? 'bg-white bg-opacity-20 hover:bg-opacity-30 transform hover:scale-105 border-2 border-white border-opacity-50' 
              : 'bg-gray-600 bg-opacity-50 cursor-not-allowed opacity-50'
          }`}
        >
          Create Neighborhood
        </button>
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
      className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-lg w-full border-4 border-secondary-600 max-h-[90vh] overflow-y-auto"
    >
      {isWaitingApproval ? (
        <div className="text-center py-8">
          <div className="animate-pulse mb-6">
            <Users className="w-16 h-16 text-secondary-400 mx-auto" />
          </div>
          <h3 className="text-xl font-heading text-white mb-4">Waiting for Approval</h3>
          <p className="text-gray-300 font-pixel mb-6">
            Your request to join the neighborhood has been sent to the team lead.
            You'll be notified once it's approved!
          </p>
          <button
            onClick={() => {
              setIsWaitingApproval(false);
              setScreenMode('initial');
            }}
            className="px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg font-pixel shadow-pixel button-pixel"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="flex items-center mb-4">
            <button
              onClick={() => setScreenMode('initial')}
              className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Go back to home"
            >
              <ArrowLeft className="text-white" />
            </button>
            <h2 className="text-xl font-heading text-white">Join Neighborhood</h2>
          </div>

          {/* Form Section */}
          <div className="space-y-4">
            {/* Personal Information Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-pixel text-secondary-400 border-b border-gray-700 pb-2">
                Personal Information
              </h3>
              
              <div>
                <label htmlFor="name" className="block text-white font-pixel mb-2 text-base">
                  Your Name: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-pixel focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-colors"
                  placeholder="Enter your name"
                  required
                  aria-describedby="name-help"
                />
                <p id="name-help" className="mt-1 text-xs text-gray-400 font-pixel">
                  This will be displayed to your teammates
                </p>
              </div>
            </div>

            {/* Invitation Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-pixel text-secondary-400 border-b border-gray-700 pb-2">
                Neighborhood Access
              </h3>
              
              <div>
                <label htmlFor="inviteCode" className="block text-white font-pixel mb-2 text-base">
                  Invitation Code: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="inviteCode"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-pixel focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-colors uppercase"
                  placeholder="Enter the invitation code"
                  required
                  aria-describedby="invite-help"
                />
                <p id="invite-help" className="mt-1 text-xs text-gray-400 font-pixel">
                  Get this code from your team lead
                </p>
              </div>

              {/* Demo Codes Info */}
              <div className="bg-gray-900 bg-opacity-75 px-3 py-3 rounded-lg border border-gray-700">
                <h4 className="text-sm font-pixel text-gray-300 mb-2">Demo Codes:</h4>
                <div className="space-y-1">
                  <p className="text-xs font-pixel text-gray-400">
                    <span className="text-secondary-400 font-bold">HACKATHON</span> - Queue for team approval
                  </p>
                  <p className="text-xs font-pixel text-gray-400">
                    <span className="text-secondary-400 font-bold">HACKED</span> - Direct access (demo mode)
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {lockedMessage && (
                <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded-lg font-pixel text-sm">
                  {lockedMessage}
                </div>
              )}
            </div>

            {/* Avatar Selection Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-pixel text-secondary-400 border-b border-gray-700 pb-2">
                Character Selection
              </h3>
              <AvatarCarousel
                selectedAvatarId={selectedAvatarId}
                onAvatarSelect={handleAvatarSelect}
                onLockedMessage={handleLockedMessage}
              />
            </div>

            {/* Submit Section */}
            <div className="pt-4 border-t border-gray-700">
              <button
                onClick={handleJoinRequest}
                disabled={!name.trim() || !inviteCode.trim()}
                className={`w-full py-4 rounded-lg font-heading text-white shadow-pixel button-pixel text-lg transition-all ${
                  name.trim() && inviteCode.trim()
                    ? 'bg-secondary-600 hover:bg-secondary-700 transform hover:scale-105'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
                aria-describedby="submit-help"
              >
                Submit Join Request
              </button>
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
      className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full border-4 border-secondary-600 text-white font-pixel max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center mb-6">
        <button
          onClick={() => setScreenMode('initial')}
          className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="text-white" />
        </button>
        <h2 className="text-xl font-heading text-white flex items-center">
          <MapPin className="mr-2" /> How To Play
        </h2>
      </div>
      
      <div className="space-y-6 mb-8">
        <p>Welcome to <span className="text-primary-400">"Knock Knock, Shippers!"</span> - a team management game where you track your weekly accomplishments!</p>
        
        <div>
          <h3 className="font-heading text-secondary-400 mb-3">Game Basics:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Walk around the neighborhood to see other team members' houses</li>
            <li>Each house has a board showing weekly accomplishments</li>
            <li>Update your board every Friday with tasks you completed</li>
            <li>Categorize tasks as: Project, Ad Hoc, or Routine</li>
            <li>Rank your tasks by priority (most important first!)</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-heading text-secondary-400 mb-3">Controls:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use arrow keys or WASD to move your character</li>
            <li>Press Space or E to interact with boards and objects</li>
            <li>Press ESC to open menu</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-heading text-secondary-400 mb-3">Task Categories:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="text-success-400">Project</span>: Major tasks moving your projects forward</li>
            <li><span className="text-warning-400">Ad Hoc</span>: One-time tasks not related to main projects</li>
            <li><span className="text-primary-400">Routine</span>: Recurring tasks and maintenance work</li>
          </ul>
        </div>
      </div>
      
      <button
        onClick={() => setScreenMode('initial')}
        className="w-full py-4 rounded-lg font-heading text-white bg-secondary-600 hover:bg-secondary-700 shadow-pixel button-pixel transition-all"
      >
        Back to Home
      </button>
    </motion.div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 px-4">
      <div className="text-center mb-8 animate-bounce-slow">
        <h1 className="text-4xl md:text-6xl font-heading text-primary-400 mb-2">
          Knock-Knock,Shippers!
        </h1>
        <p className="text-xl md:text-2xl font-pixel text-white">
          A non-boring task reporting management
        </p>
      </div>

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
  );
};

export default IntroScreen;