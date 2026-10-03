import { create } from 'zustand';
import {
  db,
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoiceStatus,
  getNextInvoiceNumber,
} from '../database/db';
import { calculateDashboardMetrics } from '../utils/calculations';

export const useInvoiceStore = create((set, get) => ({
  invoices: [],
  isLoading: false,
  customerCount: 0,
  searchQuery: '',
  statusFilter: 'ALL',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),

  loadInvoices: async () => {
    try {
      set({ isLoading: true });
      const [invoices, customerCount] = await Promise.all([
        getInvoices(),
        db.customers.count(),
      ]);
      set({
        invoices: invoices || [],
        customerCount: customerCount || 0,
        isLoading: false,
      });
    } catch (err) {
      console.error('Failed to load invoices:', err);
      set({ isLoading: false });
    }
  },

  getInvoice: async (id) => {
    return await getInvoiceById(id);
  },

  getNextNumber: async () => {
    return await getNextInvoiceNumber();
  },

  addInvoice: async (invoiceData) => {
    try {
      const created = await createInvoice(invoiceData);
      await get().loadInvoices();
      return created;
    } catch (err) {
      console.error('Failed to add invoice:', err);
      throw err;
    }
  },

  editInvoice: async (id, invoiceData) => {
    try {
      const updated = await updateInvoice(id, invoiceData);
      await get().loadInvoices();
      return updated;
    } catch (err) {
      console.error('Failed to edit invoice:', err);
      throw err;
    }
  },

  removeInvoice: async (id) => {
    try {
      await deleteInvoice(id);
      await get().loadInvoices();
      return true;
    } catch (err) {
      console.error('Failed to delete invoice:', err);
      throw err;
    }
  },

  togglePaidStatus: async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
      await markInvoiceStatus(id, newStatus);
      await get().loadInvoices();
    } catch (err) {
      console.error('Failed to update status:', err);
      throw err;
    }
  },

  getMetrics: () => {
    const { invoices } = get();
    return calculateDashboardMetrics(invoices);
  },
}));
