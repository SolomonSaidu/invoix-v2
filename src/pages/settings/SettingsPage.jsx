import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  Settings,
  DollarSign,
  Hash,
  Palette,
  Download,
  Trash2,
  CheckCircle2,
  Database,
  Save,
} from 'lucide-react';
import { useBusinessStore } from '../../stores/useBusinessStore';
import { useInvoiceStore } from '../../stores/useInvoiceStore';
import { useCustomerStore } from '../../stores/useCustomerStore';
import { db } from '../../database/db';
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from '../../utils/currency';

export function SettingsPage() {
  const { profile, updateProfile, loadProfile } = useBusinessStore();
  const { loadInvoices } = useInvoiceStore();
  const { loadCustomers } = useCustomerStore();

  const [formData, setFormData] = useState({
    currency: DEFAULT_CURRENCY,
    invoicePrefix: 'INV-',
    defaultTemplate: 'modern',
    accentColor: '#4f46e5',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [clearDataModalOpen, setClearDataModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        currency: profile.currency || DEFAULT_CURRENCY,
        invoicePrefix: profile.invoicePrefix || 'INV-',
        defaultTemplate: profile.defaultTemplate || 'modern',
        accentColor: profile.accentColor || '#4f46e5',
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateProfile(formData);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
      alert('Failed to save settings');
    }
  };

  // Data Export (JSON backup)
  const handleExportData = async () => {
    try {
      const [profiles, customers, invoices, settings] = await Promise.all([
        db.businessProfile.toArray(),
        db.customers.toArray(),
        db.invoices.toArray(),
        db.settings.toArray(),
      ]);

      const backup = {
        app: 'Invoix',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        data: {
          businessProfile: profiles,
          customers,
          invoices,
          settings,
        },
      };

      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoix-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export data:', err);
      alert('Could not export backup.');
    }
  };

  // Clear Application Data
  const handleClearData = async () => {
    try {
      setIsClearing(true);
      await Promise.all([
        db.businessProfile.clear(),
        db.customers.clear(),
        db.invoices.clear(),
        db.settings.clear(),
      ]);
      await loadProfile();
      await loadInvoices();
      await loadCustomers();
      setIsClearing(false);
      setClearDataModalOpen(false);
      alert('Application data cleared successfully.');
    } catch (err) {
      console.error('Failed to clear data:', err);
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Preferences saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Invoicing Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-brand-600" />
              <h2 className="text-base font-bold text-slate-900">Invoicing Preferences</h2>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Default Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol}) — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Invoice Numbering Prefix
                </label>
                <input
                  type="text"
                  placeholder="INV-"
                  value={formData.invoicePrefix}
                  onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Default PDF Template
                </label>
                <select
                  value={formData.defaultTemplate}
                  onChange={(e) => setFormData({ ...formData, defaultTemplate: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="modern">Modern (Recommended)</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-32 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary" size="sm" icon={Save} isLoading={isSaving}>
              Save Settings
            </Button>
          </div>
        </Card>
      </form>

      {/* Backup & Data Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900">Data Management & Backup</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Export All Data (JSON)</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Download a complete offline JSON backup of your business profile, customers, and invoices.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleExportData}
              className="shrink-0"
            >
              Export JSON Backup
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-rose-50/50 rounded-xl border border-rose-200/80">
            <div>
              <h4 className="text-sm font-bold text-rose-900">Clear Application Data</h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Permanently erase all local invoices, customers, and profile information from this device.
              </p>
            </div>
            <Button
              type="button"
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setClearDataModalOpen(true)}
              className="shrink-0"
            >
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clear Data Confirmation Dialog */}
      <ConfirmDialog
        isOpen={clearDataModalOpen}
        onClose={() => setClearDataModalOpen(false)}
        onConfirm={handleClearData}
        title="Permanently Clear All Application Data?"
        message="This will delete all your local business profile info, customers, and invoice records from IndexedDB. This action cannot be reversed. Make sure you have exported a backup if you need your records."
        confirmText="Yes, Erase Everything"
        isLoading={isClearing}
      />
    </div>
  );
}
