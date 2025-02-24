"use client";

import { useEffect, useState } from "react";
import { getRideHistory } from "../../utils/api";
import RideCard from "../../components/RideCard";
import { motion } from "framer-motion";

// Update the Ride interface to match RideDetails
interface Ride {
  id: string;
  date: string;
  pickup: string;
  destination: string;
  distance: number;
  fare: number;
  driver: {
    name: string;
    rating: number;
    photo: string;
  };
  isShared: boolean;
  participants?: {
    name: string;
    contribution: number;
  }[];
}

interface RideHistoryResponse {
  data: {
    rides: Ride[];
  };
}

export default function RideHistory() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response: unknown = await getRideHistory();

        // Type guard function to check if response matches expected structure
        const isValidResponse = (res: any): res is RideHistoryResponse => {
          return (
            res &&
            typeof res === "object" &&
            "data" in res &&
            res.data &&
            typeof res.data === "object" &&
            "rides" in res.data &&
            Array.isArray(res.data.rides)
          );
        };

        if (isValidResponse(response)) {
          setRides(response.data.rides);
        } else {
          setRides([]);
        }
      } catch (error) {
        console.error("Error fetching ride history", error);
        setRides([]); // Ensure a default value is set
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

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

      {loading ? (
        <motion.p
          className="text-center text-lg text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading your ride history...
        </motion.p>
      ) : rides.length > 0 ? (
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
        <motion.div
          className="flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 text-lg mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3081/3081648.png"
            alt="No rides available"
            className="w-40 h-40 opacity-75"
          />
          <p className="mt-4 text-xl font-semibold">No past rides available.</p>
          <p className="text-gray-500 text-sm">Your ride history will appear here.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
