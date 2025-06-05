import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { clearBadgeNotification } from '../store/slices/badgesSlice';
import { Medal } from 'lucide-react';

const BadgeNotification: React.FC = () => {
  const dispatch = useDispatch();
  const badge = useSelector((state: RootState) => state.badges.currentNotification);

  useEffect(() => {
    if (badge) {
      const timer = setTimeout(() => {
        dispatch(clearBadgeNotification());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [badge, dispatch]);

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gray-800 border-4 border-warning-600 rounded-lg p-4 shadow-lg flex items-center space-x-4">
            <div className="bg-warning-600 rounded-full p-2">
              <Medal className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-warning-400 font-pixel mb-1">New Badge Earned!</h3>
              <p className="text-white font-pixel text-sm">{badge.name}</p>
              <p className="text-gray-400 font-pixel text-xs mt-1">{badge.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BadgeNotification;