import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { MobileNav } from './MobileNav';
import { PWAInstallModal } from '../common/PWAInstallModal';
import { OnboardingModal } from '../common/OnboardingModal';
import { useBusinessStore } from '../../stores/useBusinessStore';
import { useInvoiceStore } from '../../stores/useInvoiceStore';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { X } from 'lucide-react';

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, isLoading: isProfileLoading, loadProfile, showOnboardingModal, setShowOnboardingModal } = useBusinessStore();
  const { loadInvoices } = useInvoiceStore();
  const { showInstallGuide, setShowInstallGuide, isInstalled } = usePWAInstall();

  // Load IndexedDB state on mount
  useEffect(() => {
    loadProfile();
    loadInvoices();
  }, [loadProfile, loadInvoices]);

  // Check if first-time user needs business setup prompt
  useEffect(() => {
    if (!isProfileLoading && (!profile || !profile.name)) {
      // Check if user has already dismissed or opened before
      const hasPrompted = sessionStorage.getItem('invoix_onboarding_prompted');
      if (!hasPrompted) {
        setShowOnboardingModal(true);
        sessionStorage.setItem('invoix_onboarding_prompted', 'true');
      }
    }
  }, [isProfileLoading, profile, setShowOnboardingModal]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:shrink-0">
        <Sidebar onCloseMobile={() => {}} />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-50 shadow-2xl">
            <div className="absolute top-2 right-2">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>

      {/* PWA Fallback Guide Modal */}
      <PWAInstallModal
        isOpen={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
        isInstalled={isInstalled}
      />

      {/* First-time Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
    </div>
  );
}
