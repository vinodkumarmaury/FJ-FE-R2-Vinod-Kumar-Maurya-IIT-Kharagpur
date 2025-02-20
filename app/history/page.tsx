"use client";

import { useEffect, useState } from "react";
import { getRideHistory } from "../../utils/api";
import RideCard from "../../components/RideCard";
import { motion } from "framer-motion";

export default function RideHistory() {
  const [rides, setRides] = useState<any[]>([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await getRideHistory();
        setRides(response.data.rides || []);
      } catch (error) {
        console.error("Error fetching ride history", error);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
      <h2 className="text-3xl font-bold text-center text-blue-700 dark:text-white mb-6">
        Ride History
      </h2>
      
      {rides.length > 0 ? (
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {rides.map((ride, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <RideCard ride={ride} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg">
          No past rides available.
        </p>
      )}
    </div>
  );
}
