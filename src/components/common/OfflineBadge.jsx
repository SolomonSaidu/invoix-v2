import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export function OfflineBadge({ showOnlineText = false, className = '' }) {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80 shadow-subtle ${className}`}
        title="Working offline. All changes are saved locally on your device."
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <WifiOff className="w-3.5 h-3.5 text-amber-600" />
        <span>Offline Mode</span>
      </div>
    );
  }

  if (showOnlineText) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${className}`}
        title="Connected to internet"
      >
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        <Wifi className="w-3.5 h-3.5 text-emerald-600" />
        <span>Online</span>
      </div>
    );
  }

  return null;
}
