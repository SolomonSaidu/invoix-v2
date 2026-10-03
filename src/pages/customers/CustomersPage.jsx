import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { CustomerModal } from '../../features/customers/CustomerModal';
import { CustomerDetailsModal } from '../../features/customers/CustomerDetailsModal';
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  FilePlus,
  Receipt,
} from 'lucide-react';
import { useCustomerStore } from '../../stores/useCustomerStore';
import { useInvoiceStore } from '../../stores/useInvoiceStore';
import { Link } from 'react-router-dom';

export function CustomersPage() {
  const {
    customers,
    isLoading,
    loadCustomers,
    createCustomer,
    editCustomer,
    removeCustomer,
  } = useCustomerStore();
  const { invoices, loadInvoices } = useInvoiceStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [deleteConfirmCustomer, setDeleteConfirmCustomer] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCustomers();
    loadInvoices();
  }, [loadCustomers, loadInvoices]);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setSelectedCustomer(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleSaveCustomer = async (formData) => {
    if (selectedCustomer?.id) {
      await editCustomer(selectedCustomer.id, formData);
    } else {
      await createCustomer(formData);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmCustomer) return;
    try {
      setIsDeleting(true);
      await removeCustomer(deleteConfirmCustomer.id);
      setIsDeleting(false);
      setDeleteConfirmCustomer(null);
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search customers by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <Button size="md" icon={UserPlus} onClick={handleOpenAdd}>
          Add Customer
        </Button>
      </div>

      {/* Customers List / Grid */}
      {isLoading ? (
        <div className="p-8 text-center text-sm text-slate-500">Loading customers...</div>
      ) : customers.length === 0 ? (
        /* Empty State */
        <Card>
          <CardContent className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No customers saved yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
              Add your client details to quickly autofill them when creating invoices.
            </p>
            <Button size="sm" icon={UserPlus} onClick={handleOpenAdd}>
              Add Your First Customer
            </Button>
          </CardContent>
        </Card>
      ) : filteredCustomers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-slate-500">
            No customers match "{searchQuery}".
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => {
            const customerInvoicesCount = invoices.filter(
              (inv) =>
                Number(inv.customerId) === Number(customer.id) ||
                inv.customerSnapshot?.name?.toLowerCase() === customer.name.toLowerCase()
            ).length;

            return (
              <Card key={customer.id} hover className="flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-bold flex items-center justify-center text-base shrink-0">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">
                          {customer.name}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          {customerInvoicesCount} invoice{customerInvoicesCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(customer)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmCustomer(customer)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    {customer.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{customer.phone}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-start gap-2 truncate text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="truncate">{customer.address}</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 rounded-b-xl flex items-center justify-between text-xs">
                  <button
                    onClick={() => setViewCustomer(customer)}
                    className="font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View History</span>
                  </button>

                  <Link
                    to={`/app/invoices/new?customerId=${customer.id}`}
                    className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
                  >
                    <FilePlus className="w-3.5 h-3.5 text-brand-500" />
                    <span>New Invoice</span>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      <CustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
      />

      {/* Customer Details & History Modal */}
      <CustomerDetailsModal
        isOpen={Boolean(viewCustomer)}
        onClose={() => setViewCustomer(null)}
        customer={viewCustomer}
        invoices={invoices}
        onEdit={(cust) => handleOpenEdit(cust)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmCustomer)}
        onClose={() => setDeleteConfirmCustomer(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        message={`Are you sure you want to remove "${deleteConfirmCustomer?.name}" from your customer directory? Existing invoice snapshots will remain completely intact.`}
        confirmText="Delete Customer"
        isLoading={isDeleting}
      />
    </div>
  );
}
