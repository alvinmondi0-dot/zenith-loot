
export const EXCHANGE_RATES: Record<string, number> = {
  'USD': 1,
  'KES': 129.50, // Kenyan Shilling
  'GBP': 0.79,   // British Pound
  'EUR': 0.92,   // Euro
  'INR': 83.40,  // Indian Rupee
  'NGN': 1600.00, // Nigerian Naira
  'ZAR': 19.00,   // South African Rand
  'GHS': 12.50    // Ghanaian Cedi
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  'USD': '$',
  'KES': 'KSh ',
  'GBP': '£',
  'EUR': '€',
  'INR': '₹',
  'NGN': '₦',
  'ZAR': 'R ',
  'GHS': 'GH₵ '
};

export const detectUserCurrency = (): string => {
  const locale = navigator.language || 'en-US';
  
  // Simple mapping based on common locale strings
  if (locale.includes('KE')) return 'KES'; // Kenya
  if (locale.includes('GB')) return 'GBP'; // UK
  if (locale.includes('IN')) return 'INR'; // India
  if (locale.includes('NG')) return 'NGN'; // Nigeria
  if (locale.includes('ZA')) return 'ZAR'; // South Africa
  if (locale.includes('GH')) return 'GHS'; // Ghana
  
  // European countries roughly (simplified)
  const euroLocales = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'FI', 'PT', 'GR'];
  if (euroLocales.some(code => locale.toUpperCase().includes(code))) return 'EUR';

  return 'USD'; // Default
};

export const convertPrice = (priceInUSD: number, currencyCode: string): number => {
  const rate = EXCHANGE_RATES[currencyCode] || 1;
  return priceInUSD * rate;
};

export const formatPrice = (price: number, currencyCode: string): string => {
  const symbol = CURRENCY_SYMBOLS[currencyCode] || '$';
  
  // Different formatting for currencies with high integer values
  if (['KES', 'NGN', 'INR', 'JPY', 'RWF', 'TZS', 'UGX'].includes(currencyCode)) {
    return `${symbol}${Math.ceil(price).toLocaleString()}`;
  }
  
  return `${symbol}${price.toFixed(2)}`;
};

/**
 * Calculates the current sports season year.
 * Sports games (eFootball, NBA 2K) usually release the "next year" version
 * around September (Month index 8). 
 * 
 * Logic: 
 * - If Month >= September (8), Season Year is Next Year (e.g., Sept 2024 -> 2025)
 * - Else, Season Year is Current Year.
 */
export const getSportsSeasonYear = (): number => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  // If we are past August (September onwards), we assume the new season has started
  if (currentMonth >= 8) {
    return currentYear + 1;
  }
  return currentYear;
};
