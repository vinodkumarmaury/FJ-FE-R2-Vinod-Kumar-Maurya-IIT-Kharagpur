"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLoyaltyStore } from '@/store/loyaltyStore';

const tierBenefits = {
  Bronze: [
    '5% discount on rides',
    'Basic customer support',
    'Standard ride matching'
  ],
  Silver: [
    '10% discount on rides',
    'Priority customer support',
    'Faster ride matching',
    'Free cancellation once per day'
  ],
  Gold: [
    '15% discount on rides',
    'Premium customer support',
    'Premium ride matching',
    'Free cancellation twice per day',
    'Priority driver allocation'
  ],
  Platinum: [
    '20% discount on rides',
    'Dedicated customer support',
    'Instant ride matching',
    'Unlimited free cancellations',
    'VIP driver allocation',
    'Airport lounge access'
  ]
};

export default function LoyaltyPage() {
  const { points, tier, ridesCount, calculateTier } = useLoyaltyStore();

  useEffect(() => {
    calculateTier();
  }, [calculateTier]);

  const getNextTierRequirements = () => {
    switch(tier) {
      case 'Bronze':
        return {
          points: 1000 - points,
          rides: 10 - ridesCount
        };
      case 'Silver':
        return {
          points: 2500 - points,
          rides: 25 - ridesCount
        };
      case 'Gold':
        return {
          points: 5000 - points,
          rides: 50 - ridesCount
        };
      default:
        return null;
    }
  };

  const nextTier = getNextTierRequirements();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Loyalty Status
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Enjoy exclusive benefits as you ride more with us
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                Current Tier
              </h3>
              <p className="text-3xl font-bold text-yellow-500 mt-2">{tier}</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                Total Points
              </h3>
              <p className="text-3xl font-bold text-yellow-500 mt-2">{points}</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                Total Rides
              </h3>
              <p className="text-3xl font-bold text-yellow-500 mt-2">{ridesCount}</p>
            </div>
          </div>

          {nextTier && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Next Tier Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-300">Points needed</p>
                  <p className="text-2xl font-bold text-yellow-500">{nextTier.points}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-300">Rides needed</p>
                  <p className="text-2xl font-bold text-yellow-500">{nextTier.rides}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Your Current Benefits
          </h2>
          <ul className="space-y-4">
            {tierBenefits[tier].map((benefit, index) => (
              <li
                key={index}
                className="flex items-center text-gray-700 dark:text-gray-300"
              >
                <span className="text-yellow-500 mr-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
