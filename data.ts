import fs from 'fs';
import path from 'path';
import { Product, Coupon } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const COUPONS_FILE = path.join(DATA_DIR, 'coupons.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Products
export function getProducts(): Product[] {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.products || [];
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

export function getProductById(id: string): Product | null {
  const products = getProducts();
  return products.find(p => p.id === id) || null;
}

export function saveProducts(products: Product[]): void {
  try {
    const data = JSON.stringify({ products }, null, 2);
    fs.writeFileSync(PRODUCTS_FILE, data, 'utf-8');
  } catch (error) {
    console.error('Error saving products:', error);
    throw new Error('Failed to save products');
  }
}

export function addProduct(product: Product): void {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
}

export function updateProduct(id: string, updates: Partial<Product>): void {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Product not found');
  
  products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
  saveProducts(products);
}

export function deleteProduct(id: string): void {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
}

// Coupons
export function getCoupons(): Coupon[] {
  try {
    const data = fs.readFileSync(COUPONS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.coupons || [];
  } catch (error) {
    console.error('Error reading coupons:', error);
    return [];
  }
}

export function getCouponByCode(code: string): Coupon | null {
  const coupons = getCoupons();
  return coupons.find(c => c.code.toLowerCase() === code.toLowerCase()) || null;
}

export function saveCoupons(coupons: Coupon[]): void {
  try {
    const data = JSON.stringify({ coupons }, null, 2);
    fs.writeFileSync(COUPONS_FILE, data, 'utf-8');
  } catch (error) {
    console.error('Error saving coupons:', error);
    throw new Error('Failed to save coupons');
  }
}

export function addCoupon(coupon: Coupon): void {
  const coupons = getCoupons();
  coupons.push(coupon);
  saveCoupons(coupons);
}

export function updateCoupon(id: string, updates: Partial<Coupon>): void {
  const coupons = getCoupons();
  const index = coupons.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Coupon not found');
  
  coupons[index] = { ...coupons[index], ...updates };
  saveCoupons(coupons);
}

export function deleteCoupon(id: string): void {
  const coupons = getCoupons();
  const filtered = coupons.filter(c => c.id !== id);
  saveCoupons(filtered);
}

export function incrementCouponUsage(code: string): void {
  const coupons = getCoupons();
  const index = coupons.findIndex(c => c.code.toLowerCase() === code.toLowerCase());
  if (index === -1) throw new Error('Coupon not found');
  
  coupons[index].usageCount += 1;
  saveCoupons(coupons);
}
