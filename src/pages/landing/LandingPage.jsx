import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { FeatureGrid } from './FeatureGrid';
import { HowItWorksSection } from './HowItWorksSection';
import { FAQSection } from './FAQSection';
import { LandingFooter } from './LandingFooter';
import { PWAInstallModal } from '../../components/common/PWAInstallModal';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export function LandingPage() {
  const { showInstallGuide, setShowInstallGuide, isInstalled } = usePWAInstall();

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureGrid />
        <HowItWorksSection />
        <FAQSection />
      </main>
      <LandingFooter />

      {/* PWA Install Modal for Fallbacks / Manual installation */}
      <PWAInstallModal
        isOpen={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
        isInstalled={isInstalled}
      />
    </div>
  );
}
