import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Ride {
  id: string;
  date: string;
  pickup: string;
  destination: string;
  pickupCoords: {
    lat: number;
    lng: number;
  };
  destinationCoords: {
    lat: number;
    lng: number;
  };
  distance: string;
  duration: string;
  fare: number;
  status: 'pending' | 'completed' | 'cancelled';
  rideType: string;
  driver: {
    name: string;
    rating: number;
    photo: string;
    vehicleNumber: string;
    vehicleModel: string;
  };
  isShared: boolean;
  participants?: {
    name: string;
    contribution: number;
  }[];
}

interface Location {
  lat: number;
  lng: number;
}

interface RideState {
  rides: Ride[];
  currentRide: Ride | null;
  lastBookedRoute: {
    pickup: Location;
    destination: Location;
  } | null;
  loyaltyPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  isBookingComplete: boolean;
  setBookingComplete: (status: boolean) => void;
  addRide: (ride: Ride) => void;
  setCurrentRide: (ride: Ride) => void;
  addLoyaltyPoints: (points: number) => void;
  calculateTier: () => void;
  clearCurrentRide: () => void;
  setLastBookedRoute: (pickup: Location, destination: Location) => void;
  clearLastBookedRoute: () => void;
}

export const useRideStore = create(
  persist<RideState>(
    (set, get) => ({
      rides: [],
      currentRide: null,
      lastBookedRoute: null,
      loyaltyPoints: 0,
      tier: 'Bronze',
      isBookingComplete: false,
      setBookingComplete: (status) => set({ isBookingComplete: status }),
      addRide: (ride) => set((state) => {
        const pointsEarned = Math.floor(ride.fare * 0.1); // 10% of fare as points
        return { 
          rides: [...state.rides, ride],
          currentRide: ride,
          loyaltyPoints: state.loyaltyPoints + pointsEarned
        };
      }),
      setCurrentRide: (ride) => set({ currentRide: ride }),
      addLoyaltyPoints: (points) => set((state) => ({ 
        loyaltyPoints: state.loyaltyPoints + points 
      })),
      calculateTier: () => {
        const state = get();
        let newTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' = 'Bronze';
        
        if (state.loyaltyPoints >= 5000) {
          newTier = 'Platinum';
        } else if (state.loyaltyPoints >= 2500) {
          newTier = 'Gold';
        } else if (state.loyaltyPoints >= 1000) {
          newTier = 'Silver';
        }
        
        set({ tier: newTier });
      },
      clearCurrentRide: () => set({ currentRide: null }),
      setLastBookedRoute: (pickup, destination) => 
        set({ lastBookedRoute: { pickup, destination } }),
      clearLastBookedRoute: () => set({ lastBookedRoute: null })
    }),
    {
      name: 'ride-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);