"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-center p-6">
      <motion.h2
        className="text-4xl font-bold text-yellow-400"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🚗 Welcome to Ride Sharing App
      </motion.h2>

      <motion.p
        className="text-gray-300 mt-4 text-lg max-w-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Book a ride, track your journey, and manage your profile—all in one place!
      </motion.p>

      <motion.button
        className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg shadow-md transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Book a Ride
      </motion.button>
    </div>
  );
}
