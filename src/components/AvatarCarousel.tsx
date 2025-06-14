import React, { useState, useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import { getAvatarById, getAllAvatarIds } from '../data/avatars';

interface AvatarCarouselProps {
  selectedAvatarId: number;
  onAvatarSelect: (avatarId: number) => void;
  onLockedMessage: (message: string) => void;
}

const AvatarCarousel: React.FC<AvatarCarouselProps> = ({
  selectedAvatarId,
  onAvatarSelect,
  onLockedMessage,
}) => {
  const avatarOptions = getAllAvatarIds();
  
  // Create extended array for infinite scroll
  const extendedAvatars = [...avatarOptions, ...avatarOptions, ...avatarOptions];
  const centerOffset = avatarOptions.length;

  const [currentIndex, setCurrentIndex] = useState(centerOffset);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; index: number } | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [portraitErrors, setPortraitErrors] = useState<Record<number, boolean>>({});
  
  const carouselRef = useRef<HTMLDivElement>(null);

  // Initialize to show selected avatar in center
  useEffect(() => {
    const selectedIndex = avatarOptions.findIndex(id => id === selectedAvatarId);
    if (selectedIndex !== -1) {
      setCurrentIndex(centerOffset + selectedIndex);
    }
  }, [selectedAvatarId, centerOffset]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-select centered avatar and manage locked messages
  useEffect(() => {
    if (!isTransitioning) {
      // Get the avatar currently in the center
      const actualIndex = (currentIndex - centerOffset + avatarOptions.length) % avatarOptions.length;
      const centeredAvatarId = avatarOptions[actualIndex];
      
      // ALWAYS notify parent of the centered avatar, regardless of lock status
      onAvatarSelect(centeredAvatarId);
      
      // Handle locked message display
      const validation = validateAvatarSelection(centeredAvatarId);
      if (validation.isValid) {
        // Clear any existing locked message for unlocked avatars
        onLockedMessage('');
      } else {
        // Show locked message for locked avatars
        onLockedMessage(validation.message || 'This avatar is locked.');
      }
    }
  }, [currentIndex, isTransitioning, onAvatarSelect, onLockedMessage]);

  // Reset position when reaching boundaries for infinite scroll
  useEffect(() => {
    if (currentIndex < centerOffset) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + avatarOptions.length);
      }, 300);
    } else if (currentIndex >= centerOffset + avatarOptions.length) {
      setTimeout(() => {
        setCurrentIndex(currentIndex - avatarOptions.length);
      }, 300);
    }
  }, [currentIndex, avatarOptions.length, centerOffset]);

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

  const getPortraitPath = (avatarId: number): string => {
    return `/portraits/avatar_${avatarId}_portrait.png`;
  };

  const handlePortraitError = (avatarId: number) => {
    setPortraitErrors(prev => ({ ...prev, [avatarId]: true }));
  };

  const getAvatarDisplayInfo = (id: number) => {
    const avatar = getAvatarById(id);
    const stage = avatar?.stages[0];
    
    if (!stage) {
      return {
        spritePath: '/lv1_male_civilian.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 6,
        rowCount: 4,
      };
    }
    
    return {
      spritePath: stage.spritePath,
      frameWidth: stage.frameWidth,
      frameHeight: stage.frameHeight,
      frameCount: stage.frameCount,
      rowCount: stage.rowCount,
    };
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
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleAvatarClick = (index: number) => {
    const relativeIndex = index - currentIndex;
    
    if (relativeIndex !== 0) {
      // Non-center avatar clicked - move it to center with smart direction
      const currentActualIndex = (currentIndex - centerOffset + avatarOptions.length) % avatarOptions.length;
      const targetActualIndex = (index - centerOffset + avatarOptions.length) % avatarOptions.length;
      
      // Calculate shortest path
      const forwardDistance = (targetActualIndex - currentActualIndex + avatarOptions.length) % avatarOptions.length;
      const backwardDistance = (currentActualIndex - targetActualIndex + avatarOptions.length) % avatarOptions.length;
      
      let newIndex;
      if (forwardDistance <= backwardDistance) {
        newIndex = currentIndex + forwardDistance;
      } else {
        newIndex = currentIndex - backwardDistance;
      }
      
      setIsTransitioning(true);
      setCurrentIndex(newIndex);
      setTimeout(() => setIsTransitioning(false), 300);
    }
    // Note: Selection and locked message handling is now done automatically in the useEffect
  };

  const getAvatarStyle = (index: number) => {
    const distance = Math.abs(index - currentIndex);
    const relativePosition = index - currentIndex;
    
    let scale, opacity, zIndex;
    
    if (distance === 0) {
      scale = 1.3;
      opacity = 1;
      zIndex = 10;
    } else if (distance === 1) {
      scale = 0.9;
      opacity = 0.8;
      zIndex = 5;
    } else if (distance === 2) {
      scale = 0.7;
      opacity = 0.5;
      zIndex = 2;
    } else {
      scale = 0.5;
      opacity = 0.3;
      zIndex = 1;
    }

    const baseTranslateX = (relativePosition * 160) + (dragOffset * 0.5); // Increased spacing from 140px to 160px
    
    return {
      transform: `translateX(${baseTranslateX}px) scale(${scale})`,
      opacity,
      zIndex,
      transition: isTransitioning && !dragStart ? 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
    };
  };

  const getCurrentAvatar = () => {
    const actualIndex = (currentIndex - centerOffset + avatarOptions.length) % avatarOptions.length;
    const avatarId = avatarOptions[actualIndex];
    return getAvatarById(avatarId);
  };

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
    
    const threshold = 60;
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

  return (
    <div className="mb-6">
      <label className="block text-white font-pixel mb-4 text-lg">
        Select Avatar:
      </label>
      
      {/* Carousel Container */}
      <div className="relative h-32 mb-4">
        {/* Enhanced Multi-Layer Gradient Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: `
              radial-gradient(ellipse 65% 100% at 50% 50%, transparent 35%, rgba(17, 24, 39, 0.2) 55%, rgba(17, 24, 39, 0.6) 80%),
              linear-gradient(90deg, 
                rgba(17, 24, 39, 0.9) 0%, 
                rgba(17, 24, 39, 0.5) 12%, 
                rgba(79, 70, 229, 0.06) 20%, 
                rgba(99, 102, 241, 0.03) 30%, 
                transparent 40%, 
                transparent 60%, 
                rgba(99, 102, 241, 0.03) 70%, 
                rgba(79, 70, 229, 0.06) 80%, 
                rgba(17, 24, 39, 0.5) 88%, 
                rgba(17, 24, 39, 0.9) 100%
              ),
              linear-gradient(180deg, 
                rgba(17, 24, 39, 0.3) 0%, 
                transparent 25%, 
                transparent 75%, 
                rgba(17, 24, 39, 0.3) 100%
              )
            `
          }}
        />
        
        {/* Refined Spotlight Effect for Center Avatar */}
        <div 
          className="absolute inset-0 pointer-events-none z-15"
          style={{
            background: `
              radial-gradient(ellipse 30% 65% at 50% 50%, 
                rgba(99, 102, 241, 0.12) 0%, 
                rgba(79, 70, 229, 0.06) 35%, 
                transparent 70%
              )
            `
          }}
        />
        
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
            const avatarDisplayInfo = getAvatarDisplayInfo(avatarId);
            const style = getAvatarStyle(index);
            const isLocked = avatar?.locked || false;
            const distance = Math.abs(index - currentIndex);
            const isCenterAvatar = distance === 0;
            const isSelected = selectedAvatarId === avatarId;
            const portraitPath = getPortraitPath(avatarId);
            const hasPortraitError = portraitErrors[avatarId];
            
            return (
              <div
                key={`${avatarId}-${index}`}
                className="absolute flex flex-col items-center cursor-pointer"
                style={style}
                onClick={() => handleAvatarClick(index)}
                title={isLocked ? `Locked: ${avatar?.unlockRequirement ? 
                  `${avatar.unlockRequirement.type === 'activities' ? 'Complete' : 
                    avatar.unlockRequirement.type === 'badges' ? 'Earn' : 'Play for'} ${avatar.unlockRequirement.count} ${avatar.unlockRequirement.type}` : 
                  'Play more to unlock'}` : avatar?.name}
              >
                {/* Avatar Container with Enhanced Styling */}
                <div 
                  className={`relative ${isLocked ? 'grayscale' : ''}`}
                  style={{
                    filter: isCenterAvatar && !isLocked ? 'drop-shadow(0 8px 16px rgba(99, 102, 241, 0.3))' : 'none'
                  }}
                >
                  {/* Use portrait if available, fallback to sprite */}
                  {!hasPortraitError ? (
                    <img
                      src={portraitPath}
                      alt={avatar?.name || 'Avatar'}
                      className="w-24 h-24 rounded-lg object-cover shadow-pixel"
                      onError={() => handlePortraitError(avatarId)}
                      style={{
                        boxShadow: isCenterAvatar && !isLocked ? 
                          '0 4px 0 rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.4)' : 
                          '0 4px 0 rgba(0, 0, 0, 0.5)'
                      }}
                    />
                  ) : (
                    <div 
                      className="rounded-lg overflow-hidden shadow-pixel"
                      style={{
                        backgroundImage: `url("${avatarDisplayInfo.spritePath}")`,
                        backgroundSize: `${avatarDisplayInfo.frameWidth * avatarDisplayInfo.frameCount}px ${avatarDisplayInfo.frameHeight * avatarDisplayInfo.rowCount}px`,
                        backgroundPosition: '0 0',
                        width: '80px',
                        height: '80px',
                        boxShadow: isCenterAvatar && !isLocked ? 
                          '0 4px 0 rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.4)' : 
                          '0 4px 0 rgba(0, 0, 0, 0.5)'
                      }}
                    />
                  )}
                  
                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg backdrop-blur-sm">
                      <Lock className="text-white drop-shadow-lg\" size={24} />
                    </div>
                  )}
                  
                  {/* Disabled overlay for locked avatars */}
                  {isLocked && (
                    <div className="absolute inset-0 rounded-lg border-2 border-red-500 border-opacity-40"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="text-center mb-6">
        <div 
          className="bg-gray-800 rounded-lg p-4 inline-block shadow-pixel border border-gray-700"
          style={{
            background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.9) 0%, rgba(75, 85, 99, 0.9) 100%)',
            boxShadow: '0 4px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <p className="text-gray-400 text-sm mb-1">Selected Character</p>
          <p className={`font-semibold text-xl ${
            getCurrentAvatar()?.locked ? 'text-red-400' : 'text-primary-400'
          }`}>
            {getCurrentAvatar()?.name}
          </p>
          {getCurrentAvatar()?.locked && (
            <p className="text-red-400 text-sm mt-1 flex items-center justify-center gap-2">
              
            </p>
          )}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-4 space-x-3">
        {avatarOptions.map((avatarId, index) => {
          const actualCurrentIndex = (currentIndex - centerOffset + avatarOptions.length) % avatarOptions.length;
          const avatar = getAvatarById(avatarId);
          const isLocked = avatar?.locked || false;
          const isActive = index === actualCurrentIndex;
          
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isLocked}
              className={`w-5 h-2 rounded-full transition-all duration-300 shadow-pixel ${
                isActive ? 'bg-primary-400 scale-125' : 
                isLocked ? 'bg-red-600 opacity-50 cursor-not-allowed' :
                'bg-gray-600 hover:bg-gray-500'
              }`}
              style={{
                boxShadow: isActive ? 
                  '0 2px 0 rgba(0, 0, 0, 0.5), 0 0 10px rgba(99, 102, 241, 0.6)' : 
                  '0 2px 0 rgba(0, 0, 0, 0.5)'
              }}
              title={isLocked ? 'Locked Avatar' : avatar?.name}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AvatarCarousel;