"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MapComponent from "../../components/MapComponent";
import FeedbackForm from "../../components/FeedbackForm";

export default function BookingPage() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [rideType, setRideType] = useState("economy");
  const [fare, setFare] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const calculateFare = (pickup: string, destination: string) => {
    return Math.floor(Math.random() * 50) + 10; // Dummy fare calculation logic
  };

  const handleBooking = () => {
    const estimatedFare = calculateFare(pickup, destination);
    setFare(estimatedFare);
    alert(`Ride booked from ${pickup} to ${destination}. Estimated fare: $${estimatedFare}`);
    setShowFeedback(true);
  };

  return (
    <motion.div
      className="p-8 space-y-10 min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <motion.h2
        className="text-4xl font-extrabold text-center text-blue-300"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        Book a Ride 🚖
      </motion.h2>

      {/* Booking Form */}
      <motion.div
        className="max-w-md mx-auto bg-gray-800 p-8 rounded-2xl shadow-lg text-white border border-gray-700"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <label htmlFor="pickup" className="block text-sm font-medium text-gray-400">Pickup Location</label>
        <input
          id="pickup"
          type="text"
          placeholder="Enter pickup location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="w-full border-none p-3 rounded-lg shadow-md focus:ring focus:ring-blue-400 bg-gray-700 text-white placeholder-gray-400 transition"
        />

        <label htmlFor="destination" className="block text-sm font-medium text-gray-400 mt-4">Destination</label>
        <input
          id="destination"
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border-none p-3 rounded-lg shadow-md focus:ring focus:ring-blue-400 bg-gray-700 text-white placeholder-gray-400 transition"
        />

        <label htmlFor="rideType" className="block text-sm font-medium text-gray-400 mt-4">Ride Type</label>
        <select
          id="rideType"
          value={rideType}
          onChange={(e) => setRideType(e.target.value)}
          className="w-full border-none p-3 rounded-lg shadow-md bg-gray-700 text-white cursor-pointer focus:ring focus:ring-blue-400 transition"
        >
          <option value="economy" className="text-black">Economy</option>
          <option value="premium" className="text-black">Premium</option>
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
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          Book Now
        </motion.button>
      </motion.div>

      {/* Map Section */}
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-center text-blue-300">Ride Route</h3>
        <MapComponent pickup={pickup} destination={destination} />
      </motion.div>

      {/* Feedback Form */}
      {showFeedback && <FeedbackForm />}
    </motion.div>
  );
}
