import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Play, Users, Trophy, Star, ArrowRight, Sparkles, Target, BarChart3, PlayCircle, Pause, Volume2, VolumeX } from 'lucide-react';
import { ANIMATION_CONFIG, EFFECTS_CONFIG } from '../config/gameConfig';
import WalkingCharacterAnimation from './WalkingCharacterAnimation';
import MiniGameDemo from './MiniGameDemo';

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

  // Enhanced parallax scroll effects with spring physics for smoother motion
  const { scrollYProgress } = useScroll();
  
  // Create spring-based transforms for ultra-smooth scrolling using centralized config
  const springConfig = ANIMATION_CONFIG.SPRING_CONFIG;
  
  // Background particles - move slower than scroll (parallax background effect)
  const particlesY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -300]), springConfig);
  const particlesOpacity = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.6, 0.4, 0.1]), springConfig);
  
  // Scanlines - subtle movement
  const scanlinesY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -150]), springConfig);
  
  // Hero section - smooth parallax movement with spring physics
  const heroY = useSpring(useTransform(scrollYProgress, [0, 0.5], [0, -120]), springConfig);
  const heroScale = useSpring(useTransform(scrollYProgress, [0, 0.3], [1, 0.95]), springConfig);
  const heroOpacity = useSpring(useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 0.8, 0.3]), springConfig);
  
  // Title effects - smooth zoom out and fade as user scrolls
  const titleScale = useSpring(useTransform(scrollYProgress, [0, 0.3], [1, 0.8]), springConfig);
  const titleY = useSpring(useTransform(scrollYProgress, [0, 0.3], [0, -60]), springConfig);
  
  // Character animation - more dramatic movement with spring
  const characterY = useSpring(useTransform(scrollYProgress, [0, 0.4], [0, -250]), springConfig);
  const characterScale = useSpring(useTransform(scrollYProgress, [0, 0.3], [1, 1.2]), springConfig);
  const characterRotate = useSpring(useTransform(scrollYProgress, [0, 0.5], [0, 8]), springConfig);
  
  // Video section parallax with enhanced smoothness
  const videoY = useSpring(useTransform(scrollYProgress, [0.1, 0.5], [80, -120]), springConfig);
  const videoScale = useSpring(useTransform(scrollYProgress, [0.1, 0.4], [0.95, 1.05]), springConfig);
  const videoOpacity = useSpring(useTransform(scrollYProgress, [0.1, 0.3, 0.6], [0, 1, 0.8]), springConfig);
  
  // Features section - smooth slide up effect
  const featuresY = useSpring(useTransform(scrollYProgress, [0.3, 0.7], [120, -60]), springConfig);
  const featuresOpacity = useSpring(useTransform(scrollYProgress, [0.3, 0.5, 0.9], [0, 1, 0.7]), springConfig);
  
  // How it works section - staggered parallax with spring
  const howItWorksY = useSpring(useTransform(scrollYProgress, [0.5, 0.9], [180, -120]), springConfig);
  const howItWorksScale = useSpring(useTransform(scrollYProgress, [0.5, 0.7], [0.9, 1]), springConfig);
  
  // Final CTA - dramatic entrance with spring physics
  const finalCtaY = useSpring(useTransform(scrollYProgress, [0.7, 1], [250, -180]), springConfig);
  const finalCtaScale = useSpring(useTransform(scrollYProgress, [0.8, 1], [0.8, 1.1]), springConfig);

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-x-hidden smooth-scroll-container">
      {/* Global Bolt Logo for landing page - with spinning animation and responsive sizing */}
      <img
        src="/white_circle_360x360.png"
        alt="Built with Bolt"
        className="fixed bottom-2 left-2 z-50 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 opacity-100 bolt-logo-spin"
        style={{ imageRendering: 'auto' }}
      />

      {/* Animated background particles with enhanced parallax */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none scroll-optimized" 
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
              ease: [0.4, 0, 0.6, 1], // Custom cubic-bezier for smoother animation
            }}
          />
        ))}
      </motion.div>

      {/* Scanlines effect with enhanced parallax */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-10 scanlines-effect scroll-optimized" 
        style={{ y: scanlinesY }}
        aria-hidden="true" 
      />

      {/* Main Content - Scrollable with scroll snap */}
      <div className="relative z-20 flex flex-col scroll-snap-container">
        {/* Hero Section with enhanced parallax */}
        <motion.section 
          className="flex-1 flex items-center justify-center px-4 py-12 parallax-section scroll-snap-section"
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        >
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo/Icon with enhanced parallax and spring physics */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.4, 0, 0.2, 1] // Custom easing for smoother entrance
              }}
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
                    ease: [0.4, 0, 0.6, 1] // Smoother easing
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
                    rowCount={4} // Added rowCount prop
                    scale={1.5} // 1.5x size instead of 3x
                    className=""
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Main Title with smooth zoom effect */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.3, 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{ scale: titleScale, y: titleY }}
              className="text-4xl md:text-6xl lg:text-7xl font-heading text-primary-400 mb-6 glow-text title-glow"
            >
              Knock-Knock, Shippers!
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.5, 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="text-xl md:text-2xl lg:text-3xl font-pixel text-white mb-4 glow-text-subtle"
            >
              Transform Team Reporting Into an Adventure
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.7, 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
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
              transition={{ 
                delay: 0.9, 
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
              onClick={onEnterGameFlow}
              className="group bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-heading text-lg md:text-xl px-8 py-4 rounded-lg neon-button section-transition flex items-center space-x-3 mx-auto"
            >
              <Play className="w-6 h-6 group-hover:animate-pulse" />
              <span>Start Your Adventure</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
            </motion.button>
          </div>
        </motion.section>

        {/* LIVE PLAYABLE GAME DEMO SECTION */}
        <motion.section 
          className="py-20 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 parallax-section scroll-snap-section"
          style={{ y: videoY, scale: videoScale, opacity: videoOpacity }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-heading text-white mb-6 glow-text-subtle">
                🎮 Try It Right Now!
              </h2>
              <p className="text-lg md:text-xl text-gray-300 font-pixel max-w-3xl mx-auto leading-relaxed">
                This isn't a video - it's the <span className="text-primary-400 font-bold">actual game running live!</span> 
                Use WASD or arrow keys to walk around and explore the neighborhood.
              </p>
            </motion.div>

            {/* LIVE GAME DEMO */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.3, 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative max-w-4xl mx-auto flex justify-center"
            >
              <MiniGameDemo 
                onFullGameRequest={onEnterGameFlow}
                scale={0.5}
                autoPlay={false}
                demoMode={true}
              />
            </motion.div>

            {/* Game Features Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.5, 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="mt-8 text-center"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 section-transition"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  <div className="text-primary-400 font-heading text-lg mb-2">🏠 Explore</div>
                  <p className="text-gray-300 font-pixel text-sm">
                    Walk around your team's virtual neighborhood and visit houses
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 section-transition"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  <div className="text-secondary-400 font-heading text-lg mb-2">📋 Report</div>
                  <p className="text-gray-300 font-pixel text-sm">
                    Update your activity board with weekly accomplishments
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 section-transition"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  <div className="text-warning-400 font-heading text-lg mb-2">🎉 Celebrate</div>
                  <p className="text-gray-300 font-pixel text-sm">
                    React and comment on teammates' achievements
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section with enhanced parallax */}
        <motion.section 
          className="py-16 px-4 parallax-section scroll-snap-section"
          style={{ y: featuresY, opacity: featuresOpacity }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-3xl md:text-4xl font-heading text-white text-center mb-12 glow-text-subtle"
            >
              Why Teams Love It
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.1, 
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                }}
                className="game-panel text-center p-6 hover:glow-border section-transition"
              >
                <motion.div 
                  className="bg-primary-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  whileHover={{ 
                    rotate: 360,
                    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                  }}
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
                transition={{ 
                  delay: 0.2, 
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                }}
                className="game-panel text-center p-6 hover:glow-border section-transition"
              >
                <motion.div 
                  className="bg-secondary-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  whileHover={{ 
                    rotate: 360,
                    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                  }}
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
                transition={{ 
                  delay: 0.3, 
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                }}
                className="game-panel text-center p-6 hover:glow-border section-transition"
              >
                <motion.div 
                  className="bg-warning-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  whileHover={{ 
                    rotate: 360,
                    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                  }}
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

        {/* How It Works Section with enhanced staggered parallax */}
        <motion.section 
          className="py-16 px-4 bg-gray-800 bg-opacity-30 parallax-section scroll-snap-section"
          style={{ y: howItWorksY, scale: howItWorksScale }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-3xl md:text-4xl font-heading text-white text-center mb-12 glow-text-subtle"
            >
              How It Works
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.1, 
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                }}
                className="text-center"
              >
                <motion.div 
                  className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-heading text-lg mx-auto mb-4"
                  whileHover={{ 
                    rotate: 360, 
                    scale: 1.2,
                    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                  }}
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
                transition={{ 
                  delay: 0.2, 
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                }}
                className="text-center"
              >
                <motion.div 
                  className="bg-secondary-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-heading text-lg mx-auto mb-4"
                  whileHover={{ 
                    rotate: 360, 
                    scale: 1.2,
                    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                  }}
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
                transition={{ 
                  delay: 0.3, 
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                }}
                className="text-center"
              >
                <motion.div 
                  className="bg-warning-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-heading text-lg mx-auto mb-4"
                  whileHover={{ 
                    rotate: 360, 
                    scale: 1.2,
                    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                  }}
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
                transition={{ 
                  delay: 0.4, 
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                }}
                className="text-center"
              >
                <motion.div 
                  className="bg-success-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-heading text-lg mx-auto mb-4"
                  whileHover={{ 
                    rotate: 360, 
                    scale: 1.2,
                    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                  }}
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

        {/* Final CTA Section with dramatic enhanced parallax */}
        <motion.section 
          className="py-16 px-4 parallax-section scroll-snap-section"
          style={{ y: finalCtaY, scale: finalCtaScale }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl md:text-4xl font-heading text-white mb-6 glow-text-subtle">
                Ready to Transform Your Team Reporting?
              </h2>
              <p className="text-lg text-gray-300 mb-8 font-pixel">
                Join teams who've made weekly reporting something to look forward to.
              </p>
              
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
                onClick={onEnterGameFlow}
                className="group bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-heading text-xl px-10 py-5 rounded-lg neon-button section-transition flex items-center space-x-3 mx-auto"
              >
                <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                <span>Get Started Now</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
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