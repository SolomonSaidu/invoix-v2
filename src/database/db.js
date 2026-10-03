import Dexie from 'dexie';
import { calculateInvoiceTotals, toMinorUnits, fromMinorUnits } from '../utils/calculations';
import { DEFAULT_CURRENCY } from '../utils/currency';

/**
 * Dexie.js IndexedDB schema and operations for Invoix
 */
export const db = new Dexie('InvoixDB');

db.version(1).stores({
  businessProfile: '++id, name, email, phone, currency, updatedAt',
  customers: '++id, name, email, phone, createdAt, updatedAt',
  invoices: '++id, invoiceNumber, customerId, status, issueDate, dueDate, total, createdAt, updatedAt',
  settings: '++id, key',
});

// ==========================================
// 1. BUSINESS PROFILE OPERATIONS
// ==========================================

export async function getBusinessProfile() {
  const profiles = await db.businessProfile.toArray();
  if (profiles.length > 0) {
    return profiles[0];
  }
  return {
    name: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    registrationNumber: '',
    currency: DEFAULT_CURRENCY,
    logoData: null,
    paymentInstructions: 'Bank: Zenith Bank\nAccount Name: Adeola & Sons Trading\nAccount Number: 1012345678',
    terms: 'Payment is due within 14 days of invoice date. Thank you for your business!',
    invoicePrefix: 'INV-',
    nextInvoiceSequence: 1,
  };
}

