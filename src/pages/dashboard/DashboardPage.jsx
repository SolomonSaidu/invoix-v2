import React from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  CheckCircle,
  Clock,
  Users,
  Plus,
  ArrowRight,
  Receipt,
  Building2,
  FilePlus,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { InvoiceStatusBadge } from '../../components/ui/Badge';
import { useInvoiceStore } from '../../stores/useInvoiceStore';
import { useBusinessStore } from '../../stores/useBusinessStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/dates';

export function DashboardPage() {
  const { invoices, customerCount, isLoading, getMetrics } = useInvoiceStore();
  const { profile, setShowOnboardingModal } = useBusinessStore();

  const metrics = getMetrics();
  const currencyCode = profile?.currency || 'NGN';
  const hasInvoices = invoices.length > 0;
  const recentInvoices = invoices.slice(0, 5);

  const isProfileConfigured = Boolean(profile && profile.name && profile.name.trim().length > 0);

  return (
    <div className="space-y-6">
      {/* Onboarding Welcome Card (if business not configured yet) */}
      {!isProfileConfigured && (
        <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-2xl p-5 sm:p-6 text-white shadow-elevation flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
              <Building2 className="w-3.5 h-3.5" />
              <span>Quick Setup</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Let's set up your business</h2>
            <p className="text-brand-100 text-sm max-w-xl">
              Add your company name, logo, and phone number so your invoices look professional and ready to send.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowOnboardingModal(true)}
            className="shrink-0 bg-white text-brand-700 hover:bg-brand-50 border-none font-semibold shadow-md"
          >
            Complete Profile
          </Button>
        </div>
      )}

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoiced */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Invoiced
              </span>
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {isLoading ? '...' : formatCurrency(metrics.totalInvoiced, currencyCode)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {metrics.counts.paid + metrics.counts.unpaid} issued invoices
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Paid */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Paid
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {isLoading ? '...' : formatCurrency(metrics.totalPaid, currencyCode)}
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                {metrics.counts.paid} completed payments
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding / Unpaid */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Outstanding
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {isLoading ? '...' : formatCurrency(metrics.outstanding, currencyCode)}
              </div>
              <p className="text-xs text-amber-600 font-medium mt-1">
                {metrics.counts.unpaid + metrics.counts.overdue} pending collection
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Customers
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {isLoading ? '...' : customerCount}
              </div>
              <p className="text-xs text-slate-500 mt-1">Saved customer records</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Invoices & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Invoices</h3>
              </div>
              {hasInvoices && (
                <Link
                  to="/app/invoices"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </CardHeader>

            <div className="p-0">
              {isLoading ? (
                <div className="p-8 text-center text-sm text-slate-500">Loading records...</div>
              ) : !hasInvoices ? (
                /* Clean Empty State */
                <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                    <Receipt className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-900">No invoices generated yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                    Start creating clean, customized invoices for your clients. Offline-ready and saved directly on your device.
                  </p>
                  <Link to="/app/invoices/new">
                    <Button size="sm" icon={Plus}>
                      Create Your First Invoice
                    </Button>
                  </Link>
                </div>
              ) : (
                /* Invoices Table */
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-100 font-semibold">
                      <tr>
                        <th className="px-5 py-3">Invoice #</th>
                        <th className="px-5 py-3">Customer</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Amount</th>
                        <th className="px-5 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {recentInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5 font-semibold text-slate-900">
                            <Link
                              to={`/app/invoices/${inv.id}`}
                              className="hover:text-brand-600 transition-colors"
                            >
                              {inv.invoiceNumber}
                            </Link>
                          </td>
                          <td className="px-5 py-3.5">
                            {inv.customerSnapshot?.name || 'Walk-in Customer'}
                          </td>
                          <td className="px-5 py-3.5 text-slate-500">
                            {formatDate(inv.issueDate)}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-slate-900">
                            {formatCurrency(inv.total, inv.currency || currencyCode)}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <InvoiceStatusBadge status={inv.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions & Tips Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-sm font-bold text-slate-900">Quick Shortcuts</h3>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <Link
                to="/app/invoices/new"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-brand-50/70 text-slate-700 hover:text-brand-700 transition-all border border-transparent hover:border-brand-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <FilePlus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-brand-700">
                      Create New Invoice
                    </div>
                    <div className="text-[11px] text-slate-500">With instant PDF export</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
              </Link>

              <Link
                to="/app/customers"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">Add Customer</div>
                    <div className="text-[11px] text-slate-500">Save client directory details</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </Link>

              <button
                onClick={() => setShowOnboardingModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200 group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">Business Profile</div>
                    <div className="text-[11px] text-slate-500">Logo, address & currency</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </button>
            </CardContent>
          </Card>

          {/* Offline Security Info Card */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-brand-300 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Offline-First Guarantee</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              No registration required. Your business data and logo stay strictly on your device in IndexedDB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
