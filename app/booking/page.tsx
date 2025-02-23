"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import FeedbackForm from "../../components/FeedbackForm";

const MapComponent = dynamic(
  () => import("../../components/MapComponent"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Loading map...</p>
      </div>
    )
  }
);

interface Location {
  lat: number;
  lng: number;
}

export default function BookingPage() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [rideType, setRideType] = useState("economy");
  const [fare, setFare] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pickupLocation, setPickupLocation] = useState<Location>({ lat: 0, lng: 0 });
  const [destinationLocation, setDestinationLocation] = useState<Location>({ lat: 0, lng: 0 });

  const calculateFare = (pickup: string, destination: string): number => {
    return Math.floor(Math.random() * 50) + 10; // Dummy fare calculation logic
  };

  const handleBooking = () => {
    const estimatedFare = calculateFare(pickup, destination);
    setFare(estimatedFare);
    alert(`Ride booked from ${pickup} to ${destination}. Estimated fare: $${estimatedFare}`);
    setShowFeedback(true);
  };

  const convertToLatLng = (location: string): Location | null => {
    if (!location) return null;
    const coords = location.split(",").map(Number);
    if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) return null;
    return { lat: coords[0], lng: coords[1] };
  };

  useEffect(() => {
    const converted = convertToLatLng(pickup);
    if (converted) setPickupLocation(converted);
  }, [pickup]);

  useEffect(() => {
    const converted = convertToLatLng(destination);
    if (converted) setDestinationLocation(converted);
  }, [destination]);

  return (
    <motion.div
      className="p-8 space-y-10 min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-4xl font-extrabold text-center text-blue-300"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        Book a Ride 🚖
      </motion.h2>

      <div className="flex flex-col md:flex-row gap-10 justify-center">
        {/* Booking Form */}
        <motion.div
          className="w-full md:w-1/3 bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <label htmlFor="pickup" className="block text-sm font-medium text-gray-300">
            Pickup Location
          </label>
          <input
            id="pickup"
            type="text"
            placeholder="Enter pickup location (lat,lng)"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full p-3 mt-1 rounded-lg shadow-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400 transition"
          />

          <label htmlFor="destination" className="block text-sm font-medium text-gray-300 mt-4">
            Destination
          </label>
          <input
            id="destination"
            type="text"
            placeholder="Enter destination (lat,lng)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-3 mt-1 rounded-lg shadow-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400 transition"
          />

          <label htmlFor="rideType" className="block text-sm font-medium text-gray-300 mt-4">
            Ride Type
          </label>
          <select
            id="rideType"
            value={rideType}
            onChange={(e) => setRideType(e.target.value)}
            className="w-full p-3 mt-1 rounded-lg shadow-md bg-gray-700 text-white cursor-pointer focus:outline-none focus:ring focus:ring-blue-400 transition"
          >
            <option value="economy">Economy</option>
            <option value="premium">Premium</option>
          </select>

          {fare > 0 && (
            <motion.p
              className="mt-4 text-lg font-semibold text-blue-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Estimated Fare: ${fare}
            </motion.p>
          )}

          <motion.button
            onClick={handleBooking}
            className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 focus:outline-none"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Book Now
          </motion.button>
        </motion.div>

        {/* Map Section */}
        <motion.div
          className="w-full md:w-2/3 bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-center text-blue-300">Ride Route</h3>
          {pickupLocation && destinationLocation && (
            <MapComponent 
              pickup={pickupLocation} 
              destination={destinationLocation} 
            />
          )}
        </motion.div>
      </div>

      {/* Feedback Form */}
      {showFeedback && (
        <motion.div
          className="w-full md:w-1/2 mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 text-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold text-blue-300 text-center mb-4">We Value Your Feedback</h3>
          <FeedbackForm />
        </motion.div>
      )}
    </motion.div>
  );
}
