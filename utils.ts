import { Language } from '@/types';

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    products: 'Products',
    cart: 'Cart',
    checkout: 'Checkout',
    admin: 'Admin',
    
    // Home page
    heroTitle: 'Handcrafted Pottery',
    heroSubtitle: 'Traditional Emirati Clay Artistry',
    heroButton: 'Shop Collection',
    featuredProducts: 'Featured Products',
    shopNow: 'Shop Now',
    viewAll: 'View All Products',
    
    // Products
    categories: 'Categories',
    priceRange: 'Price Range',
    search: 'Search products...',
    noProducts: 'No products found',
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    stock: 'Stock',
    sku: 'SKU',
    category: 'Category',
    tags: 'Tags',
    
    // Cart
    cartEmpty: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    cartTotal: 'Cart Total',
    subtotal: 'Subtotal',
    discount: 'Discount',
    total: 'Total',
    applyCoupon: 'Apply Coupon',
    couponCode: 'Coupon Code',
    apply: 'Apply',
    remove: 'Remove',
    proceedToCheckout: 'Proceed to Checkout',
    
    // Checkout
    customerInfo: 'Customer Information',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    deliveryAddress: 'Delivery Address',
    orderSummary: 'Order Summary',
    placeOrder: 'Place Order',
    sendViaWhatsApp: 'Send via WhatsApp',
    
    // Common
    aed: 'AED',
    quantity: 'Quantity',
    price: 'Price',
    description: 'Description',
    close: 'Close',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    products: 'المنتجات',
    cart: 'السلة',
    checkout: 'الدفع',
    admin: 'الإدارة',
    
    // Home page
    heroTitle: 'فخار مصنوع يدوياً',
    heroSubtitle: 'فن الطين الإماراتي التقليدي',
    heroButton: 'تسوق المجموعة',
    featuredProducts: 'المنتجات المميزة',
    shopNow: 'تسوق الآن',
    viewAll: 'عرض جميع المنتجات',
    
    // Products
    categories: 'الفئات',
    priceRange: 'نطاق السعر',
    search: 'البحث عن المنتجات...',
    noProducts: 'لم يتم العثور على منتجات',
    addToCart: 'أضف إلى السلة',
    outOfStock: 'غير متوفر',
    inStock: 'متوفر',
    stock: 'المخزون',
    sku: 'رمز المنتج',
    category: 'الفئة',
    tags: 'الوسوم',
    
    // Cart
    cartEmpty: 'سلتك فارغة',
    continueShopping: 'متابعة التسوق',
    cartTotal: 'إجمالي السلة',
    subtotal: 'المجموع الفرعي',
    discount: 'الخصم',
    total: 'الإجمالي',
    applyCoupon: 'تطبيق القسيمة',
    couponCode: 'رمز القسيمة',
    apply: 'تطبيق',
    remove: 'إزالة',
    proceedToCheckout: 'متابعة إلى الدفع',
    
    // Checkout
    customerInfo: 'معلومات العميل',
    fullName: 'الاسم الكامل',
    phoneNumber: 'رقم الهاتف',
    deliveryAddress: 'عنوان التسليم',
    orderSummary: 'ملخص الطلب',
    placeOrder: 'تأكيد الطلب',
    sendViaWhatsApp: 'إرسال عبر واتساب',
    
    // Common
    aed: 'درهم',
    quantity: 'الكمية',
    price: 'السعر',
    description: 'الوصف',
    close: 'إغلاق',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    loading: 'جاري التحميل...',
  },
};

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}

export function formatPrice(amount: number, lang: Language = 'en'): string {
  const formatted = amount.toFixed(2);
  return lang === 'ar' ? `${formatted} درهم` : `AED ${formatted}`;
}

export function generateId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}
