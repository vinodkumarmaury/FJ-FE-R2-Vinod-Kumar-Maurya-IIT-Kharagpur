"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRideStore } from '@/store/rideStore';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import("../../components/MapComponent"), { 
  ssr: false 
});

export default function RideHistoryPage() {
  const { rides } = useRideStore();

  return (
    <motion.div
      className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
        Ride History
      </h2>

      <div className="max-w-4xl mx-auto space-y-6">
        {rides.map((ride) => (
          <motion.div
            key={ride.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(ride.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  From: {ride.pickup}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  To: {ride.destination}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{ride.fare.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {ride.distance} km • {ride.duration}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <img
                src={ride.driver.photo}
                alt={ride.driver.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium dark:text-white">
                  {ride.driver.name}
                </p>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                    {ride.driver.rating}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
