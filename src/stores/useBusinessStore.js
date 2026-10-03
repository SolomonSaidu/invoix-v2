import { create } from 'zustand';
import { getBusinessProfile, saveBusinessProfile } from '../database/db';
import { DEFAULT_CURRENCY } from '../utils/currency';

export const useBusinessStore = create((set, get) => ({
  profile: null,
  isLoading: true,
  showOnboardingModal: false,

  setShowOnboardingModal: (show) => set({ showOnboardingModal: show }),

  loadProfile: async () => {
    try {
      set({ isLoading: true });
      const profile = await getBusinessProfile();
      set({
        profile: profile || {
          name: '',
          phone: '',
          address: '',
          email: '',
          currency: DEFAULT_CURRENCY,
          taxId: '',
          registrationNumber: '',
        },
        isLoading: false,
      });
    } catch (err) {
      console.error('Failed to load business profile:', err);
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const updated = await saveBusinessProfile(data);
      set({ profile: updated, showOnboardingModal: false });
      return updated;
    } catch (err) {
      console.error('Failed to save business profile:', err);
      throw err;
    }
  },
}));
