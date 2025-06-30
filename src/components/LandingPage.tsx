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

  // MUCH GENTLER parallax effects - barely noticeable but still smooth
  const { scrollYProgress } = useScroll();
  
  // Create spring-based transforms with VERY subtle movement
  const springConfig = ANIMATION_CONFIG.SPRING_CONFIG;
  
  // Background particles - MINIMAL movement
  const particlesY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -50]), springConfig);
  const particlesOpacity = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.4, 0.2]), springConfig);
  
  // Scanlines - very subtle
  const scanlinesY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -30]), springConfig);
  
  // Hero section - MUCH more subtle movement
  const heroY = useSpring(useTransform(scrollYProgress, [0, 0.8], [0, -30]), springConfig);
  const heroOpacity = useSpring(useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.9, 0.7]), springConfig);
  
  // Character - minimal movement
  const characterY = useSpring(useTransform(scrollYProgress, [0, 0.6], [0, -40]), springConfig);
  
  // Demo section - very gentle
  const demoY = useSpring(useTransform(scrollYProgress, [0.1, 0.7], [20, -20]), springConfig);
  
  // Features section - subtle
  const featuresY = useSpring(useTransform(scrollYProgress, [0.3, 0.9], [30, -20]), springConfig);
  
  // How it works - gentle
  const howItWorksY = useSpring(useTransform(scrollYProgress, [0.5, 1], [40, -30]), springConfig);
  
  // Final CTA - minimal
  const finalCtaY = useSpring(useTransform(scrollYProgress, [0.7, 1], [50, -20]), springConfig);

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-x-hidden smooth-scroll-container">
      {/* Global Bolt Logo for landing page - with spinning animation and responsive sizing */}
      <img
        src="/white_circle_360x360.png"
        alt="Built with Bolt"
        className="fixed bottom-2 left-2 z-50 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 opacity-100 bolt-logo-spin"
        style={{ imageRendering: 'auto' }}
      />

      {/* Animated background particles with MINIMAL parallax */}
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
              ease: [0.4, 0, 0.6, 1],
            }}
          />
        ))}
      </motion.div>

      {/* Scanlines effect with minimal parallax */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-10 scanlines-effect scroll-optimized" 
        style={{ y: scanlinesY }}
        aria-hidden="true" 
      />

      {/* Main Content - Scrollable with scroll snap */}
      <div className="relative z-20 flex flex-col scroll-snap-container">
        {/* COMPACT Hero Section */}
        <motion.section 
          className="flex-1 flex items-center justify-center px-4 py-8 parallax-section scroll-snap-section"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* SMALLER Logo/Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{ y: characterY }}
              className="mb-4"
            >
              <div className="flex justify-center mb-3">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: [0.4, 0, 0.6, 1]
                  }}
                  className="p-3 rounded-2xl"
                  style={{ backgroundColor: 'transparent' }}
                >
                  {/* SMALLER Character */}
                  <WalkingCharacterAnimation
                    spritePath="/lv1_male_civilian.png"
                    frameWidth={64}
                    frameHeight={64}
                    frameCount={6}
                    directionRowIndex={2}
                    rowCount={4}
                    scale={1.0} // Reduced from 1.5x
                    className=""
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* SMALLER Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.3, 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="text-3xl md:text-4xl lg:text-5xl font-heading text-primary-400 mb-3 glow-text title-glow"
            >
              Knock-Knock, Shippers!
            </motion.h1>

            {/* SMALLER Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.5, 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="text-lg md:text-xl lg:text-2xl font-pixel text-white mb-3 glow-text-subtle"
            >
              Transform Team Reporting Into an Adventure
            </motion.p>

            {/* SHORTER Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.7, 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto font-pixel leading-relaxed"
            >
              Say goodbye to boring weekly status updates. Build your virtual neighborhood and 
              make reporting actually enjoyable.
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
              className="group bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-heading text-base md:text-lg px-6 py-3 rounded-lg neon-button section-transition flex items-center space-x-3 mx-auto"
            >
              <Play className="w-5 h-5 group-hover:animate-pulse" />
              <span>Start Your Adventure</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
            </motion.button>
          </div>
        </motion.section>

        {/* COMPACT LIVE PLAYABLE GAME DEMO SECTION */}
        <motion.section 
          className="py-12 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 parallax-section scroll-snap-section"
          style={{ y: demoY }}
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading text-white mb-4 glow-text-subtle">
                🎮 Try It Right Now!
              </h2>
              <p className="text-base md:text-lg text-gray-300 font-pixel max-w-2xl mx-auto leading-relaxed">
                This isn't a video - it's the <span className="text-primary-400 font-bold">actual game running live!</span> 
                Use <span className="text-secondary-400 font-bold">WASD to move</span>, <span className="text-warning-400 font-bold">arrows to pan</span>, and <span className="text-success-400 font-bold">E to interact</span>!
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
                scale={1.0}
                autoPlay={false}
                demoMode={true}
              />
            </motion.div>

            {/* COMPACT Game Features Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.5, 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="mt-6 text-center"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <motion.div 
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 section-transition"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  <div className="text-primary-400 font-heading text-sm mb-1">🚶 Move</div>
                  <p className="text-gray-300 font-pixel text-xs">
                    WASD keys to walk around
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 section-transition"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  <div className="text-secondary-400 font-heading text-sm mb-1">📹 Pan</div>
                  <p className="text-gray-300 font-pixel text-xs">
                    Arrow keys to pan camera
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 section-transition"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  <div className="text-warning-400 font-heading text-sm mb-1">🏠 Interact</div>
                  <p className="text-gray-300 font-pixel text-xs">
                    Press E near houses
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 section-transition"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  <div className="text-success-400 font-heading text-sm mb-1">📋 Report</div>
                  <p className="text-gray-300 font-pixel text-xs">
                    Add your activities
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* COMPACT Features Section */}
        <motion.section 
          className="py-12 px-4 parallax-section scroll-snap-section"
          style={{ y: featuresY }}
        >
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-2xl md:text-3xl font-heading text-white text-center mb-8 glow-text-subtle"
            >
              Why Teams Love It
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="game-panel text-center p-4 hover:glow-border section-transition"
              >
                <motion.div 
                  className="bg-primary-600 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center"
                  whileHover={{ 
                    rotate: 360,
                    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  <Users className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-heading text-primary-400 mb-2">Team Transparency</h3>
                <p className="text-gray-300 font-pixel text-sm leading-relaxed">
                  See what everyone's working on in a visual, engaging neighborhood format.
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
                className="game-panel text-center p-4 hover:glow-border section-transition"
              >
                <motion.div 
                  className="bg-secondary-600 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center"
                  whileHover={{ 
                    rotate: 360,
                    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  <Trophy className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-heading text-secondary-400 mb-2">Gamified Progress</h3>
                <p className="text-gray-300 font-pixel text-sm leading-relaxed">
                  Earn badges, level up your house, and celebrate achievements.
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
                className="game-panel text-center p-4 hover:glow-border section-transition"
              >
                <motion.div 
                  className="bg-warning-600 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center"
                  whileHover={{ 
                    rotate: 360,
                    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  <BarChart3 className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-heading text-warning-400 mb-2">Smart Analytics</h3>
                <p className="text-gray-300 font-pixel text-sm leading-relaxed">
                  Get insights into team productivity and individual contributions.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* COMPACT How It Works Section */}
        <motion.section 
          className="py-12 px-4 bg-gray-800 bg-opacity-30 parallax-section scroll-snap-section"
          style={{ y: howItWorksY }}
        >
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-2xl md:text-3xl font-heading text-white text-center mb-8 glow-text-subtle"
            >
              How It Works
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-heading text-sm mx-auto mb-3"
                  whileHover={{ 
                    rotate: 360, 
                    scale: 1.2,
                    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  1
                </motion.div>
                <h3 className="text-base font-heading text-primary-400 mb-2">Create</h3>
                <p className="text-gray-300 font-pixel text-xs">
                  Set up your team's neighborhood
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
                  className="bg-secondary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-heading text-sm mx-auto mb-3"
                  whileHover={{ 
                    rotate: 360, 
                    scale: 1.2,
                    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  2
                </motion.div>
                <h3 className="text-base font-heading text-secondary-400 mb-2">Log</h3>
                <p className="text-gray-300 font-pixel text-xs">
                  Update your activity board
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
                  className="bg-warning-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-heading text-sm mx-auto mb-3"
                  whileHover={{ 
                    rotate: 360, 
                    scale: 1.2,
                    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  3
                </motion.div>
                <h3 className="text-base font-heading text-warning-400 mb-2">Explore</h3>
                <p className="text-gray-300 font-pixel text-xs">
                  Visit teammates' houses
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
                  className="bg-success-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-heading text-sm mx-auto mb-3"
                  whileHover={{ 
                    rotate: 360, 
                    scale: 1.2,
                    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  4
                </motion.div>
                <h3 className="text-base font-heading text-success-400 mb-2">Level Up</h3>
                <p className="text-gray-300 font-pixel text-xs">
                  Earn badges and upgrade
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* COMPACT Final CTA Section */}
        <motion.section 
          className="py-12 px-4 parallax-section scroll-snap-section"
          style={{ y: finalCtaY }}
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
              <h2 className="text-2xl md:text-3xl font-heading text-white mb-4 glow-text-subtle">
                Ready to Transform Your Team Reporting?
              </h2>
              <p className="text-base text-gray-300 mb-6 font-pixel">
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
                className="group bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-heading text-lg px-8 py-4 rounded-lg neon-button section-transition flex items-center space-x-3 mx-auto"
              >
                <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-6 px-4 border-t border-gray-700">
          <div className="max-w-5xl mx-auto text-center">
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