export async function saveBusinessProfile(profileData) {
  const profiles = await db.businessProfile.toArray();
  const timestamp = new Date().toISOString();

  if (profiles.length > 0) {
    const existing = profiles[0];
    const updated = {
      ...existing,
      ...profileData,
      updatedAt: timestamp,
    };
    await db.businessProfile.put(updated);
    return updated;
  } else {
    const newProfile = {
      ...profileData,
      currency: profileData.currency || DEFAULT_CURRENCY,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const id = await db.businessProfile.add(newProfile);
    return { ...newProfile, id };
  }
}

// ==========================================
// 2. CUSTOMERS OPERATIONS
// ==========================================

export async function getCustomers() {
  return await db.customers.orderBy('name').toArray();
}

export async function getCustomerById(id) {
  return await db.customers.get(Number(id));
}

export async function addCustomer(customerData) {
  const timestamp = new Date().toISOString();
  const newCustomer = {
    name: (customerData.name || '').trim(),
    email: (customerData.email || '').trim(),
    phone: (customerData.phone || '').trim(),
    address: (customerData.address || '').trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const id = await db.customers.add(newCustomer);
  return { ...newCustomer, id };
}

export async function updateCustomer(id, customerData) {
  const timestamp = new Date().toISOString();
  const numId = Number(id);
  const existing = await db.customers.get(numId);
  if (!existing) throw new Error('Customer not found');

  const updated = {
    ...existing,
    name: (customerData.name ?? existing.name).trim(),
    email: (customerData.email ?? existing.email).trim(),
    phone: (customerData.phone ?? existing.phone).trim(),
    address: (customerData.address ?? existing.address).trim(),
    updatedAt: timestamp,
  };

  await db.customers.put(updated);
  return updated;
}

export async function deleteCustomer(id) {
  const numId = Number(id);
  await db.customers.delete(numId);
  return true;
}

// ==========================================
// 3. INVOICES OPERATIONS
// ==========================================

export async function getInvoices() {
  const invoices = await db.invoices.reverse().sortBy('createdAt');
  const now = new Date();

  // Dynamic overdue status computation
  return invoices.map((inv) => {
    if (inv.status === 'UNPAID' && inv.dueDate && new Date(inv.dueDate) < now) {
      return { ...inv, isOverdue: true };
    }
    return { ...inv, isOverdue: inv.status === 'OVERDUE' };
  });
}

export async function getInvoiceById(id) {
  const inv = await db.invoices.get(Number(id));
  if (!inv) return null;
  const now = new Date();
  if (inv.status === 'UNPAID' && inv.dueDate && new Date(inv.dueDate) < now) {
    return { ...inv, isOverdue: true };
  }
  return { ...inv, isOverdue: inv.status === 'OVERDUE' };
}

export async function getNextInvoiceNumber() {
  const profile = await getBusinessProfile();
  const prefix = profile?.invoicePrefix || 'INV-';
  const count = await db.invoices.count();
  const nextNum = (count + 1).toString().padStart(4, '0');
  return `${prefix}${nextNum}`;
}

export async function createInvoice(invoiceData) {
  const timestamp = new Date().toISOString();
  
  // Calculate totals precisely using minor units
  const totals = calculateInvoiceTotals({
    items: invoiceData.items || [],
    discount: invoiceData.discount || 0,
    discountType: invoiceData.discountType || 'percentage',
    taxRate: invoiceData.taxRate || 0,
  });

  const invoiceNumber = invoiceData.invoiceNumber || (await getNextInvoiceNumber());

  // Check unique invoice number
  const existing = await db.invoices.where('invoiceNumber').equals(invoiceNumber).first();
  if (existing) {
    throw new Error(`Invoice number "${invoiceNumber}" already exists.`);
  }

  const newInvoice = {
    invoiceNumber,
    customerId: invoiceData.customerId ? Number(invoiceData.customerId) : null,
    // Snapshots preserve historical data immutability
    customerSnapshot: invoiceData.customerSnapshot || {
      name: invoiceData.customerName || 'Walk-in Customer',
      email: invoiceData.customerEmail || '',
      phone: invoiceData.customerPhone || '',
      address: invoiceData.customerAddress || '',
    },
    businessSnapshot: invoiceData.businessSnapshot || {
      name: invoiceData.businessName || '',
      email: invoiceData.businessEmail || '',
      phone: invoiceData.businessPhone || '',
      address: invoiceData.businessAddress || '',
      taxId: invoiceData.businessTaxId || '',
      registrationNumber: invoiceData.businessRegistrationNumber || '',
      logoData: invoiceData.businessLogoData || null,
    },
    items: (invoiceData.items || []).map((it, idx) => ({
      id: it.id || `item-${Date.now()}-${idx}`,
      description: it.description || '',
      quantity: Math.max(0, Number(it.quantity) || 1),
      unitPrice: Math.max(0, Number(it.unitPrice) || 0),
      amount: (Math.max(0, Number(it.quantity) || 1) * Math.max(0, Number(it.unitPrice) || 0)),
    })),
    subtotal: totals.subtotal,
    subtotalMinor: totals.subtotalMinor,
    discount: invoiceData.discount || 0,
    discountType: invoiceData.discountType || 'percentage',
    discountAmount: totals.discountAmount,
    discountMinor: totals.discountMinor,
    taxRate: totals.taxRate,
    taxAmount: totals.taxAmount,
    taxAmountMinor: totals.taxAmountMinor,
    total: totals.total,
    totalMinor: totals.totalMinor,
    currency: invoiceData.currency || DEFAULT_CURRENCY,
    status: invoiceData.status || 'UNPAID',
    issueDate: invoiceData.issueDate || new Date().toISOString().split('T')[0],
    dueDate: invoiceData.dueDate || new Date().toISOString().split('T')[0],
    notes: invoiceData.notes || '',
    paymentInstructions: invoiceData.paymentInstructions || '',
    terms: invoiceData.terms || '',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const id = await db.invoices.add(newInvoice);
  return { ...newInvoice, id };
}

export async function updateInvoice(id, invoiceData) {
  const timestamp = new Date().toISOString();
  const numId = Number(id);
  const existing = await db.invoices.get(numId);
  if (!existing) throw new Error('Invoice not found');

  const totals = calculateInvoiceTotals({
    items: invoiceData.items ?? existing.items,
    discount: invoiceData.discount ?? existing.discount,
    discountType: invoiceData.discountType ?? existing.discountType,
    taxRate: invoiceData.taxRate ?? existing.taxRate,
  });

  const updated = {
    ...existing,
    ...invoiceData,
    items: (invoiceData.items ?? existing.items).map((it, idx) => ({
      id: it.id || `item-${Date.now()}-${idx}`,
      description: it.description || '',
      quantity: Math.max(0, Number(it.quantity) || 1),
      unitPrice: Math.max(0, Number(it.unitPrice) || 0),
      amount: (Math.max(0, Number(it.quantity) || 1) * Math.max(0, Number(it.unitPrice) || 0)),
    })),
    subtotal: totals.subtotal,
    subtotalMinor: totals.subtotalMinor,
    discountAmount: totals.discountAmount,
    discountMinor: totals.discountMinor,
    taxRate: totals.taxRate,
    taxAmount: totals.taxAmount,
    taxAmountMinor: totals.taxAmountMinor,
    total: totals.total,
    totalMinor: totals.totalMinor,
    updatedAt: timestamp,
  };

  await db.invoices.put(updated);
  return updated;
}

export async function markInvoiceStatus(id, newStatus) {
  const numId = Number(id);
  const timestamp = new Date().toISOString();
  await db.invoices.update(numId, {
    status: newStatus,
    updatedAt: timestamp,
  });
  return await db.invoices.get(numId);
}

export async function deleteInvoice(id) {
  const numId = Number(id);
  await db.invoices.delete(numId);
  return true;
}
