import React, { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface IntroScreenProps {
  onStartGame: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStartGame }) => {
  const { setPlayerName, setPlayerAvatar } = useGameContext();
  const [name, setName] = useState('');
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleStartGame = () => {
    if (name.trim()) {
      setPlayerName(name);
      setPlayerAvatar(avatarOptions[currentAvatarIndex]);
      onStartGame();
    }
  };

  const avatarOptions = [1, 2, 3, 4, 5, 6, 7];

  const getAvatarName = (id: number) => {
    switch (id) {
      case 1: return 'Casual';
      case 2: return 'Business';
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
      case 2: return '/suittie_walk_full.png';
      case 3: return '/orc1_walk_full.png';
      case 4: return '/Vampires1_Walk_full.png';
      case 5: return '/orc2_walk_full.png';
      case 6: return '/Vampires2_Walk_full.png';
      case 7: return '/orc3_walk_full.png';
      default: return '/Unarmed_Walk_full.png';
    }
  };

  const handlePreviousAvatar = () => {
    setCurrentAvatarIndex((prev) => 
      prev === 0 ? avatarOptions.length - 1 : prev - 1
    );
  };

  const handleNextAvatar = () => {
    setCurrentAvatarIndex((prev) => 
      prev === avatarOptions.length - 1 ? 0 : prev + 1
    );
  };

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

      {!showInstructions ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full border-4 border-primary-600">
          <h2 className="text-xl font-heading text-white mb-4">Create Your Character</h2>
          
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
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePreviousAvatar}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200 hover:text-primary-400"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="relative bg-gray-700 p-4 rounded-lg border-2 border-gray-600 transition-transform duration-200 transform hover:scale-105">
                <div 
                  className="w-20 h-20 flex items-center justify-center bg-gray-800 rounded-lg"
                  style={{
                    backgroundImage: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, rgba(17, 24, 39, 0.2) 100%)',
                  }}
                >
                  <div 
                    className="character"
                    style={{
                      width: '32px',
                      height: '48px',
                      backgroundImage: `url("${getAvatarSprite(avatarOptions[currentAvatarIndex])}")`,
                      backgroundPosition: '-10px -10px',
                      transform: 'scale(1.5)',
                      transformOrigin: 'center',
                    }}
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="text-primary-400 font-pixel text-sm px-3 py-1 bg-gray-800 rounded-full">
                    {getAvatarName(avatarOptions[currentAvatarIndex])}
                  </span>
                </div>
              </div>

              <button
                onClick={handleNextAvatar}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200 hover:text-primary-400"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleStartGame}
              disabled={!name.trim()}
              className={`w-full py-3 rounded-lg font-heading text-white shadow-pixel button-pixel ${
                name.trim() ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              Start Game
            </button>
            <button
              onClick={() => setShowInstructions(true)}
              className="w-full py-3 rounded-lg font-heading text-white bg-secondary-600 hover:bg-secondary-700 shadow-pixel button-pixel"
            >
              How To Play
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full border-4 border-secondary-600 text-white font-pixel">
          <h2 className="text-xl font-heading text-white mb-4 flex items-center">
            <MapPin className="mr-2" /> How To Play
          </h2>
          
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
            onClick={() => setShowInstructions(false)}
            className="w-full py-3 rounded-lg font-heading text-white bg-secondary-600 hover:bg-secondary-700 shadow-pixel button-pixel"
          >
            Back to Character Creation
          </button>
        </div>
      )}
    </div>
  );
};

export default IntroScreen;