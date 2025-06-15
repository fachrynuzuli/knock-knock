import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useGameContext } from '../contexts/GameContext';
import { addComment, addReaction, ReactionType } from '../store/slices/interactionsSlice';
import { XCircle, ClipboardList, CheckCircle2, MessageCircle, Send, Heart } from 'lucide-react';
import { ActivityCategory, ProjectMilestone } from '../store/slices/activitiesSlice';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityBoardProps {
  teammate: string;
  onClose: () => void;
}

const ActivityBoard: React.FC<ActivityBoardProps> = ({ teammate, onClose }) => {
  const dispatch = useDispatch();
  const { playerName } = useGameContext();
  const [newComment, setNewComment] = useState('');
  const [activeCommentActivity, setActiveCommentActivity] = useState<string | null>(null);
  
  const activities = useSelector((state: RootState) => 
    state.activities.items.filter(activity => 
      activity.createdBy === teammate
    ).sort((a, b) => a.priority - b.priority)
  );
  
  const comments = useSelector((state: RootState) => state.interactions.comments);
  const reactions = useSelector((state: RootState) => state.interactions.reactions);
  const { currentWeek } = useSelector((state: RootState) => state.gameState);
  
  const reactionTypes: ReactionType[] = ['👏', '🔥', '💡', '❤️', '🎯', '⭐'];
  
  const getCategoryLabel = (category: ActivityCategory) => {
    switch (category) {
      case 'project': return { label: 'Project', className: 'bg-success-600 border-success-800' };
      case 'adhoc': return { label: 'Ad Hoc', className: 'bg-warning-600 border-warning-800' };
      case 'routine': return { label: 'Routine', className: 'bg-primary-600 border-primary-800' };
      default: return { label: 'Unknown', className: 'bg-gray-600 border-gray-800' };
    }
  };
  
  const getMilestoneLabel = (milestone: ProjectMilestone) => {
    switch (milestone) {
      case 'pre-project': return 'Pre-Project';
      case 'preparation': return 'Preparation';
      case 'initiation': return 'Initiation';
      case 'realization': return 'Realization';
      case 'finished': return 'Finished';
      case 'go-live': return 'Go-Live';
      default: return 'Unknown';
    }
  };

  const getActivityComments = (activityId: string) => {
    return comments.filter(comment => comment.activityId === activityId);
  };

  const getActivityReactions = (activityId: string) => {
    return reactions.filter(reaction => reaction.activityId === activityId);
  };

  const getReactionCount = (activityId: string, reactionType: ReactionType) => {
    return reactions.filter(reaction => 
      reaction.activityId === activityId && reaction.type === reactionType
    ).length;
  };

  const hasUserReacted = (activityId: string, reactionType: ReactionType) => {
    return reactions.some(reaction => 
      reaction.activityId === activityId && 
      reaction.type === reactionType && 
      reaction.userName === playerName
    );
  };

  const handleReaction = (activityId: string, reactionType: ReactionType) => {
    dispatch(addReaction({
      activityId,
      userId: 'current-user',
      userName: playerName,
      type: reactionType,
    }));
  };

  const handleComment = (activityId: string) => {
    if (newComment.trim()) {
      dispatch(addComment({
        activityId,
        userId: 'current-user',
        userName: playerName,
        text: newComment.trim(),
      }));
      setNewComment('');
      setActiveCommentActivity(null);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-primary-700">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-primary-900">
          <h2 className="text-xl font-heading text-white flex items-center">
            <ClipboardList className="mr-2 text-primary-400" size={20} />
            {teammate}'s Activity Board
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="bg-gray-900 p-6 rounded-lg border-2 border-gray-700 shadow-inner text-center mb-6">
              <h3 className="text-2xl font-heading text-white mb-2">What did I get done this week?</h3>
              <p className="text-gray-300 font-pixel">{currentWeek}</p>
            </div>
            
            {activities.length === 0 ? (
              <div className="text-center p-8 bg-gray-700 rounded-lg">
                <p className="text-gray-300 font-pixel">No activities logged for this week yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activities.map((activity, index) => {
                  const category = getCategoryLabel(activity.category);
                  const activityComments = getActivityComments(activity.id);
                  const activityReactions = getActivityReactions(activity.id);
                  
                  return (
                    <motion.div 
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gray-700 p-6 rounded-lg border-l-4 ${category.className} shadow-lg`}
                    >
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold mr-4">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <div className="text-white font-pixel mb-3 text-lg">{activity.text}</div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-md text-white text-sm font-pixel ${category.className}`}>
                              {category.label}
                            </span>
                            
                            {activity.projectMilestone && (
                              <span className="px-3 py-1 bg-gray-600 rounded-md text-white text-sm font-pixel">
                                {getMilestoneLabel(activity.projectMilestone)}
                              </span>
                            )}
                            
                            <span className="px-3 py-1 bg-gray-600 rounded-md text-white text-sm font-pixel flex items-center">
                              <CheckCircle2 size={14} className="mr-1" />
                              Priority {activity.priority}
                            </span>
                          </div>

                          {/* Reactions Section */}
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {reactionTypes.map((reactionType) => {
                                const count = getReactionCount(activity.id, reactionType);
                                const hasReacted = hasUserReacted(activity.id, reactionType);
                                
                                return (
                                  <motion.button
                                    key={reactionType}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleReaction(activity.id, reactionType)}
                                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-all ${
                                      hasReacted 
                                        ? 'bg-primary-600 text-white border-2 border-primary-400' 
                                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                    }`}
                                  >
                                    <span>{reactionType}</span>
                                    {count > 0 && <span className="font-bold">{count}</span>}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Comments Section */}
                          <div className="border-t border-gray-600 pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-white font-pixel flex items-center">
                                <MessageCircle size={16} className="mr-2" />
                                Comments ({activityComments.length})
                              </h4>
                              <button
                                onClick={() => setActiveCommentActivity(
                                  activeCommentActivity === activity.id ? null : activity.id
                                )}
                                className="text-primary-400 hover:text-primary-300 font-pixel text-sm transition-colors"
                              >
                                {activeCommentActivity === activity.id ? 'Cancel' : 'Add Comment'}
                              </button>
                            </div>

                            {/* Comment Input */}
                            <AnimatePresence>
                              {activeCommentActivity === activity.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mb-4"
                                >
                                  <div className="flex space-x-2">
                                    <input
                                      type="text"
                                      value={newComment}
                                      onChange={(e) => setNewComment(e.target.value)}
                                      placeholder="Add a comment..."
                                      className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white font-pixel focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleComment(activity.id);
                                        }
                                      }}
                                    />
                                    <button
                                      onClick={() => handleComment(activity.id)}
                                      disabled={!newComment.trim()}
                                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-pixel transition-all flex items-center"
                                    >
                                      <Send size={16} />
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Comments List */}
                            <div className="space-y-3">
                              <AnimatePresence>
                                {activityComments.map((comment) => (
                                  <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-gray-600 p-3 rounded-lg"
                                  >
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="text-primary-400 font-pixel text-sm font-bold">
                                        {comment.userName}
                                      </span>
                                      <span className="text-gray-400 font-pixel text-xs">
                                        {formatTimestamp(comment.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-white font-pixel text-sm">{comment.text}</p>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-pixel shadow-pixel button-pixel transition-all"
            >
              Close Board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityBoard;