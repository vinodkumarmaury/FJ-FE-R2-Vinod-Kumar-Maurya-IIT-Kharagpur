"use client";

import { useState } from "react";
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
    <div className="p-8 space-y-8 bg-gray-900 min-h-screen text-white animate-fadeIn">
      <h2 className="text-3xl font-bold text-center">Book a Ride</h2>
      
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg text-gray-900">
        <label htmlFor="pickup" className="block text-sm font-medium text-gray-700">Pickup Location</label>
        <input
          id="pickup"
          type="text"
          placeholder="Enter pickup location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="w-full border p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-400 transition"
        />

        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mt-4">Destination</label>
        <input
          id="destination"
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-400 transition"
        />

        <label htmlFor="rideType" className="block text-sm font-medium text-gray-700 mt-4">Ride Type</label>
        <select
          id="rideType"
          value={rideType}
          onChange={(e) => setRideType(e.target.value)}
          className="w-full border p-3 rounded-lg shadow-sm bg-white text-gray-800 cursor-pointer focus:ring focus:ring-blue-300 transition"
        >
          <option value="economy" className="text-black">Economy</option>
          <option value="premium" className="text-black">Premium</option>
        </select>

        {fare > 0 && <p className="mt-4 text-lg font-semibold">Estimated Fare: ${fare}</p>}

        <button
          onClick={handleBooking}
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105"
        >
          Book Now
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-center">Ride Route</h3>
        <MapComponent pickup={pickup} destination={destination} />
      </div>

      {showFeedback && <FeedbackForm />}
    </div>
  );
}
