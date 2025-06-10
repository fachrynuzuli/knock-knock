import React, { useState, useEffect, useRef } from 'react';
import { Lock, ChevronLeft, ChevronRight } from 'lucide-react';
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
    const actualIndex = (currentIndex - centerOffset + 1) % avatarOptions.length;
    goToSlide(actualIndex);
  };

  const prevSlide = () => {
    const actualIndex = (currentIndex - centerOffset - 1 + avatarOptions.length) % avatarOptions.length;
    goToSlide(actualIndex);
  };

  const handleAvatarClick = (index: number) => {
    const clickedAvatarId = extendedAvatars[index];
    const avatar = getAvatarById(clickedAvatarId);
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
      
      // Check if it's locked and show message after centering
      const validation = validateAvatarSelection(clickedAvatarId);
      if (!validation.isValid) {
        setTimeout(() => {
          onLockedMessage(validation.message || 'This avatar is locked.');
        }, 350);
      } else {
        setTimeout(() => {
          onAvatarSelect(clickedAvatarId);
        }, 350);
      }
    } else {
      // Avatar is already centered, handle selection
      const validation = validateAvatarSelection(clickedAvatarId);
      if (!validation.isValid) {
        onLockedMessage(validation.message || 'This avatar is locked.');
        return;
      }
      
      onAvatarSelect(clickedAvatarId);
    }
  };

  const getAvatarStyle = (index: number) => {
    const distance = Math.abs(index - currentIndex);
    const relativePosition = index - currentIndex;
    
    let scale, opacity, zIndex;
    
    if (distance === 0) {
      scale = 1.2;
      opacity = 1;
      zIndex = 10;
    } else if (distance === 1) {
      scale = 0.8;
      opacity = 0.7;
      zIndex = 5;
    } else if (distance === 2) {
      scale = 0.6;
      opacity = 0.4;
      zIndex = 2;
    } else {
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

  return (
    <div className="mb-8">
      <label className="block text-white font-pixel mb-4 text-lg">
        Select Avatar:
      </label>
      
      {/* Carousel Container */}
      <div className="relative h-40 mb-6">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center text-white transition-all"
        >
          <ChevronRight size={20} />
        </button>

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
                {/* Avatar Container */}
                <div 
                  className={`relative ${isLocked ? 'grayscale' : ''} ${
                    isCenterAvatar && isSelected && !isLocked ? 'ring-4 ring-blue-400 ring-opacity-60 animate-pulse' : ''
                  }`}
                >
                  {/* Use portrait if available, fallback to sprite */}
                  {!hasPortraitError ? (
                    <img
                      src={portraitPath}
                      alt={avatar?.name || 'Avatar'}
                      className="w-20 h-20 rounded-lg object-cover"
                      onError={() => handlePortraitError(avatarId)}
                    />
                  ) : (
                    <div 
                      className="rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: `url("${avatarDisplayInfo.spritePath}")`,
                        backgroundSize: `${avatarDisplayInfo.frameWidth * avatarDisplayInfo.frameCount}px ${avatarDisplayInfo.frameHeight * avatarDisplayInfo.rowCount}px`,
                        backgroundPosition: '0 0',
                        width: '80px',
                        height: '80px',
                      }}
                    />
                  )}
                  
                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg backdrop-blur-sm">
                      <Lock className="text-white drop-shadow-lg" size={20} />
                    </div>
                  )}
                  
                  {/* Selection Glow Effect */}
                  {isCenterAvatar && isSelected && !isLocked && (
                    <div className="absolute inset-0 rounded-lg bg-blue-400 bg-opacity-20 animate-pulse"></div>
                  )}
                  
                  {/* Disabled overlay for locked avatars */}
                  {isLocked && (
                    <div className="absolute inset-0 rounded-lg border-2 border-red-500 border-opacity-30"></div>
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
          <p className={`font-semibold text-lg ${
            getCurrentAvatar()?.locked ? 'text-red-400' : 'text-blue-400'
          }`}>
            {getCurrentAvatar()?.name}
          </p>
          {getCurrentAvatar()?.locked && (
            <p className="text-red-400 text-xs mt-1 flex items-center justify-center gap-1">
              <Lock size={12} />
              Locked
            </p>
          )}
          {selectedAvatarId !== avatarOptions[(currentIndex - centerOffset + avatarOptions.length) % avatarOptions.length] && (
            <p className="text-yellow-400 text-xs mt-1">
              Click center avatar to select
            </p>
          )}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {avatarOptions.map((avatarId, index) => {
          const actualCurrentIndex = (currentIndex - centerOffset + avatarOptions.length) % avatarOptions.length;
          const avatar = getAvatarById(avatarId);
          const isLocked = avatar?.locked || false;
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isLocked}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === actualCurrentIndex ? 'bg-blue-400 scale-125' : 
                isLocked ? 'bg-red-600 opacity-50 cursor-not-allowed' :
                'bg-gray-600 hover:bg-gray-500'
              }`}
              title={isLocked ? 'Locked Avatar' : avatar?.name}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AvatarCarousel;