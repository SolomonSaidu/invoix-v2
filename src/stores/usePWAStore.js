import { create } from 'zustand';

export const usePWAStore = create((set, get) => ({
  isInstallable: false,
  isInstalled: false,
  showInstallGuide: false,
  deferredPrompt: null,

  setShowInstallGuide: (show) => set({ showInstallGuide: show }),

  setDeferredPrompt: (prompt) => {
    set({ deferredPrompt: prompt, isInstallable: true });
  },

  setInstalled: (installed) => {
    set({ isInstalled: installed, isInstallable: false, deferredPrompt: null });
  },

  triggerInstall: async () => {
    const { isInstalled, deferredPrompt } = get();

    if (isInstalled) {
      set({ showInstallGuide: true });
      return;
    }

    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          set({ isInstalled: true, isInstallable: false, deferredPrompt: null });
        }
      } catch (err) {
        console.error('PWA install prompt error:', err);
        set({ showInstallGuide: true });
      }
    } else {
      // If browser doesn't offer native programmatic prompt (e.g. desktop Chrome already installed/iOS Safari/Firefox), show clear instructions modal
      set({ showInstallGuide: true });
    }
  },
}));
