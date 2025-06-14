import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useGameContext } from '../contexts/GameContext';
import { XCircle, Medal, Trophy, Star, Zap, Heart, MessageCircle, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BadgesDisplayProps {
  onClose: () => void;
}

const BadgesDisplay: React.FC<BadgesDisplayProps> = ({ onClose }) => {
  const { playerName } = useGameContext();
  const playerBadges = useSelector((state: RootState) => 
    state.badges.items.filter(badge => badge.earnedBy === playerName)
  );

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'first_submission':
        return <Star className="w-6 h-6" />;
      case 'early_bird':
        return <Zap className="w-6 h-6" />;
      case 'pride_champion':
        return <Trophy className="w-6 h-6" />;
      case 'consistent_reporter':
        return <Medal className="w-6 h-6" />;
      case 'team_player':
        return <Heart className="w-6 h-6" />;
      case 'helpful_commenter':
        return <MessageCircle className="w-6 h-6" />;
      case 'reaction_master':
        return <ThumbsUp className="w-6 h-6" />;
      default:
        return <Medal className="w-6 h-6" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'first_submission':
        return 'from-yellow-400 to-yellow-600';
      case 'early_bird':
        return 'from-blue-400 to-blue-600';
      case 'pride_champion':
        return 'from-purple-400 to-purple-600';
      case 'consistent_reporter':
        return 'from-green-400 to-green-600';
      case 'team_player':
        return 'from-pink-400 to-pink-600';
      case 'helpful_commenter':
        return 'from-indigo-400 to-indigo-600';
      case 'reaction_master':
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-warning-700"
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-warning-900">
          <h2 className="text-xl font-heading text-white flex items-center">
            <Trophy className="mr-2 text-warning-400" size={20} />
            {playerName}'s Badge Collection
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {playerBadges.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Medal className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-heading text-white mb-2">No Badges Yet</h3>
              <p className="text-gray-400 font-pixel">
                Complete activities and engage with your team to earn badges!
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-heading text-white mb-2">
                  {playerBadges.length} Badge{playerBadges.length !== 1 ? 's' : ''} Earned
                </h3>
                <p className="text-gray-400 font-pixel">
                  Keep up the great work to unlock more achievements!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {playerBadges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-warning-500 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`bg-gradient-to-br ${getBadgeColor(badge.type)} p-3 rounded-full text-white shadow-lg`}>
                          {getBadgeIcon(badge.type)}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-white font-pixel text-lg mb-1">
                            {badge.name}
                          </h4>
                          <p className="text-gray-300 font-pixel text-sm mb-2">
                            {badge.description}
                          </p>
                          <div className="text-xs text-gray-500 font-pixel">
                            Earned on {formatDate(badge.earnedAt)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
          
          <div className="text-center mt-8">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-warning-600 hover:bg-warning-700 text-white rounded-lg font-pixel shadow-pixel button-pixel transition-all"
            >
              Close Collection
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BadgesDisplay;