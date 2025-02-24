import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LoyaltyState {
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  ridesCount: number;
  addPoints: (points: number) => void;
  addRide: () => void;
  calculateTier: () => void;
}

export const useLoyaltyStore = create(
  persist<LoyaltyState>(
    (set, get) => ({
      points: 0,
      tier: 'Bronze',
      ridesCount: 0,
      addPoints: (points) => set((state) => {
        const newPoints = state.points + points;
        return { points: newPoints };
      }),
      addRide: () => set((state) => {
        const newRidesCount = state.ridesCount + 1;
        return { ridesCount: newRidesCount };
      }),
      calculateTier: () => {
        const state = get();
        let newTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' = 'Bronze';
        
        if (state.points >= 5000 && state.ridesCount >= 50) {
          newTier = 'Platinum';
        } else if (state.points >= 2500 && state.ridesCount >= 25) {
          newTier = 'Gold';
        } else if (state.points >= 1000 && state.ridesCount >= 10) {
          newTier = 'Silver';
        }
        
        set({ tier: newTier });
      },
    }),
    {
      name: 'loyalty-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);