"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRideStore } from '@/store/rideStore';
import { toast } from 'react-toastify';

export default function RewardsPage() {
  const { loyaltyPoints, addLoyaltyPoints, tier, calculateTier } = useRideStore();
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    calculateTier();
  }, [calculateTier]);

  const spinWheel = () => {
    if (loyaltyPoints < 100) {
      toast.error("You need at least 100 points to spin!");
      return;
    }

    setIsSpinning(true);
    
    // Simulate wheel spinning
    setTimeout(() => {
      const rewards = [
        { points: 50, chance: 0.4 },
        { points: 100, chance: 0.3 },
        { points: 200, chance: 0.2 },
        { points: 500, chance: 0.1 }
      ];

      const random = Math.random();
      let cumulative = 0;
      let won = rewards[0];

      for (const reward of rewards) {
        cumulative += reward.chance;
        if (random <= cumulative) {
          won = reward;
          break;
        }
      }

      addLoyaltyPoints(won.points);
      toast.success(`Congratulations! You won ${won.points} points!`);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Your Rewards Status
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Current Tier
              </h2>
              <p className="text-3xl font-bold text-yellow-500">{tier}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Loyalty Points
              </h2>
              <p className="text-3xl font-bold text-yellow-500">{loyaltyPoints}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <motion.button
            onClick={spinWheel}
            disabled={isSpinning || loyaltyPoints < 100}
            className={`px-8 py-4 rounded-full text-xl font-bold ${
              isSpinning || loyaltyPoints < 100
                ? 'bg-gray-600'
                : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
            whileHover={{ scale: isSpinning ? 1 : 1.05 }}
          >
            {isSpinning ? 'Spinning...' : 'Spin to Win! (100 points)'}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">How to Earn Points</h2>
            <ul className="space-y-2">
              <li>• Complete rides (10% of fare as points)</li>
              <li>• Share rides (+50 bonus points)</li>
              <li>• Weekly challenges</li>
              <li>• Refer friends</li>
            </ul>
          </div>

          <div className="bg-gray-700 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Rewards Available</h2>
            <ul className="space-y-2">
              <li>• 500 points: Free ride</li>
              <li>• 300 points: 50% discount</li>
              <li>• 200 points: 25% discount</li>
              <li>• 100 points: Spin the wheel</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}