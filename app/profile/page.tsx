"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Profile {
  name: string;
  email: string;
  username: string;
  totalRides: number;
  phoneNumber: string;
  address: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    username: "",
    totalRides: 0,
    phoneNumber: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile>(profile);

  useEffect(() => {
    // TODO: Fetch profile data from your API
    // For now using mock data
    setProfile({
      name: "John Doe",
      email: "john@example.com",
      username: "johndoe",
      totalRides: 15,
      phoneNumber: "+1234567890",
      address: "123 Main St",
    });
  }, []);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // TODO: Implement API call to update profile
      // For now, just updating the local state
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Profile Management</h1>
        
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="name"
                value={editedProfile.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
              />
              <input
                type="text"
                name="username"
                value={editedProfile.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
              />
              <input
                type="email"
                name="email"
                value={editedProfile.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
              />
              <input
                type="tel"
                name="phoneNumber"
                value={editedProfile.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
              />
              <input
                type="text"
                name="address"
                value={editedProfile.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4 text-white">
              <p className="text-lg"><strong>Name:</strong> {profile.name}</p>
              <p className="text-lg"><strong>Username:</strong> {profile.username}</p>
              <p className="text-lg"><strong>Email:</strong> {profile.email}</p>
              <p className="text-lg"><strong>Phone:</strong> {profile.phoneNumber}</p>
              <p className="text-lg"><strong>Address:</strong> {profile.address}</p>
              <p className="text-lg"><strong>Total Rides:</strong> {profile.totalRides}</p>
            </div>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
