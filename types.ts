
export interface Game {
  id: string;
  name: string;
  developer: string;
  image: string;
  currencyName: string;
  primaryColor: string;
  category: string;
  packages?: Package[];
}

export interface Package {
  id: string;
  name?: string; // e.g., "Battle Pass"
  amount: number;
  bonus: number;
  price: number;
  currency: string;
  popular?: boolean;
}

export interface CartItem {
  gameId: string;
  packageId: string;
  gameName: string;
  amount: number;
  price: number;
  currency: string;
  quantity: number;
  recipientId?: string;
  package_name?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  isAdmin?: boolean;
}

export interface Order {
  id: string;
  date: string;
  timestampRaw: number; // Added for sorting/time-ago logic
  gameName: string;
  amount: string;
  price: number;
  status: 'Completed' | 'Pending' | 'Failed';
  paymentMethod: string;
  userName: string;
  location: string;
  mapLink?: string; // Admin-only tracking link
}

export interface Review {
  id: string;
  gameId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export type PaymentMethod = 'credit_card' | 'paypal' | 'mpesa' | 'google_pay' | 'apple_pay';
