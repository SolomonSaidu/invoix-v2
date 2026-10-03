/**
 * Calculation Utilities for Invoix
 * 
 * Uses integer minor units (kobo, cents, etc.) to eliminate floating-point 
 * rounding errors across forms, dashboard statistics, and PDF generation.
 */

/**
 * Converts a standard decimal amount to integer minor units (e.g. 150.75 -> 15075)
 * @param {number|string} amount
 * @returns {number} Integer minor units
 */
export function toMinorUnits(amount) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num) || num <= 0) return 0;
  return Math.round(num * 100);
}

/**
 * Converts integer minor units back to a standard decimal number (e.g. 15075 -> 150.75)
 * @param {number} minorUnits
 * @returns {number} Standard decimal float
 */
export function fromMinorUnits(minorUnits) {
  if (!minorUnits || isNaN(minorUnits) || minorUnits <= 0) return 0;
  return minorUnits / 100;
}

/**
 * Calculates line item total in minor units
 * @param {number} quantity
 * @param {number} unitPrice Decimal or unit price in regular units
 * @returns {number} Line item total in minor units
 */
export function calculateLineItemTotalMinor(quantity = 0, unitPrice = 0) {
  const safeQty = Math.max(0, Number(quantity) || 0);
  const unitPriceMinor = toMinorUnits(unitPrice);
  return Math.round(safeQty * unitPriceMinor);
}

/**
 * Comprehensive invoice totals calculation
 * @param {Object} options
 * @param {Array<{quantity: number, unitPrice: number}>} options.items
 * @param {number} [options.discount=0] Discount value (percentage or fixed)
 * @param {'percentage'|'fixed'} [options.discountType='percentage']
 * @param {number} [options.taxRate=0] Tax rate percentage (e.g. 7.5 for 7.5% VAT)
 * @returns {Object} Calculated totals in both minor units and standard decimals
 */
export function calculateInvoiceTotals({
  items = [],
  discount = 0,
  discountType = 'percentage',
  taxRate = 0,
} = {}) {
  // 1. Calculate subtotal in minor units
  const subtotalMinor = items.reduce((acc, item) => {
    const qty = Math.max(0, Number(item.quantity) || 0);
    const price = Math.max(0, Number(item.unitPrice) || 0);
    return acc + calculateLineItemTotalMinor(qty, price);
  }, 0);

  // 2. Calculate discount in minor units
  const numDiscount = Math.max(0, Number(discount) || 0);
  let discountMinor = 0;
  if (discountType === 'percentage') {
    const safePercent = Math.min(100, numDiscount);
    discountMinor = Math.round((subtotalMinor * safePercent) / 100);
  } else {
    discountMinor = Math.min(subtotalMinor, toMinorUnits(numDiscount));
  }

  // 3. Taxable base
  const taxableAmountMinor = Math.max(0, subtotalMinor - discountMinor);

  // 4. Tax amount in minor units
  const safeTaxRate = Math.max(0, Number(taxRate) || 0);
  const taxAmountMinor = Math.round((taxableAmountMinor * safeTaxRate) / 100);

  // 5. Grand total in minor units
  const totalMinor = taxableAmountMinor + taxAmountMinor;

  return {
    subtotalMinor,
    subtotal: fromMinorUnits(subtotalMinor),
    discountMinor,
    discountAmount: fromMinorUnits(discountMinor),
    taxAmountMinor,
    taxAmount: fromMinorUnits(taxAmountMinor),
    taxRate: safeTaxRate,
    totalMinor,
    total: fromMinorUnits(totalMinor),
  };
}

/**
 * Computes dashboard statistics from invoice records
 * @param {Array} invoices 
 * @returns {Object} Aggregated metrics in standard decimals and counts
 */
export function calculateDashboardMetrics(invoices = []) {
  let totalInvoicedMinor = 0;
  let totalPaidMinor = 0;
  let outstandingMinor = 0;
  let totalDraftCount = 0;
  let totalPaidCount = 0;
  let totalUnpaidCount = 0;
  let totalOverdueCount = 0;

  const now = new Date();

  invoices.forEach((inv) => {
    const invoiceTotalMinor = inv.totalMinor ?? toMinorUnits(inv.total ?? 0);
    const status = inv.status ? inv.status.toUpperCase() : 'DRAFT';

    if (status !== 'DRAFT') {
      totalInvoicedMinor += invoiceTotalMinor;
    }

    if (status === 'PAID') {
      totalPaidMinor += invoiceTotalMinor;
      totalPaidCount++;
    } else if (status === 'UNPAID') {
      outstandingMinor += invoiceTotalMinor;
      totalUnpaidCount++;

      // Check if overdue by due date
      if (inv.dueDate && new Date(inv.dueDate) < now) {
        totalOverdueCount++;
      }
    } else if (status === 'OVERDUE') {
      outstandingMinor += invoiceTotalMinor;
      totalOverdueCount++;
    } else if (status === 'DRAFT') {
      totalDraftCount++;
    }
  });

  return {
    totalInvoiced: fromMinorUnits(totalInvoicedMinor),
    totalPaid: fromMinorUnits(totalPaidMinor),
    outstanding: fromMinorUnits(outstandingMinor),
    counts: {
      total: invoices.length,
      paid: totalPaidCount,
      unpaid: totalUnpaidCount,
      overdue: totalOverdueCount,
      draft: totalDraftCount,
    }
  };
}
