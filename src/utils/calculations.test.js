import { describe, it, expect } from 'vitest';
import {
  toMinorUnits,
  fromMinorUnits,
  calculateLineItemTotalMinor,
  calculateInvoiceTotals,
  calculateDashboardMetrics,
} from './calculations';

describe('calculations utility', () => {
  it('converts decimal amounts to minor units correctly without float inaccuracies', () => {
    expect(toMinorUnits(10.5)).toBe(1050);
    expect(toMinorUnits(0.07)).toBe(7);
    expect(toMinorUnits(19999.99)).toBe(1999999);
    expect(toMinorUnits('250.25')).toBe(25025);
    expect(toMinorUnits(-50)).toBe(0);
    expect(toMinorUnits(null)).toBe(0);
  });

  it('converts minor units back to standard decimals', () => {
    expect(fromMinorUnits(1050)).toBe(10.5);
    expect(fromMinorUnits(7)).toBe(0.07);
    expect(fromMinorUnits(1999999)).toBe(19999.99);
    expect(fromMinorUnits(0)).toBe(0);
  });

  it('calculates line item total in minor units correctly', () => {
    // 3 items @ 150.25 each -> 450.75 -> 45075 minor units
    expect(calculateLineItemTotalMinor(3, 150.25)).toBe(45075);
    // 0 quantity or price
    expect(calculateLineItemTotalMinor(0, 100)).toBe(0);
    expect(calculateLineItemTotalMinor(5, 0)).toBe(0);
  });

  it('calculates full invoice totals with percentage discount and tax (e.g. 7.5% Nigerian VAT)', () => {
    const items = [
      { quantity: 2, unitPrice: 5000 },  // 10,000
      { quantity: 1, unitPrice: 15000 }, // 15,000
    ]; // Subtotal = 25,000

    const result = calculateInvoiceTotals({
      items,
      discount: 10, // 10% discount -> 2,500
      discountType: 'percentage',
      taxRate: 7.5, // 7.5% VAT on 22,500 -> 1,687.50 -> 168750 minor
    });

    expect(result.subtotal).toBe(25000);
    expect(result.subtotalMinor).toBe(2500000);
    expect(result.discountAmount).toBe(2500);
    expect(result.discountMinor).toBe(250000);
    expect(result.taxAmount).toBe(1687.5);
    expect(result.taxAmountMinor).toBe(168750);
    expect(result.total).toBe(24187.5);
    expect(result.totalMinor).toBe(2418750);
  });

  it('calculates fixed discount without exceeding subtotal', () => {
    const items = [{ quantity: 1, unitPrice: 1000 }];
    const result = calculateInvoiceTotals({
      items,
      discount: 1500, // exceeds subtotal of 1000
      discountType: 'fixed',
      taxRate: 10,
    });

    expect(result.subtotal).toBe(1000);
    expect(result.discountAmount).toBe(1000); // capped at subtotal
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(0);
  });

  it('aggregates dashboard financial metrics accurately', () => {
    const invoices = [
      { total: 50000, status: 'PAID' },
      { total: 30000, status: 'UNPAID', dueDate: '2026-12-01' },
      { total: 20000, status: 'OVERDUE', dueDate: '2025-01-01' },
      { total: 10000, status: 'DRAFT' },
    ];

    const metrics = calculateDashboardMetrics(invoices);
    expect(metrics.totalInvoiced).toBe(100000); // Excludes DRAFT
    expect(metrics.totalPaid).toBe(50000);
    expect(metrics.outstanding).toBe(50000); // 30k UNPAID + 20k OVERDUE
    expect(metrics.counts.paid).toBe(1);
    expect(metrics.counts.unpaid).toBe(1);
    expect(metrics.counts.overdue).toBe(1);
    expect(metrics.counts.draft).toBe(1);
  });
});
