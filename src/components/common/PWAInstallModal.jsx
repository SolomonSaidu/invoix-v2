import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Download, Share2, PlusSquare, Monitor, CheckCircle2, Smartphone, Globe, MoreVertical } from 'lucide-react';

export function PWAInstallModal({ isOpen, onClose, isInstalled }) {
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Install Invoix on Your Device" maxWidth="max-w-md">
      <div className="space-y-4">
        {isInstalled ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Invoix is already installed!</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Invoix is ready on your device. You can launch it directly from your home screen or applications menu anytime, with full offline access.
            </p>
          </div>
        ) : isIOS ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              To install Invoix on your iPhone or iPad for 1-tap offline access:
            </p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 shadow-sm">
                  <Share2 className="w-4 h-4 text-brand-600" />
                </div>
                <span>1. Tap the <strong>Share</strong> icon in Safari's bottom toolbar.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 shadow-sm">
                  <PlusSquare className="w-4 h-4 text-brand-600" />
                </div>
                <span>2. Scroll down and tap <strong>Add to Home Screen</strong>.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 shadow-sm">
                  <Download className="w-4 h-4 text-brand-600" />
                </div>
                <span>3. Tap <strong>Add</strong> in the top-right corner.</span>
              </div>
            </div>
          </div>
        ) : isAndroid ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              To install Invoix on your Android device:
            </p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 shadow-sm">
                  <MoreVertical className="w-4 h-4 text-brand-600" />
                </div>
                <span>1. Tap the <strong>menu (⋮)</strong> icon in your mobile browser.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 shadow-sm">
                  <Smartphone className="w-4 h-4 text-brand-600" />
                </div>
                <span>2. Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Install Invoix as a standalone desktop app on your computer for instant offline access:
            </p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 shadow-sm mt-0.5">
                  <Monitor className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-0.5">From your browser address bar:</p>
                  <span>Click the <strong>Install icon</strong> (computer screen with a down arrow) at the right end of the address bar, then click <strong>Install</strong>.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Button variant="primary" onClick={onClose} size="sm">
            Got it
          </Button>
        </div>
      </div>
    </Modal>
  );
}
