import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Users, Trophy, Star, ArrowRight, Sparkles, Target, BarChart3, PlayCircle, Pause, Volume2, VolumeX } from 'lucide-react';
import { ANIMATION_CONFIG, EFFECTS_CONFIG } from '../config/gameConfig';
import WalkingCharacterAnimation from './WalkingCharacterAnimation';

interface LandingPageProps {
  onEnterGameFlow: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterGameFlow }) => {
  // Enable scrolling when landing page mounts
  useEffect(() => {
    document.body.classList.add('landing-page');
    
    // Cleanup when component unmounts
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  // Video player state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideoControls, setShowVideoControls] = useState(false);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll();
  
  // Background particles - move slower than scroll (parallax background effect)
  const particlesY = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const particlesOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.6, 0.4, 0.1]);
  
  // Scanlines - subtle movement
  const scanlinesY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  
  // Hero section - slight parallax movement
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 0.8, 0.3]);
  
  // Title effects - zoom out and fade as user scrolls
  const titleScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  
  // Character animation - more dramatic movement
  const characterY = useTransform(scrollYProgress, [0, 0.4], [0, -200]);
  const characterScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.2]);
  const characterRotate = useTransform(scrollYProgress, [0, 0.5], [0, 5]);
  
  // Video section parallax
  const videoY = useTransform(scrollYProgress, [0.1, 0.5], [50, -100]);
  const videoScale = useTransform(scrollYProgress, [0.1, 0.4], [0.95, 1.05]);
  const videoOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.6], [0, 1, 0.8]);
  
  // Features section - slide up effect
  const featuresY = useTransform(scrollYProgress, [0.3, 0.7], [100, -50]);
  const featuresOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.9], [0, 1, 0.7]);
  
  // How it works section - staggered parallax
  const howItWorksY = useTransform(scrollYProgress, [0.5, 0.9], [150, -100]);
  const howItWorksScale = useTransform(scrollYProgress, [0.5, 0.7], [0.9, 1]);
  
  // Final CTA - dramatic entrance
  const finalCtaY = useTransform(scrollYProgress, [0.7, 1], [200, -150]);
  const finalCtaScale = useTransform(scrollYProgress, [0.8, 1], [0.8, 1.1]);

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    // In a real implementation, you would start the video here
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
    // In a real implementation, you would pause the video here
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, you would toggle video audio here
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-x-hidden">
      {/* Global Bolt Logo for landing page - with spinning animation and responsive sizing */}
      <img
        src="/white_circle_360x360.png"
        alt="Built with Bolt"
        className="fixed bottom-2 left-2 z-50 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 opacity-100 bolt-logo-spin"
        style={{ imageRendering: 'auto' }}
      />

      {/* Animated background particles with parallax */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none" 
        style={{ y: particlesY, opacity: particlesOpacity }}
        aria-hidden="true"
      >
        {[...Array(EFFECTS_CONFIG.INTRO_PARTICLES)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0.2, 0],
              scale: [1, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Scanlines effect with parallax */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-10 scanlines-effect" 
        style={{ y: scanlinesY }}
        aria-hidden="true" 
      />

      {/* Main Content - Scrollable */}
      <div className="relative z-20 flex flex-col">
        {/* Hero Section with parallax */}
        <motion.section 
          className="flex-1 flex items-center justify-center px-4 py-12"
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        >
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo/Icon with enhanced parallax */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ y: characterY, scale: characterScale, rotate: characterRotate }}
              className="mb-8"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="p-6 rounded-2xl"
                  style={{ backgroundColor: 'transparent' }}
                >
                  {/* 1.5x Scaled Male Character Walking Right */}
                  <WalkingCharacterAnimation
                    spritePath="/lv1_male_civilian.png"
                    frameWidth={64}
                    frameHeight={64}
                    frameCount={6}
                    directionRowIndex={2} // Right direction
                    scale={1.5} // 1.5x size instead of 3x
                    className=""
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Main Title with zoom effect */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ scale: titleScale, y: titleY }}
              className="text-4xl md:text-6xl lg:text-7xl font-heading text-primary-400 mb-6 glow-text title-glow"
            >
              Knock-Knock, Shippers!
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl lg:text-3xl font-pixel text-white mb-4 glow-text-subtle"
            >
              Transform Team Reporting Into an Adventure
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto font-pixel leading-relaxed"
            >
              Say goodbye to boring weekly status updates. Build your virtual neighborhood, 
              showcase your accomplishments, and celebrate your team's success in a gamified experience 
              that makes reporting actually enjoyable.
            </motion.p>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnterGameFlow}
              className="group bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-heading text-lg md:text-xl px-8 py-4 rounded-lg neon-button transition-all duration-300 flex items-center space-x-3 mx-auto"
            >
              <Play className="w-6 h-6 group-hover:animate-pulse" />
              <span>Start Your Adventure</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.section>

        {/* Walkthrough Video Section */}
        <motion.section 
          className="py-20 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
          style={{ y: videoY, scale: videoScale, opacity: videoOpacity }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-heading text-white mb-6 glow-text-subtle">
                See It In Action
              </h2>
              <p className="text-lg md:text-xl text-gray-300 font-pixel max-w-3xl mx-auto leading-relaxed">
                Watch how teams transform their weekly reporting from mundane status updates 
                into an engaging neighborhood experience that everyone actually enjoys.
              </p>
            </motion.div>

            {/* Video Player Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="relative max-w-4xl mx-auto"
              onMouseEnter={() => setShowVideoControls(true)}
              onMouseLeave={() => setShowVideoControls(false)}
            >
              {/* Video Frame with Game-like Border */}
              <div className="relative bg-gray-800 rounded-2xl overflow-hidden border-4 border-primary-600 shadow-2xl glow-border">
                {/* Simulated Video Content - Game Screenshot/Demo */}
                <div className="aspect-video bg-gradient-to-br from-green-800 via-green-600 to-green-700 relative overflow-hidden">
                  {/* Simulated Game Environment */}
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-green-500/30">
                    {/* Simulated Houses */}
                    <div className="absolute top-1/4 left-1/4 w-16 h-12 bg-amber-600 border-2 border-amber-800 rounded transform rotate-3"></div>
                    <div className="absolute top-1/3 right-1/4 w-16 h-12 bg-red-600 border-2 border-red-800 rounded transform -rotate-2"></div>
                    <div className="absolute bottom-1/3 left-1/3 w-16 h-12 bg-blue-600 border-2 border-blue-800 rounded transform rotate-1"></div>
                    
                    {/* Simulated Character */}
                    <motion.div
                      animate={{ 
                        x: [100, 200, 300, 200, 100],
                        y: [150, 120, 180, 200, 150]
                      }}
                      transition={{ 
                        duration: 8, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="absolute w-8 h-8 bg-primary-400 rounded-full border-2 border-white"
                    />
                    
                    {/* Simulated UI Elements */}
                    <div className="absolute top-4 left-4 bg-gray-900/80 rounded-lg p-3 border border-primary-500">
                      <div className="text-white text-xs font-pixel">Week 3 - Friday</div>
                      <div className="text-primary-400 text-xs font-pixel">Alex's Activities: 5</div>
                    </div>
                    
                    {/* Simulated Activity Board */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2, duration: 1 }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/90 rounded-lg p-4 border-2 border-warning-500 min-w-64"
                    >
                      <div className="text-warning-400 text-sm font-pixel mb-2">📋 Weekly Activities</div>
                      <div className="space-y-1">
                        <div className="text-white text-xs font-pixel">✅ Completed user research</div>
                        <div className="text-white text-xs font-pixel">✅ Fixed critical bug</div>
                        <div className="text-white text-xs font-pixel">✅ Team standup meetings</div>
                      </div>
                      <div className="mt-2 flex space-x-1">
                        <span className="text-xs">👏</span>
                        <span className="text-xs">🔥</span>
                        <span className="text-xs">💡</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Play Button Overlay */}
                  {!isVideoPlaying && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    >
                      <motion.button
                        onClick={handleVideoPlay}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-6 shadow-2xl transition-all duration-300 glow-border"
                      >
                        <PlayCircle className="w-16 h-16" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Video Controls */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: showVideoControls || !isVideoPlaying ? 1 : 0,
                      y: showVideoControls || !isVideoPlaying ? 0 : 20
                    }}
                    className="absolute bottom-4 left-4 right-4 bg-gray-900/80 rounded-lg p-3 flex items-center justify-between backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={isVideoPlaying ? handleVideoPause : handleVideoPlay}
                        className="text-white hover:text-primary-400 transition-colors"
                      >
                        {isVideoPlaying ? <Pause className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                      </button>
                      
                      <div className="text-white font-pixel text-sm">
                        {isVideoPlaying ? '1:23 / 3:45' : '0:00 / 3:45'}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-primary-400 transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      
                      <div className="text-white font-pixel text-xs bg-primary-600 px-2 py-1 rounded">
                        DEMO
                      </div>
                    </div>
                  </motion.div>

                  {/* Progress Bar */}
                  {isVideoPlaying && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 225, ease: "linear" }} // 3:45 = 225 seconds
                      className="absolute bottom-0 left-0 h-1 bg-primary-500"
                    />
                  )}
                </div>

                {/* Video Frame Decorations */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-primary-400 rounded-tl-lg"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-4 border-r-4 border-primary-400 rounded-tr-lg"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-4 border-l-4 border-primary-400 rounded-bl-lg"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-primary-400 rounded-br-lg"></div>
              </div>

              {/* Video Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                viewport={{ once: true }}
                className="mt-8 text-center"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="text-primary-400 font-heading text-lg mb-2">🏠 Explore</div>
                    <p className="text-gray-300 font-pixel text-sm">
                      Walk around your team's virtual neighborhood and visit houses
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="text-secondary-400 font-heading text-lg mb-2">📋 Report</div>
                    <p className="text-gray-300 font-pixel text-sm">
                      Update your activity board with weekly accomplishments
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="text-warning-400 font-heading text-lg mb-2">🎉 Celebrate</div>
                    <p className="text-gray-300 font-pixel text-sm">
                      React and comment on teammates' achievements
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section with parallax */}
        <motion.section 
          className="py-16 px-4"
          style={{ y: featuresY, opacity: featuresOpacity }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-heading text-white text-center mb-12 glow-text-subtle"
            >
              Why Teams Love It
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="game-panel text-center p-6 hover:glow-border transition-all duration-300"
              >
                <motion.div 
                  className="bg-primary-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-heading text-primary-400 mb-3">Team Transparency</h3>
                <p className="text-gray-300 font-pixel text-sm leading-relaxed">
                  See what everyone's working on in a visual, engaging neighborhood format. 
                  No more wondering what your teammates accomplished this week.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="game-panel text-center p-6 hover:glow-border transition-all duration-300"
              >
                <motion.div 
                  className="bg-secondary-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Trophy className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-heading text-secondary-400 mb-3">Gamified Progress</h3>
                <p className="text-gray-300 font-pixel text-sm leading-relaxed">
                  Earn badges, level up your house, and celebrate achievements. 
                  Turn routine reporting into an engaging experience your team will love.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="game-panel text-center p-6 hover:glow-border transition-all duration-300"
              >
                <motion.div 
                  className="bg-warning-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <BarChart3 className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-heading text-warning-400 mb-3">Smart Analytics</h3>
                <p className="text-gray-300 font-pixel text-sm leading-relaxed">
                  Get insights into team productivity, project progress, and individual contributions 
                  through beautiful, actionable analytics.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* How It Works Section with staggered parallax */}
        <motion.section 
          className="py-16 px-4 bg-gray-800 bg-opacity-30"
          style={{ y: howItWorksY, scale: howItWorksScale }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-heading text-white text-center mb-12 glow-text-subtle"
            >
              How It Works
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="text-center"
              >
                <motion.div 
                  className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-heading text-lg mx-auto mb-4"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  1
                </motion.div>
                <h3 className="text-lg font-heading text-primary-400 mb-2">Create Neighborhood</h3>
                <p className="text-gray-300 font-pixel text-sm">
                  Set up your team's virtual neighborhood and invite members
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="text-center"
              >
                <motion.div 
                  className="bg-secondary-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-heading text-lg mx-auto mb-4"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  2
                </motion.div>
                <h3 className="text-lg font-heading text-secondary-400 mb-2">Log Activities</h3>
                <p className="text-gray-300 font-pixel text-sm">
                  Update your activity board with weekly accomplishments
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="text-center"
              >
                <motion.div 
                  className="bg-warning-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-heading text-lg mx-auto mb-4"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  3
                </motion.div>
                <h3 className="text-lg font-heading text-warning-400 mb-2">Explore & Engage</h3>
                <p className="text-gray-300 font-pixel text-sm">
                  Visit teammates' houses and celebrate their achievements
                </p>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="text-center"
              >
                <motion.div 
                  className="bg-success-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-heading text-lg mx-auto mb-4"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  4
                </motion.div>
                <h3 className="text-lg font-heading text-success-400 mb-2">Level Up</h3>
                <p className="text-gray-300 font-pixel text-sm">
                  Earn badges and upgrade your house as you contribute
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Final CTA Section with dramatic parallax */}
        <motion.section 
          className="py-16 px-4"
          style={{ y: finalCtaY, scale: finalCtaScale }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-heading text-white mb-6 glow-text-subtle">
                Ready to Transform Your Team Reporting?
              </h2>
              <p className="text-lg text-gray-300 mb-8 font-pixel">
                Join teams who've made weekly reporting something to look forward to.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={onEnterGameFlow}
                className="group bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-heading text-xl px-10 py-5 rounded-lg neon-button transition-all duration-300 flex items-center space-x-3 mx-auto"
              >
                <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                <span>Get Started Now</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-gray-700">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400 font-pixel text-sm">
              Built with ❤️ for teams who want to make reporting actually enjoyable
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;