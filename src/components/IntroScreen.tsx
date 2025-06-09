import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { MapPin, Lock, Users, UserPlus, ArrowLeft } from 'lucide-react';
import { avatars, getAvatarById, getAvatarStage, getAllAvatarIds } from '../data/avatars';

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
  
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; index: number } | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleStartGame = () => {
    if (name.trim()) {
      setPlayerName(name);
      setPlayerAvatar(selectedAvatarId);
      onStartGame();
    }
  };

  const handleJoinRequest = () => {
    if (name.trim() && inviteCode.trim()) {
      const upperCode = inviteCode.trim().toUpperCase();
      
      if (upperCode === 'HACKED') {
        setPlayerName(name);
        setPlayerAvatar(selectedAvatarId);
        onStartGame();
      } else if (upperCode === 'HACKATHON') {
        setIsWaitingApproval(true);
      } else {
        setLockedMessage('Invalid invitation code. Please try again.');
        setTimeout(() => setLockedMessage(''), 3000);
      }
    }
  };

  const avatarOptions = getAllAvatarIds();
  
  // Create extended array for infinite scroll
  const extendedAvatars = [...avatarOptions, ...avatarOptions, ...avatarOptions];
  const centerOffset = avatarOptions.length;

  const getAvatarName = (id: number) => {
    const avatar = getAvatarById(id);
    return avatar?.name || 'Unknown';
  };

  const getAvatarSprite = (id: number) => {
  const avatar = getAvatarById(id);
  const stage = avatar?.stages[0]; // Get first available stage
  return stage?.spritePath || '/lv1_male_civilian.png';
};

  const goToSlide = (index: number, smooth = true) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(centerOffset + (index % avatarOptions.length));
    
    if (smooth) {
      setTimeout(() => setIsTransitioning(false), 300);
    } else {
      setIsTransitioning(false);
    }
  };

  const nextSlide = () => {
    const actualIndex = (currentIndex - centerOffset + 1) % avatarOptions.length;
    goToSlide(actualIndex);
  };

  const prevSlide = () => {
    const actualIndex = (currentIndex - centerOffset - 1 + avatarOptions.length) % avatarOptions.length;
    goToSlide(actualIndex);
  };

  const handleAvatarClick = (index: number) => {
    const relativeIndex = index - currentIndex;
    if (relativeIndex === 0) {
      // Center avatar clicked - select it
      const actualIndex = (currentIndex - centerOffset + avatarOptions.length) % avatarOptions.length;
      const avatarId = avatarOptions[actualIndex];
      const avatar = getAvatarById(avatarId);
      
      if (avatar && !avatar.locked) {
        setSelectedAvatarId(avatarId);
      } else {
        const requirement = avatar?.unlockRequirement;
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
        
        setLockedMessage(message);
        setTimeout(() => setLockedMessage(''), 3000);
      }
      return;
    }
    
    // Non-center avatar clicked - move it to center with smart direction
    const currentActualIndex = (currentIndex - centerOffset + avatarOptions.length) % avatarOptions.length;
    const targetActualIndex = (index - centerOffset + avatarOptions.length) % avatarOptions.length;
    
    // Calculate shortest path
    const forwardDistance = (targetActualIndex - currentActualIndex + avatarOptions.length) % avatarOptions.length;
    const backwardDistance = (currentActualIndex - targetActualIndex + avatarOptions.length) % avatarOptions.length;
    
    let newIndex;
    if (forwardDistance <= backwardDistance) {
      // Go forward - find the closest forward target in extended array
      newIndex = currentIndex + forwardDistance;
    } else {
      // Go backward - find the closest backward target in extended array  
      newIndex = currentIndex - backwardDistance;
    }
    
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Reset position when reaching boundaries for infinite scroll
  useEffect(() => {
    if (currentIndex <= 2) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + avatarOptions.length);
      }, 300);
    } else if (currentIndex >= extendedAvatars.length - 3) {
      setTimeout(() => {
        setCurrentIndex(currentIndex - avatarOptions.length);
      }, 300);
    }
  }, [currentIndex, avatarOptions.length, extendedAvatars.length]);

  // Initialize currentIndex to center the first avatar
  useEffect(() => {
    setCurrentIndex(centerOffset);
  }, [centerOffset]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart({ x: e.clientX, index: currentIndex });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart) return;
    const diff = e.clientX - dragStart.x;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!dragStart) return;
    
    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setDragStart(null);
    setDragOffset(0);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart({ x: e.touches[0].clientX, index: currentIndex });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStart) return;
    const diff = e.touches[0].clientX - dragStart.x;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const getAvatarStyle = (index: number) => {
    const distance = Math.abs(index - currentIndex);
    const relativePosition = index - currentIndex;
    
    let scale, opacity, zIndex;
    
    if (distance === 0) {
      // Center avatar - larger and prominent
      scale = 1.2;
      opacity = 1;
      zIndex = 10;
    } else if (distance === 1) {
      // Adjacent avatars
      scale = 0.8;
      opacity = 0.7;
      zIndex = 5;
    } else if (distance === 2) {
      // Second-level avatars
      scale = 0.6;
      opacity = 0.4;
      zIndex = 2;
    } else {
      // Far avatars (mostly hidden)
      scale = 0.4;
      opacity = 0.2;
      zIndex = 1;
    }

    const baseTranslateX = (relativePosition * 120) + (dragOffset * 0.5);
    
    return {
      transform: `translateX(${baseTranslateX}px) scale(${scale})`,
      opacity,
      zIndex,
      transition: isTransitioning && !dragStart ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
    };
  };

  const getCurrentAvatar = () => {
    const actualIndex = (currentIndex - centerOffset + avatarOptions.length) % avatarOptions.length;
    const avatarId = avatarOptions[actualIndex];
    return getAvatarById(avatarId);
  };

  const renderAvatarCarousel = (isCreateMode: boolean = true) => (
    <div className="mb-8">
      <label className="block text-white font-pixel mb-4 text-lg">
        Select Avatar:
      </label>
      
      {/* Carousel Container */}
      <div className="relative h-40 mb-6">
        {/* Carousel Track */}
        <div
          ref={carouselRef}
          className="relative h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {extendedAvatars.map((avatarId, index) => {
            const avatar = getAvatarById(avatarId);
            const style = getAvatarStyle(index);
            const isLocked = avatar?.locked || false;
            const distance = Math.abs(index - currentIndex);
            const isCenterAvatar = distance === 0;
            
            return (
              <div
                key={`${avatarId}-${index}`}
                className="absolute flex flex-col items-center cursor-pointer"
                style={style}
                onClick={() => handleAvatarClick(index)}
              >
                {/* Avatar Container */}
                <div 
                  className={`relative ${isLocked ? 'grayscale' : ''} ${
                    isCenterAvatar && !isLocked ? 'ring-4 ring-blue-400 ring-opacity-60 animate-pulse' : ''
                  }`}
                >
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      backgroundImage: `url("${getAvatarSprite(avatarId)}")`,
                      backgroundSize: '384px 256px',
                      backgroundPosition: '0 0', // Show only top-left frame
                      width: '96px',
                      height: '96px',
                    }}
                  />
                  {/* Enhanced Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-lg backdrop-blur-sm">
                      <Lock className="text-white drop-shadow-lg\" size={20} />
                    </div>
                  )}
                  {/* Selection Glow Effect */}
                  {isCenterAvatar && !isLocked && (
                    <div className="absolute inset-0 rounded-lg bg-blue-400 bg-opacity-20 animate-pulse"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="text-center mb-6">
        <div className="bg-gray-800 rounded-lg p-4 inline-block shadow-lg border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Selected Character</p>
          <p className="text-blue-400 font-semibold text-lg">{getCurrentAvatar()?.name}</p>
          {getCurrentAvatar()?.locked && (
            <p className="text-red-400 text-xs mt-1 flex items-center justify-center gap-1">
              <Lock size={12} />
              Locked
            </p>
          )}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {avatarOptions.map((_, index) => {
          const actualCurrentIndex = (currentIndex - centerOffset + avatarOptions.length) % avatarOptions.length;
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === actualCurrentIndex ? 'bg-blue-400 scale-125' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          );
        })}
      </div>

      {lockedMessage && (
        <div className="mt-4 text-warning-400 text-sm font-pixel text-center bg-warning-900 bg-opacity-20 p-3 rounded-lg border border-warning-700">
          {lockedMessage}
        </div>
      )}
    </div>
  );

  const renderInitialScreen = () => (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl w-full border-4 border-primary-600">
      <h2 className="text-2xl font-heading text-white mb-8 text-center">Welcome to the Neighborhood!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setScreenMode('create')}
          className="bg-primary-600 hover:bg-primary-700 p-8 rounded-lg text-white transition-all transform hover:scale-105 border-2 border-primary-400"
        >
          <Users className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-heading mb-2">Create Neighborhood</h3>
          <p className="font-pixel text-sm text-primary-200">Start a new team space as the neighborhood manager</p>
        </button>
        
        <button
          onClick={() => setScreenMode('join')}
          className="bg-secondary-600 hover:bg-secondary-700 p-8 rounded-lg text-white transition-all transform hover:scale-105 border-2 border-secondary-400"
        >
          <UserPlus className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-heading mb-2">Join Neighborhood</h3>
          <p className="font-pixel text-sm text-secondary-200">Join an existing team using an invite code</p>
        </button>
      </div>
      
      <button
        onClick={() => setScreenMode('instructions')}
        className="mt-6 w-full py-3 rounded-lg font-heading text-white bg-gray-600 hover:bg-gray-700 shadow-pixel button-pixel"
      >
        How To Play
      </button>
    </div>
  );

  const renderCreateScreen = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full border-4 border-primary-600">
      <div className="flex items-center mb-4">
        <button
          onClick={() => setScreenMode('initial')}
          className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="text-white" />
        </button>
        <h2 className="text-xl font-heading text-white">Create Your Character</h2>
      </div>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-white font-pixel mb-2">
          Your Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white font-pixel focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter your name"
        />
      </div>

      {renderAvatarCarousel(true)}

      <button
        onClick={handleStartGame}
        disabled={!name.trim()}
        className={`w-full py-3 rounded-lg font-heading text-white shadow-pixel button-pixel ${
          name.trim() ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-600 cursor-not-allowed'
        }`}
      >
        Create Neighborhood
      </button>
    </div>
  );

  const renderJoinScreen = () => (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full border-4 border-secondary-600 max-h-[90vh] overflow-y-auto">
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
            className="px-6 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg font-pixel shadow-pixel button-pixel"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="flex items-center mb-8">
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
          <div className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-pixel text-secondary-400 border-b border-gray-700 pb-2">
                Personal Information
              </h3>
              
              <div>
                <label htmlFor="name" className="block text-white font-pixel mb-3 text-base">
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
                <p id="name-help" className="mt-2 text-xs text-gray-400 font-pixel">
                  This will be displayed to your teammates
                </p>
              </div>
            </div>

            {/* Invitation Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-pixel text-secondary-400 border-b border-gray-700 pb-2">
                Neighborhood Access
              </h3>
              
              <div>
                <label htmlFor="inviteCode" className="block text-white font-pixel mb-3 text-base">
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
                <p id="invite-help" className="mt-2 text-xs text-gray-400 font-pixel">
                  Get this code from your team lead
                </p>
              </div>

              {/* Demo Codes Info */}
              <div className="bg-gray-900 bg-opacity-75 px-4 py-4 rounded-lg border border-gray-700">
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
            <div className="space-y-6">
              <h3 className="text-lg font-pixel text-secondary-400 border-b border-gray-700 pb-2">
                Character Selection
              </h3>
              {renderAvatarCarousel(false)}
            </div>

            {/* Submit Section */}
            <div className="pt-6 border-t border-gray-700">
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
              <p id="submit-help" className="mt-3 text-xs text-gray-400 font-pixel text-center">
                Your request will be sent to the team lead for approval
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderInstructionsScreen = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full border-4 border-secondary-600 text-white font-pixel">
      <div className="flex items-center mb-4">
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
      
      <div className="space-y-4 mb-6">
        <p>Welcome to <span className="text-primary-400">"Knock Knock, Shippers!"</span> - a team management game where you track your weekly accomplishments!</p>
        
        <div>
          <h3 className="font-heading text-secondary-400 mb-1">Game Basics:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Walk around the neighborhood to see other team members' houses</li>
            <li>Each house has a board showing weekly accomplishments</li>
            <li>Update your board every Friday with tasks you completed</li>
            <li>Categorize tasks as: Project, Ad Hoc, or Routine</li>
            <li>Rank your tasks by priority (most important first!)</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-heading text-secondary-400 mb-1">Controls:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use arrow keys or WASD to move your character</li>
            <li>Press Space or E to interact with boards and objects</li>
            <li>Press ESC to open menu</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-heading text-secondary-400 mb-1">Task Categories:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="text-success-400">Project</span>: Major tasks moving your projects forward</li>
            <li><span className="text-warning-400">Ad Hoc</span>: One-time tasks not related to main projects</li>
            <li><span className="text-primary-400">Routine</span>: Recurring tasks and maintenance work</li>
          </ul>
        </div>
      </div>
      
      <button
        onClick={() => setScreenMode('initial')}
        className="w-full py-3 rounded-lg font-heading text-white bg-secondary-600 hover:bg-secondary-700 shadow-pixel button-pixel"
      >
        Back to Home
      </button>
    </div>
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

      {screenMode === 'initial' && renderInitialScreen()}
      {screenMode === 'create' && renderCreateScreen()}
      {screenMode === 'join' && renderJoinScreen()}
      {screenMode === 'instructions' && renderInstructionsScreen()}
    </div>
  );
};

export default IntroScreen;