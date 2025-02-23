"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import("../../components/MapComponent"), { ssr: false });

export default function TrackingPage() {
  const [currentLocation, setCurrentLocation] = useState({ lat: 51.5074, lng: -0.1278 });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }

    const interval = setInterval(() => {
      setCurrentLocation((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.005,
        lng: prev.lng + (Math.random() - 0.5) * 0.005,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <motion.h2
        className="text-3xl font-bold mb-4 text-blue-400"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Real-Time Ride Tracking 🚗
      </motion.h2>
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MapComponent currentLocation={currentLocation} />
        <p className="text-center mt-4 text-gray-300">
          📍 Your current location is updating every 5 seconds.
        </p>
      </motion.div>
    </div>
  );
}
