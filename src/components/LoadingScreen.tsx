import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ANIMATION_CONFIG, UI_CONFIG, EFFECTS_CONFIG } from '../config/gameConfig';
import WalkingCharacterAnimation from './WalkingCharacterAnimation';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  message?: string; // New optional prop for custom loading messages
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onLoadingComplete, 
  message = "Loading your neighborhood..." 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50"
      role="dialog"
      aria-label="Loading screen"
      aria-live="polite"
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(45deg, #374151 25%, transparent 25%), linear-gradient(-45deg, #374151 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #374151 75%), linear-gradient(-45deg, transparent 75%, #374151 75%)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 0 16px, 16px -16px, -16px 0px',
        }}
        aria-hidden="true"
      />
      
      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Game Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-4 rounded-full"
              style={{ backgroundColor: 'transparent' }}
              aria-hidden="true"
            >
              {/* 2x Scaled Male Character Walking Right */}
              <WalkingCharacterAnimation
                spritePath="/lv1_male_civilian.png"
                frameWidth={64}
                frameHeight={64}
                frameCount={6}
                directionRowIndex={2} // Right direction
                scale={2} // 2x bigger for loading screen
                className=""
              />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading text-primary-400 mb-2">
            Knock-Knock, Shippers!
          </h1>
          <p className="text-lg md:text-xl font-pixel text-gray-300">
            {message}
          </p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col items-center space-y-6"
        >
          {/* Pixel Art Loading Bar */}
          <div 
            className="bg-gray-800 border-2 border-gray-600 rounded-lg overflow-hidden"
            style={{ width: '256px', height: '16px' }}
            role="progressbar"
            aria-label="Loading progress"
            aria-valuenow={0}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: ANIMATION_CONFIG.LOADING_DURATION / 1000, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-primary-600 to-secondary-500"
            />
          </div>

          {/* Loading Spinner */}
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              aria-hidden="true"
            >
              <Loader2 className="w-6 h-6 text-primary-400" />
            </motion.div>
            <span className="text-gray-400 font-pixel">Preparing assets...</span>
          </div>

          {/* Pixel Art Houses Animation */}
          <div className="flex space-x-4 mt-8" aria-hidden="true">
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.8 + (index * 0.2), 
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 1
                }}
                className="w-8 h-8 bg-primary-600 border-2 border-primary-800 rounded-sm"
                style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Loading Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-12 max-w-md mx-auto"
        >
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
            <p className="text-gray-300 font-pixel text-sm">
              💡 <span className="text-primary-400">Tip:</span> Use WASD keys to move around the neighborhood and E to interact with houses!
            </p>
          </div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[...Array(EFFECTS_CONFIG.LOADING_PARTICLES)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingScreen;