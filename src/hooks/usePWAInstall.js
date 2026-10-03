import { useEffect } from 'react';
import { usePWAStore } from '../stores/usePWAStore';

export function usePWAInstall() {
  const isInstallable = usePWAStore((s) => s.isInstallable);
  const isInstalled = usePWAStore((s) => s.isInstalled);
  const showInstallGuide = usePWAStore((s) => s.showInstallGuide);
  const setShowInstallGuide = usePWAStore((s) => s.setShowInstallGuide);
  const setDeferredPrompt = usePWAStore((s) => s.setDeferredPrompt);
  const setInstalled = usePWAStore((s) => s.setInstalled);
  const triggerInstall = usePWAStore((s) => s.triggerInstall);

  useEffect(() => {
    // Check if already running in standalone mode (installed PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setInstalled(true);
      return;
    }

    // Capture beforeinstallprompt event
    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }

    function handleAppInstalled() {
      setInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [setDeferredPrompt, setInstalled]);

  return {
    isInstallable,
    isInstalled,
    showInstallGuide,
    setShowInstallGuide,
    triggerInstall,
  };
}
