export interface Product {
  id: string;
  sku: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  category: string;
  tags: string[];
  price: number; // in AED
  stock: number;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  active: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  createdAt: string;
}

export type Language = 'en' | 'ar';

export interface PriceGuidance {
  category: string;
  sizeSmall: { min: number; max: number };
  sizeMedium: { min: number; max: number };
  sizeLarge: { min: number; max: number };
}
