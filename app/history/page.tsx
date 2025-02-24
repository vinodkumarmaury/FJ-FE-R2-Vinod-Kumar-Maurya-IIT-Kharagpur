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
      <motion.h2
        className="text-4xl font-extrabold text-center text-blue-700 dark:text-blue-300 mb-6"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        Ride History 🚖
      </motion.h2>

      {rides.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">
          No rides yet. Book your first ride!
        </div>
      ) : (
        <div className="space-y-6">
          {rides.map((ride) => (
            <motion.div
              key={ride.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {new Date(ride.date).toLocaleDateString()}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {ride.rideType} Ride
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

                {/* Map showing the route */}
                <div className="h-[200px] mb-4 rounded-lg overflow-hidden">
                  <MapComponent
                    pickup={ride.pickupCoords}
                    destination={ride.destinationCoords}
                  />
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={ride.driver.photo}
                    alt={ride.driver.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium dark:text-white">
                      {ride.driver.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {ride.driver.vehicleModel} • {ride.driver.vehicleNumber}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-gray-600 dark:text-gray-400">
                      {ride.driver.rating}
                    </span>
                  </div>
                </div>

                {ride.isShared && ride.participants && (
                  <div className="border-t dark:border-gray-700 pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Shared with:
                    </h4>
                    <div className="space-y-2">
                      {ride.participants.map((participant, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600 dark:text-gray-400">
                            {participant.name}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            ₹{participant.contribution.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
