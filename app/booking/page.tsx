"use client";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import FeedbackForm from "../../components/FeedbackForm";

// Dynamically import MapComponent (client side only)
const MapComponent = dynamic(() => import("../../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-800 rounded-lg flex items-center justify-center">
      <p className="text-gray-400">Loading map...</p>
    </div>
  )
});

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
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
  const [isSharedRide, setIsSharedRide] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location>({
    lat: 26.8467,
    lng: 80.9462,
  }); // Default to Lucknow

  // Live tracking: update currentLocation using browser geolocation
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
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Dummy fare calculation
  const calculateFare = (pickup: string, destination: string): number => {
    return Math.floor(Math.random() * 50) + 10;
  };

  const handleBooking = () => {
    if (estimatedFare === null) {
      toast.error("Please calculate the fare first");
      return;
    }
    setFare(estimatedFare);
    alert(
      `Ride booked from ${pickup} to ${destination}.\n${
        isSharedRide ? "Shared ride - " : ""
      }Total fare: $${estimatedFare.toFixed(2)}`
    );
    setBookingComplete(true);
    setShowFeedback(true);
  };

  const handleCalculateFare = () => {
    if (!pickup || !destination) {
      toast.error("Please enter both pickup and destination locations");
      return;
    }
    setIsCalculating(true);
    // Simulate API call delay
    setTimeout(() => {
      const baseFare = calculateFare(pickup, destination);
      const typeFactor = rideType === "premium" ? 1.5 : 1;
      const calculatedFare = baseFare * typeFactor;
      if (isSharedRide && participants.length > 0) {
        setEstimatedFare(calculatedFare / (participants.length + 1));
      } else {
        setEstimatedFare(calculatedFare);
      }
      setIsCalculating(false);
    }, 500);
  };

  // Geocoding function using Nominatim API
  const geocodeLocation = async (location: string): Promise<Location | null> => {
    if (!location) return null;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (error) {
      console.error("Geocoding error: ", error);
    }
    return null;
  };

  // Update pickupLocation when pickup input changes
  useEffect(() => {
    if (pickup) {
      (async () => {
        const coords = await geocodeLocation(pickup);
        if (coords) setPickupLocation(coords);
      })();
    }
  }, [pickup]);

  // Update destinationLocation when destination input changes
  useEffect(() => {
    if (destination) {
      (async () => {
        const coords = await geocodeLocation(destination);
        if (coords) setDestinationLocation(coords);
      })();
    }
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
            placeholder="Enter pickup location (e.g., Lucknow)"
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
            placeholder="Enter destination (e.g., New Delhi)"
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

          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isSharedRide}
                onChange={(e) => setIsSharedRide(e.target.checked)}
                className="form-checkbox text-blue-500"
              />
              <span>Share this ride</span>
            </label>
          </div>

          {isSharedRide && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300">
                Add Participants (comma-separated emails)
              </label>
              <input
                type="text"
                value={participants.join(", ")}
                onChange={(e) =>
                  setParticipants(
                    e.target.value.split(",").map((email) => email.trim())
                  )
                }
                className="w-full p-3 mt-1 rounded-lg bg-gray-700 text-white"
                placeholder="email1@example.com, email2@example.com"
              />
            </div>
          )}

          {/* Fare Calculation Section */}
          <div className="mt-6 space-y-4">
            <motion.button
              onClick={handleCalculateFare}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 focus:outline-none"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              disabled={isCalculating}
            >
              {isCalculating ? "Calculating..." : "Calculate Fare"}
            </motion.button>

            {estimatedFare !== null && (
              <motion.div
                className="p-4 bg-gray-700 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-lg font-semibold text-blue-300 mb-2">
                  Fare Estimate
                </h4>
                <div className="space-y-2">
                  <p className="text-white">
                    Base Fare: ${rideType === "premium" ? (estimatedFare / 1.5).toFixed(2) : estimatedFare.toFixed(2)}
                  </p>
                  {rideType === "premium" && (
                    <p className="text-yellow-400">Premium Service: +50%</p>
                  )}
                  {isSharedRide && participants.length > 0 && (
                    <p className="text-green-400">
                      Split between {participants.length + 1} people
                    </p>
                  )}
                  <div className="pt-2 border-t border-gray-600">
                    <p className="text-xl font-bold text-blue-400">
                      Your Share: ${estimatedFare.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Book Now button */}
          <motion.button
            onClick={handleBooking}
            className={`w-full mt-6 font-bold py-3 rounded-lg transition transform hover:scale-105 focus:outline-none ${
              estimatedFare === null ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
            whileHover={{ scale: estimatedFare !== null ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            disabled={estimatedFare === null}
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
          <h3 className="text-2xl font-semibold mb-4 text-center text-blue-300">
            {bookingComplete ? "Ride Route" : "Live Location"}
          </h3>
          {bookingComplete ? (
            (pickupLocation && destinationLocation) && (
              <MapComponent pickup={pickupLocation} destination={destinationLocation} />
            )
          ) : (
            <MapComponent currentLocation={currentLocation} />
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
          <h3 className="text-xl font-bold text-blue-300 text-center mb-4">
            We Value Your Feedback
          </h3>
          <FeedbackForm />
        </motion.div>
      )}
    </motion.div>
  );
}
