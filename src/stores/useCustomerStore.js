import { create } from 'zustand';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../database/db';

export const useCustomerStore = create((set, get) => ({
  customers: [],
  isLoading: false,
  searchQuery: '',

  setSearchQuery: (query) => set({ searchQuery: query }),

  loadCustomers: async () => {
    try {
      set({ isLoading: true });
      const customers = await getCustomers();
      set({ customers: customers || [], isLoading: false });
    } catch (err) {
      console.error('Failed to load customers:', err);
      set({ isLoading: false });
    }
  },

  createCustomer: async (customerData) => {
    try {
      const created = await addCustomer(customerData);
      await get().loadCustomers();
      return created;
    } catch (err) {
      console.error('Failed to create customer:', err);
      throw err;
    }
  },

  editCustomer: async (id, customerData) => {
    try {
      const updated = await updateCustomer(id, customerData);
      await get().loadCustomers();
      return updated;
    } catch (err) {
      console.error('Failed to update customer:', err);
      throw err;
    }
  },

  removeCustomer: async (id) => {
    try {
      await deleteCustomer(id);
      await get().loadCustomers();
      return true;
    } catch (err) {
      console.error('Failed to delete customer:', err);
      throw err;
    }
  },
}));
