import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { InvoiceStatusBadge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  Filter,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useInvoiceStore } from '../../stores/useInvoiceStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/dates';

export function InvoicesPage() {
  const {
    invoices,
    isLoading,
    loadInvoices,
    removeInvoice,
    togglePaidStatus,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  } = useInvoiceStore();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (inv.invoiceNumber || '').toLowerCase().includes(q) ||
      (inv.customerSnapshot?.name || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PAID') return inv.status === 'PAID';
    if (statusFilter === 'DRAFT') return inv.status === 'DRAFT';
    if (statusFilter === 'UNPAID') return inv.status === 'UNPAID' && !inv.isOverdue;
    if (statusFilter === 'OVERDUE') return inv.isOverdue || inv.status === 'OVERDUE';
    return true;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await removeInvoice(deleteTarget.id);
      setIsDeleting(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  const counts = {
    ALL: invoices.length,
    UNPAID: invoices.filter((i) => i.status === 'UNPAID' && !i.isOverdue).length,
    PAID: invoices.filter((i) => i.status === 'PAID').length,
    OVERDUE: invoices.filter((i) => i.isOverdue || i.status === 'OVERDUE').length,
    DRAFT: invoices.filter((i) => i.status === 'DRAFT').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by invoice number or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <Link to="/app/invoices/new">
          <Button size="md" icon={Plus}>
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'ALL', label: 'All Invoices', count: counts.ALL },
          { key: 'UNPAID', label: 'Unpaid', count: counts.UNPAID },
          { key: 'PAID', label: 'Paid', count: counts.PAID },
          { key: 'OVERDUE', label: 'Overdue', count: counts.OVERDUE },
          { key: 'DRAFT', label: 'Drafts', count: counts.DRAFT },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Invoices List / Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-slate-500">Loading invoices...</div>
          ) : invoices.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                <Receipt className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No invoices yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                Generate clean, professional invoices for your clients offline in seconds.
              </p>
              <Link to="/app/invoices/new">
                <Button size="sm" icon={Plus}>
                  Create Your First Invoice
                </Button>
              </Link>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No invoices found matching current search or filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Invoice #</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Issue Date</th>
                    <th className="px-5 py-3">Due Date</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        <Link
                          to={`/app/invoices/${inv.id}`}
                          className="hover:text-brand-600 transition-colors"
                        >
                          {inv.invoiceNumber}
                        </Link>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-900">
                          {inv.customerSnapshot?.name || 'Walk-in Customer'}
                        </div>
                        {inv.customerSnapshot?.email && (
                          <div className="text-[11px] text-slate-400">
                            {inv.customerSnapshot.email}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-slate-600">
                        {formatDate(inv.issueDate)}
                      </td>

                      <td className="px-5 py-3.5 text-slate-600">
                        {formatDate(inv.dueDate)}
                      </td>

                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {formatCurrency(inv.total, inv.currency)}
                      </td>

                      <td className="px-5 py-3.5">
                        <InvoiceStatusBadge
                          status={inv.isOverdue ? 'OVERDUE' : inv.status}
                        />
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Paid Status */}
                          <button
                            onClick={() => togglePaidStatus(inv.id, inv.status)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              inv.status === 'PAID'
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100'
                            }`}
                            title={inv.status === 'PAID' ? 'Mark as Unpaid' : 'Mark as Paid'}
                          >
                            <Check className="w-4 h-4" />
                          </button>

                          <Link
                            to={`/app/invoices/${inv.id}`}
                            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Invoice Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/app/invoices/edit/${inv.id}`}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Invoice"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => setDeleteTarget(inv)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Invoice"
        message={`Are you sure you want to permanently delete invoice "${deleteTarget?.invoiceNumber}"? This action cannot be undone.`}
        confirmText="Delete Permanently"
        isLoading={isDeleting}
      />
    </div>
  );
}
