import React, { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { Users, UserPlus, MapPin } from 'lucide-react';

interface IntroScreenProps {
  onStartGame: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStartGame }) => {
  const { setPlayerName, setPlayerAvatar } = useGameContext();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(1);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleStartGame = () => {
    if (name.trim()) {
      setPlayerName(name);
      setPlayerAvatar(avatar);
      onStartGame();
    }
  };

  const avatarOptions = [1, 2, 3, 4];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 px-4">
      <div className="text-center mb-8 animate-bounce-slow">
        <h1 className="text-4xl md:text-6xl font-heading text-primary-400 mb-2">
          Knock Knock,Shippers!
        </h1>
        <p className="text-xl md:text-2xl font-pixel text-white">
          A non-boring task reporting sheet
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
            <div className="grid grid-cols-4 gap-2">
              {avatarOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => setAvatar(option)}
                  className={`cursor-pointer p-2 rounded-lg transition-all ${
                    avatar === option ? 'bg-primary-600 ring-2 ring-white' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full overflow-hidden">
                    <img 
                      src={`/sprites/character${option}.png`} 
                      alt={`Avatar ${option}`} 
                      className="w-full h-full object-cover pixel-art"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/6366F1/FFFFFF?text=Avatar';
                      }}
                    />
                  </div>
                </div>
              ))}
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