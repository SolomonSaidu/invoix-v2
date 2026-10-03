/**
 * Currency utility helpers for Invoix
 * Default currency is NGN (Nigerian Naira ₦)
 */

export const SUPPORTED_CURRENCIES = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', locale: 'en-NG' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', locale: 'en-GH' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', locale: 'en-KE' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
];

export const DEFAULT_CURRENCY = 'NGN';

/**
 * Formats a numeric amount with the given currency code
 * @param {number} amount Standard decimal amount
 * @param {string} currencyCode Currency ISO code (defaults to NGN)
 * @returns {string} Formatted string (e.g. ₦ 25,000.00)
 */
export function formatCurrency(amount = 0, currencyCode = DEFAULT_CURRENCY) {
  const currencyObj = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  const safeAmount = Number(amount) || 0;

  try {
    return new Intl.NumberFormat(currencyObj.locale, {
      style: 'currency',
      currency: currencyObj.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    // Fallback in case Intl currency code lookup fails in older runtimes
    return `${currencyObj.symbol} ${safeAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

/**
 * Returns the symbol for a given currency code
 * @param {string} currencyCode 
 * @returns {string} Currency symbol
 */
export function getCurrencySymbol(currencyCode = DEFAULT_CURRENCY) {
  const currencyObj = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode);
  return currencyObj ? currencyObj.symbol : '₦';
}
