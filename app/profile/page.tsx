"use client";

import { useEffect, useState } from "react";
import { fetchProfile } from "@/utils/api";
import { motion } from "framer-motion";

interface Profile {
  name: string;
  email: string;
  totalRides: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function getProfile() {
      try {
        // fetchProfile returns the JSON response directly
        const data = await fetchProfile();
        // Map dummyJSON data to your Profile interface:
        const formattedProfile: Profile = {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          totalRides: 0, // Default value since dummyJSON doesn't provide ride count
        };
        setProfile(formattedProfile);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    }
    getProfile();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <motion.div
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">
          User Profile
        </h2>
        {profile ? (
          <motion.div
            className="bg-gray-700 p-6 rounded-lg shadow-md space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-lg">
              <span className="font-semibold text-blue-400">Name:</span> {profile.name}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-blue-400">Email:</span> {profile.email}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-blue-400">Total Rides:</span> {profile.totalRides}
            </p>
          </motion.div>
        ) : (
          <p className="text-center text-gray-400">Loading profile...</p>
        )}
      </motion.div>
    </div>
  );
}
