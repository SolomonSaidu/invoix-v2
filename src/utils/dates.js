import { format, parseISO, isValid } from 'date-fns';

/**
 * Formats a date string or Date object into human-friendly format
 * @param {string|Date} dateVal 
 * @param {string} formatStr 
 * @returns {string} Formatted date (e.g. 'Oct 24, 2026')
 */
export function formatDate(dateVal, formatStr = 'MMM dd, yyyy') {
  if (!dateVal) return '—';
  
  try {
    const d = typeof dateVal === 'string' ? parseISO(dateVal) : dateVal;
    if (!isValid(d)) return '—';
    return format(d, formatStr);
  } catch {
    return '—';
  }
}

/**
 * Returns today's date formatted as YYYY-MM-DD for form inputs
 */
export function getTodayISODate() {
  return format(new Date(), 'yyyy-MM-dd');
}
