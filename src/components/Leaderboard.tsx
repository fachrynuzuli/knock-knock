import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { XCircle, Trophy, BarChart3, CheckSquare, ClipboardList, Medal, MessageCircle, Heart, Star, Users, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardProps {
  onClose?: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'analytics' | 'social'>('leaderboard');
  
  const teammates = useSelector((state: RootState) => state.teammates.items);
  const activities = useSelector((state: RootState) => state.activities.items);
  const badges = useSelector((state: RootState) => state.badges.items);
  const comments = useSelector((state: RootState) => state.interactions.comments);
  const reactions = useSelector((state: RootState) => state.interactions.reactions);
  const { currentWeek } = useSelector((state: RootState) => state.gameState);
  
  // Sort teammates by total activities
  const sortedTeammates = [...teammates].sort((a, b) => b.stats.totalActivities - a.stats.totalActivities);
  
  // Calculate team totals
  const teamTotals = {
    totalActivities: teammates.reduce((sum, teammate) => sum + teammate.stats.totalActivities, 0),
    totalProjects: teammates.reduce((sum, teammate) => sum + teammate.stats.projectCount, 0),
    totalAdhoc: teammates.reduce((sum, teammate) => sum + teammate.stats.adhocCount, 0),
    totalRoutine: teammates.reduce((sum, teammate) => sum + teammate.stats.routineCount, 0),
    totalBadges: badges.length,
    totalComments: comments.length,
    totalReactions: reactions.length,
  };

  // Get current week activities
  const currentWeekActivities = activities.filter(activity => activity.week === currentWeek);
  
  // Calculate social engagement stats
  const getSocialStats = (memberName: string) => {
    const memberComments = comments.filter(comment => comment.userName === memberName);
    const memberReactions = reactions.filter(reaction => reaction.userName === memberName);
    const receivedComments = comments.filter(comment => {
      const activity = activities.find(a => a.id === comment.activityId);
      return activity?.createdBy === memberName;
    });
    const receivedReactions = reactions.filter(reaction => {
      const activity = activities.find(a => a.id === reaction.activityId);
      return activity?.createdBy === memberName;
    });
    
    return {
      commentsGiven: memberComments.length,
      reactionsGiven: memberReactions.length,
      commentsReceived: receivedComments.length,
      reactionsReceived: receivedReactions.length,
    };
  };

  // Get member badges
  const getMemberBadges = (memberName: string) => {
    return badges.filter(badge => badge.earnedBy === memberName);
  };

  // Calculate fun statistics
  const getFunStats = () => {
    const categoryChampions = {
      project: sortedTeammates.reduce((prev, current) => 
        prev.stats.projectCount > current.stats.projectCount ? prev : current
      ),
      adhoc: sortedTeammates.reduce((prev, current) => 
        prev.stats.adhocCount > current.stats.adhocCount ? prev : current
      ),
      routine: sortedTeammates.reduce((prev, current) => 
        prev.stats.routineCount > current.stats.routineCount ? prev : current
      ),
    };

    const socialChampions = {
      mostHelpful: teammates.reduce((prev, current) => {
        const prevSocial = getSocialStats(prev.name);
        const currentSocial = getSocialStats(current.name);
        return prevSocial.commentsGiven > currentSocial.commentsGiven ? prev : current;
      }),
      mostReactive: teammates.reduce((prev, current) => {
        const prevSocial = getSocialStats(prev.name);
        const currentSocial = getSocialStats(current.name);
        return prevSocial.reactionsGiven > currentSocial.reactionsGiven ? prev : current;
      }),
      mostPopular: teammates.reduce((prev, current) => {
        const prevSocial = getSocialStats(prev.name);
        const currentSocial = getSocialStats(current.name);
        const prevTotal = prevSocial.commentsReceived + prevSocial.reactionsReceived;
        const currentTotal = currentSocial.commentsReceived + currentSocial.reactionsReceived;
        return prevTotal > currentTotal ? prev : current;
      }),
    };

    return { categoryChampions, socialChampions };
  };

  const funStats = getFunStats();

  const renderLeaderboard = () => (
    <div className="space-y-4">
      {sortedTeammates.map((teammate, index) => {
        const memberBadges = getMemberBadges(teammate.name);
        const socialStats = getSocialStats(teammate.name);
        
        return (
          <motion.div 
            key={teammate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gray-700 p-4 rounded-lg border-l-4 ${
              index === 0 ? 'border-warning-500' : 
              index === 1 ? 'border-gray-400' : 
              index === 2 ? 'border-amber-800' : 'border-gray-600'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                index === 0 ? 'bg-warning-500' : 
                index === 1 ? 'bg-gray-400' : 
                index === 2 ? 'bg-amber-800' : 'bg-gray-600'
              }`}>
                {index + 1}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-pixel text-lg">{teammate.name}</span>
                    {teammate.isPlayer && <span className="text-blue-400">👑</span>}
                    {memberBadges.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Medal className="text-warning-400 w-4 h-4" />
                        <span className="text-warning-400 text-sm font-pixel">{memberBadges.length}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-white font-pixel flex items-center">
                    <ClipboardList className="text-warning-400 mr-1" size={16} />
                    {teammate.stats.totalActivities} activities
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  <div className="flex items-center justify-between bg-success-900 bg-opacity-30 p-2 rounded">
                    <span className="text-success-400 text-xs font-pixel">Projects</span>
                    <span className="text-white font-bold">{teammate.stats.projectCount}</span>
                  </div>
                  <div className="flex items-center justify-between bg-warning-900 bg-opacity-30 p-2 rounded">
                    <span className="text-warning-400 text-xs font-pixel">Ad Hoc</span>
                    <span className="text-white font-bold">{teammate.stats.adhocCount}</span>
                  </div>
                  <div className="flex items-center justify-between bg-primary-900 bg-opacity-30 p-2 rounded">
                    <span className="text-primary-400 text-xs font-pixel">Routine</span>
                    <span className="text-white font-bold">{teammate.stats.routineCount}</span>
                  </div>
                  <div className="flex items-center justify-between bg-secondary-900 bg-opacity-30 p-2 rounded">
                    <span className="text-secondary-400 text-xs font-pixel">Social</span>
                    <span className="text-white font-bold">{socialStats.commentsGiven + socialStats.reactionsGiven}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-600 rounded-full h-2.5 mb-1">
                    <div className="bg-gradient-to-r from-success-600 to-warning-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min((teammate.stats.totalActivities / 30) * 100, 100)}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 font-pixel">
                    <span>House Level {teammate.houseLevel}/3</span>
                    <span>{teammate.stats.totalActivities}/30 for upgrade</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h3 className="text-white font-heading mb-4 flex items-center">
          <Users className="text-primary-400 mr-2" size={18} />
          Team Overview
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{teamTotals.totalActivities}</div>
            <div className="text-sm text-gray-400 font-pixel">Total Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-400">{teamTotals.totalBadges}</div>
            <div className="text-sm text-gray-400 font-pixel">Badges Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-400">{teamTotals.totalComments}</div>
            <div className="text-sm text-gray-400 font-pixel">Comments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">{teamTotals.totalReactions}</div>
            <div className="text-sm text-gray-400 font-pixel">Reactions</div>
          </div>
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h3 className="text-white font-heading mb-4 flex items-center">
          <BarChart3 className="text-warning-400 mr-2" size={18} />
          Activity Type Breakdown
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-success-400 font-pixel">Projects</span>
              <span className="text-white font-bold">{teamTotals.totalProjects}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-success-600 h-2 rounded-full" 
                style={{ width: `${(teamTotals.totalProjects / teamTotals.totalActivities) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-300 font-pixel mt-1">
              {Math.round((teamTotals.totalProjects / teamTotals.totalActivities) * 100)}% of total
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-warning-400 font-pixel">Ad Hoc</span>
              <span className="text-white font-bold">{teamTotals.totalAdhoc}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-warning-600 h-2 rounded-full" 
                style={{ width: `${(teamTotals.totalAdhoc / teamTotals.totalActivities) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-300 font-pixel mt-1">
              {Math.round((teamTotals.totalAdhoc / teamTotals.totalActivities) * 100)}% of total
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-primary-400 font-pixel">Routine</span>
              <span className="text-white font-bold">{teamTotals.totalRoutine}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full" 
                style={{ width: `${(teamTotals.totalRoutine / teamTotals.totalActivities) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-300 font-pixel mt-1">
              {Math.round((teamTotals.totalRoutine / teamTotals.totalActivities) * 100)}% of total
            </div>
          </div>
        </div>
      </div>

      {/* Fun Statistics */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h3 className="text-white font-heading mb-4 flex items-center">
          <Star className="text-warning-400 mr-2" size={18} />
          Team Champions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-secondary-400 font-pixel">Category Champions</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                <span className="text-success-400 font-pixel text-sm">Project Master</span>
                <span className="text-white font-pixel text-sm">{funStats.categoryChampions.project.name}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                <span className="text-warning-400 font-pixel text-sm">Ad Hoc Hero</span>
                <span className="text-white font-pixel text-sm">{funStats.categoryChampions.adhoc.name}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                <span className="text-primary-400 font-pixel text-sm">Routine Rockstar</span>
                <span className="text-white font-pixel text-sm">{funStats.categoryChampions.routine.name}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-secondary-400 font-pixel">Social Champions</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                <span className="text-secondary-400 font-pixel text-sm">Most Helpful</span>
                <span className="text-white font-pixel text-sm">{funStats.socialChampions.mostHelpful.name}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                <span className="text-secondary-400 font-pixel text-sm">Reaction King</span>
                <span className="text-white font-pixel text-sm">{funStats.socialChampions.mostReactive.name}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                <span className="text-secondary-400 font-pixel text-sm">Most Popular</span>
                <span className="text-white font-pixel text-sm">{funStats.socialChampions.mostPopular.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocial = () => (
    <div className="space-y-6">
      {/* Social Engagement Overview */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h3 className="text-white font-heading mb-4 flex items-center">
          <Heart className="text-pink-400 mr-2" size={18} />
          Social Engagement
        </h3>
        
        <div className="space-y-4">
          {teammates.map((teammate) => {
            const socialStats = getSocialStats(teammate.name);
            const totalEngagement = socialStats.commentsGiven + socialStats.reactionsGiven;
            const totalReceived = socialStats.commentsReceived + socialStats.reactionsReceived;
            
            return (
              <div key={teammate.id} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-pixel">{teammate.name}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-secondary-400 text-sm font-pixel">Given</div>
                      <div className="text-white font-bold">{totalEngagement}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-pink-400 text-sm font-pixel">Received</div>
                      <div className="text-white font-bold">{totalReceived}</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-pixel">Comments Given</span>
                      <span className="text-white">{socialStats.commentsGiven}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-pixel">Reactions Given</span>
                      <span className="text-white">{socialStats.reactionsGiven}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-pixel">Comments Received</span>
                      <span className="text-white">{socialStats.commentsReceived}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-pixel">Reactions Received</span>
                      <span className="text-white">{socialStats.reactionsReceived}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto border-4 border-warning-700"
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-warning-900">
          <h2 className="text-xl font-heading text-white flex items-center">
            <Trophy className="mr-2 text-warning-400" size={20} />
            Town Hall Analytics
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-3 px-4 font-pixel text-sm transition-colors ${
              activeTab === 'leaderboard' 
                ? 'bg-warning-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Trophy className="inline mr-2" size={16} />
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 px-4 font-pixel text-sm transition-colors ${
              activeTab === 'analytics' 
                ? 'bg-warning-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <TrendingUp className="inline mr-2" size={16} />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-3 px-4 font-pixel text-sm transition-colors ${
              activeTab === 'social' 
                ? 'bg-warning-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Heart className="inline mr-2" size={16} />
            Social
          </button>
        </div>
        
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'leaderboard' && renderLeaderboard()}
              {activeTab === 'analytics' && renderAnalytics()}
              {activeTab === 'social' && renderSocial()}
            </motion.div>
          </AnimatePresence>
          
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-warning-600 hover:bg-warning-700 text-white rounded-lg font-pixel shadow-pixel button-pixel transition-all"
            >
              Close Town Hall
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;