export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface FilterOptions {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sort?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SalonBookingForm {
  serviceId: string;
  date: Date;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

export interface CheckoutForm {
  email: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
}
