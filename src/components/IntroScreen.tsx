import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { MapPin, Lock, ChevronLeft, ChevronRight, Users, UserPlus, ArrowLeft } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const avatarContainerRef = useRef<HTMLDivElement>(null);

  const handleStartGame = () => {
    if (name.trim()) {
      setPlayerName(name);
      setPlayerAvatar(selectedAvatarId);
      onStartGame();
    }
  };

  const handleJoinRequest = () => {
    if (name.trim() && inviteCode.trim()) {
      setIsWaitingApproval(true);
    }
  };

  const avatarOptions = [1, 3, 4, 5, 6, 7];
  const itemsPerPage = 4;
  const totalPages = Math.ceil(avatarOptions.length / itemsPerPage);

  const getAvatarName = (id: number) => {
    switch (id) {
      case 1: return 'Casual';
      case 3: return 'Orc Warrior';
      case 4: return 'Vampire Lord';
      case 5: return 'Orc Shaman';
      case 6: return 'Vampire Noble';
      case 7: return 'Orc Chief';
      default: return 'Unknown';
    }
  };

  const getAvatarSprite = (id: number) => {
    switch (id) {
      case 1: return '/Unarmed_Walk_full.png';
      case 3: return '/orc1_walk_full.png';
      case 4: return '/Vampires1_Walk_full.png';
      case 5: return '/orc2_walk_full.png';
      case 6: return '/Vampires2_Walk_full.png';
      case 7: return '/orc3_walk_full.png';
      default: return '/Unarmed_Walk_full.png';
    }
  };

  const handleAvatarClick = (id: number) => {
    if (id === 1) {
      setSelectedAvatarId(id);
    } else {
      setLockedMessage('This avatar is locked. Play more to unlock!');
      setTimeout(() => setLockedMessage(''), 3000);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  useEffect(() => {
    setCanScrollLeft(currentPage > 0);
    setCanScrollRight(currentPage < totalPages - 1);
  }, [currentPage, totalPages]);

  const visibleAvatars = avatarOptions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
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
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-xl w-full border-2 border-primary-600">
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

      <div className="mb-6">
        <label className="block text-white font-pixel mb-2">
          Select Avatar:
        </label>
        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={handlePrevPage}
              disabled={isAnimating}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-primary-600 hover:bg-primary-700 transition-all p-1 rounded-full text-white shadow-lg transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
          )}
          
          {canScrollRight && (
            <button
              onClick={handleNextPage}
              disabled={isAnimating}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-primary-600 hover:bg-primary-700 transition-all p-1 rounded-full text-white shadow-lg transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          )}

          <div 
            ref={avatarContainerRef}
            className="relative overflow-hidden"
          >
            <div 
              className={`grid grid-cols-4 gap-2 transition-all duration-300 ease-in-out transform ${
                isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{
                transform: `translateX(-${currentPage * 100}%)`,
              }}
            >
              {visibleAvatars.map((id) => (
                <div
                  key={id}
                  onClick={() => handleAvatarClick(id)}
                  className={`relative bg-gray-900 p-2 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-gray-800 ${
                    selectedAvatarId === id
                      ? 'border-primary-400'
                      : 'border-gray-700'
                  } ${id !== 1 ? 'opacity-50' : ''}`}
                >
                  <div 
                    className="w-20 h-20 flex items-center justify-center rounded-lg overflow-hidden"
                  >
                    <div 
                      className={`character ${id !== 1 ? 'grayscale' : ''}`}
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundImage: `url("${getAvatarSprite(id)}")`,
                        backgroundPosition: '-16px 0px',
                        transform: 'scale(1.25)',
                        imageRendering: 'pixelated',
                        transformOrigin: 'center',
                      }}
                    />
                    {id !== 1 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                        <Lock className="text-white\" size={16} />
                      </div>
                    )}
                  </div>
                  <div className="text-center mt-1">
                    <span className={`font-pixel text-xs px-2 py-0.5 rounded-full ${
                      id === 1 ? 'bg-primary-900 text-primary-400' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {getAvatarName(id)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {lockedMessage && (
          <div className="mt-2 text-warning-400 text-xs font-pixel text-center animate-bounce">
            {lockedMessage}
          </div>
        )}
      </div>

      <button
        onClick={handleStartGame}
        disabled={!name.trim()}
        className={`w-full py-2 rounded-lg font-heading text-white text-sm shadow-pixel button-pixel ${
          name.trim() ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-600 cursor-not-allowed'
        }`}
      >
        Create Neighborhood
      </button>
    </div>
  );

  const renderJoinScreen = () => (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl w-full border-4 border-secondary-600">
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
          <div className="flex items-center mb-6">
            <button
              onClick={() => setScreenMode('initial')}
              className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="text-white" />
            </button>
            <h2 className="text-xl font-heading text-white">Join Neighborhood</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white font-pixel mb-2">
                Your Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white font-pixel focus:outline-none focus:ring-2 focus:ring-secondary-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="inviteCode" className="block text-white font-pixel mb-2">
                Invitation Code:
              </label>
              <input
                type="text"
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white font-pixel focus:outline-none focus:ring-2 focus:ring-secondary-500"
                placeholder="Enter the invitation code"
              />
            </div>

            <div className="mb-8">
              <label className="block text-white font-pixel mb-4">
                Select Avatar:
              </label>
              <div className="relative">
                {canScrollLeft && (
                  <button
                    onClick={handlePrevPage}
                    disabled={isAnimating}
                    className="absolute -left-8 top-1/2 -translate-y-1/2 z-10 bg-gray-700 hover:bg-gray-600 transition-all p-2 rounded-full text-white shadow-lg transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-secondary-600"
                  >
                    <ChevronLeft size={16} className="text-secondary-400" />
                  </button>
                )}
                
                {canScrollRight && (
                  <button
                    onClick={handleNextPage}
                    disabled={isAnimating}
                    className="absolute -right-8 top-1/2 -translate-y-1/2 z-10 bg-gray-700 hover:bg-gray-600 transition-all p-2 rounded-full text-white shadow-lg transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-secondary-600"
                  >
                    <ChevronRight size={16} className="text-secondary-400" />
                  </button>
                )}

                <div 
                  ref={avatarContainerRef}
                  className="relative overflow-hidden px-2"
                >
                  <div 
                    className={`grid grid-cols-4 gap-4 transition-all duration-300 ease-in-out transform ${
                      isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                    }`}
                    style={{
                      transform: `translateX(-${currentPage * 100}%)`,
                    }}
                  >
                    {visibleAvatars.map((id) => (
                      <div
                        key={id}
                        onClick={() => handleAvatarClick(id)}
                        className={`relative bg-gray-700 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:bg-gray-600 ${
                          selectedAvatarId === id
                            ? 'border-secondary-400 transform scale-105 shadow-xl'
                            : 'border-gray-600'
                        } ${id !== 1 ? 'opacity-50' : ''}`}
                      >
                        <div 
                          className="w-24 h-24 flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden"
                          style={{
                            backgroundImage: 'radial-gradient(circle at center, rgba(20, 184, 166, 0.1) 0%, rgba(17, 24, 39, 0.2) 100%)',
                          }}
                        >
                          <div 
                            className={`character ${id !== 1 ? 'grayscale' : ''}`}
                            style={{
                              width: '48px',
                              height: '48px',
                              backgroundImage: `url("${getAvatarSprite(id)}")`,
                              backgroundPosition: '-24px 0px',
                              transform: 'scale(1.5)',
                              imageRendering: 'pixelated',
                              transformOrigin: 'center',
                            }}
                          />
                          {id !== 1 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                              <Lock className="text-white\" size={24} />
                            </div>
                          )}
                        </div>
                        <div className="text-center mt-2">
                          <span className={`font-pixel text-xs px-3 py-1 bg-gray-800 rounded-full ${
                            id === 1 ? 'text-secondary-400 border border-secondary-400' : 'text-gray-400'
                          }`}>
                            {getAvatarName(id)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {lockedMessage && (
                <div className="mt-4 text-warning-400 text-sm font-pixel text-center animate-bounce">
                  {lockedMessage}
                </div>
              )}
            </div>

            <button
              onClick={handleJoinRequest}
              disabled={!name.trim() || !inviteCode.trim()}
              className={`w-full py-3 rounded-lg font-heading text-white shadow-pixel button-pixel ${
                name.trim() && inviteCode.trim()
                  ? 'bg-secondary-600 hover:bg-secondary-700'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              Submit Join Request
            </button>
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