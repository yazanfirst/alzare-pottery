'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Plus, Edit, Trash2, Tag, LogOut, X } from 'lucide-react';
import { Product, Coupon } from '@/types';
import { formatPrice, generateId } from '@/lib/utils';

interface ProductFormState {
  sku: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  tags: string;
  price: string;
  stock: string;
  images: string;
  featured: boolean;
}

interface CouponFormState {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
  active: boolean;
}

const emptyProductForm: ProductFormState = {
  sku: '',
  nameEn: '',
  nameAr: '',
  descriptionEn: '',
  descriptionAr: '',
  category: 'Planters',
  tags: '',
  price: '0',
  stock: '0',
  images: '',
  featured: false,
};

const emptyCouponForm: CouponFormState = {
  code: '',
  discountType: 'percentage',
  discountValue: '10',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
  usageLimit: '100',
  active: true,
};

export default function AdminDashboard() {
  const router = useRouter();
  const isAdminEnabled = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ENABLE_ADMIN_IN_PRODUCTION === 'true';
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [loading, setLoading] = useState(true);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>(emptyProductForm);

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState<CouponFormState>(emptyCouponForm);

  useEffect(() => {
    if (!isAdminEnabled) {
      router.replace('/en');
      return;
    }

    initializeDashboard();
  }, [isAdminEnabled, router]);

  const initializeDashboard = async () => {
    const authenticated = await checkAuth();
    if (!authenticated) {
      setLoading(false);
      return;
    }

    await loadData();
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await response.json();

      if (!response.ok || !data.authenticated) {
        router.push('/admin/login');
        return false;
      }

      return true;
    } catch {
      router.push('/admin/login');
      return false;
    }
  };

  const loadData = async () => {
    try {
      const [productsRes, couponsRes] = await Promise.all([
        fetch('/api/products', { credentials: 'include', cache: 'no-store' }),
        fetch('/api/coupons', { credentials: 'include', cache: 'no-store' }),
      ]);

      if (!productsRes.ok || !couponsRes.ok) {
        throw new Error('Unauthorized or failed to load data');
      }

      const productsData = await productsRes.json();
      const couponsData = await couponsRes.json();

      setProducts(productsData.products || []);
      setCoupons(couponsData.coupons || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Could not load admin data. Please login again.');
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    router.push('/en');
  };

  const openCreateProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setShowProductForm(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      sku: product.sku,
      nameEn: product.name.en,
      nameAr: product.name.ar,
      descriptionEn: product.description.en,
      descriptionAr: product.description.ar,
      category: product.category,
      tags: product.tags.join(', '),
      price: String(product.price),
      stock: String(product.stock),
      images: product.images.join(', '),
      featured: product.featured,
    });
    setShowProductForm(true);
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const dataUrls = await Promise.all(
      files.map(
        file =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(file);
          })
      )
    );

    const existing = productForm.images
      .split(',')
      .map(img => img.trim())
      .filter(Boolean);

    setProductForm(prev => ({
      ...prev,
      images: [...existing, ...dataUrls].join(', '),
    }));

    e.target.value = '';
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Product = {
      id: editingProduct?.id || generateId('product'),
      sku: productForm.sku.trim() || `SKU-${Date.now()}`,
      name: {
        en: productForm.nameEn.trim(),
        ar: productForm.nameAr.trim(),
      },
      description: {
        en: productForm.descriptionEn.trim(),
        ar: productForm.descriptionAr.trim(),
      },
      category: productForm.category.trim() || 'Planters',
      tags: productForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      images: productForm.images
        .split(',')
        .map(img => img.trim())
        .filter(Boolean),
      featured: productForm.featured,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!payload.images.length) {
      payload.images = ['https://placehold.co/600x600/FED7AA/D97706?text=Plant+Pot'];
    }

    if (!payload.name.en || !payload.name.ar || !payload.description.en || !payload.description.ar) {
      alert('Please fill all required product fields.');
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm(emptyProductForm);
      await loadData();
    } catch (error) {
      console.error(error);
      alert('Failed to save product');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;

    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      await loadData();
    } catch (error) {
      console.error(error);
      alert('Failed to delete product');
    }
  };

  const openCreateCoupon = () => {
    setEditingCoupon(null);
    setCouponForm(emptyCouponForm);
    setShowCouponForm(true);
  };

  const openEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      startDate: coupon.startDate.slice(0, 10),
      endDate: coupon.endDate.slice(0, 10),
      usageLimit: String(coupon.usageLimit),
      active: coupon.active,
    });
    setShowCouponForm(true);
  };

  const submitCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Coupon = {
      id: editingCoupon?.id || generateId('coupon'),
      code: couponForm.code.trim().toUpperCase(),
      discountType: couponForm.discountType,
      discountValue: Number(couponForm.discountValue),
      startDate: new Date(couponForm.startDate).toISOString(),
      endDate: new Date(couponForm.endDate).toISOString(),
      usageLimit: Number(couponForm.usageLimit),
      usageCount: editingCoupon?.usageCount || 0,
      active: couponForm.active,
      createdAt: editingCoupon?.createdAt || new Date().toISOString(),
    };

    if (!payload.code) {
      alert('Coupon code is required.');
      return;
    }

    try {
      const response = await fetch('/api/coupons', {
        method: editingCoupon ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save coupon');
      }

      setShowCouponForm(false);
      setEditingCoupon(null);
      setCouponForm(emptyCouponForm);
      await loadData();
    } catch (error) {
      console.error(error);
      alert('Failed to save coupon');
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;

    try {
      const response = await fetch('/api/coupons', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete coupon');
      }

      await loadData();
    } catch (error) {
      console.error(error);
      alert('Failed to delete coupon');
    }
  };

  if (!isAdminEnabled) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="spinner h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <header className="bg-white shadow-lg border-b-4 border-amber-500">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-amber-600 mt-1">Al Zare&apos; Pottery Management</p>
            </div>
            <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'products' ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-amber-100'
            }`}
          >
            <Package size={20} />
            <span>Products ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'coupons' ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-amber-100'
            }`}
          >
            <Tag size={20} />
            <span>Coupons ({coupons.length})</span>
          </button>
        </div>

        {activeTab === 'products' && (
          <div>
            <div className="mb-6">
              <button
                onClick={openCreateProduct}
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-lg"
              >
                <Plus size={20} />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 relative">
                    <img
                      src={product.images[0]}
                      alt={product.name.en}
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.currentTarget.src = `https://placehold.co/400x400/FED7AA/D97706?text=${encodeURIComponent(product.name.en)}`;
                      }}
                    />
                    {product.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">Featured</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name.en}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.name.ar}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-amber-600">{formatPrice(product.price, 'en')}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditProduct(product)}
                        className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        <Edit size={16} />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div>
            <div className="mb-6">
              <button
                onClick={openCreateCoupon}
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-lg"
              >
                <Plus size={20} />
                <span>Create Coupon</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Coupons</h2>
              <div className="space-y-4">
                {coupons.map(coupon => (
                  <div key={coupon.id} className="border-2 border-amber-200 rounded-lg p-6 hover:border-amber-400 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-amber-600">{coupon.code}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${coupon.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {coupon.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="mt-2 text-gray-600">{coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `${coupon.discountValue} AED off`}</div>
                        <div className="mt-1 text-sm text-gray-500">Used: {coupon.usageCount} / {coupon.usageLimit}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditCoupon(coupon)}
                          className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button onClick={() => deleteCoupon(coupon.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {coupons.length === 0 && <p className="text-gray-500">No coupons yet. Create your first coupon.</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={submitProduct} className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-800">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button type="button" onClick={() => setShowProductForm(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input-field" placeholder="SKU" value={productForm.sku} onChange={e => setProductForm(prev => ({ ...prev, sku: e.target.value }))} />
              <input className="input-field" placeholder="Category" value={productForm.category} onChange={e => setProductForm(prev => ({ ...prev, category: e.target.value }))} required />
              <input className="input-field" placeholder="English Name" value={productForm.nameEn} onChange={e => setProductForm(prev => ({ ...prev, nameEn: e.target.value }))} required />
              <input className="input-field" placeholder="Arabic Name" value={productForm.nameAr} onChange={e => setProductForm(prev => ({ ...prev, nameAr: e.target.value }))} required />
              <input className="input-field" type="number" min="0" step="0.01" placeholder="Price" value={productForm.price} onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))} required />
              <input className="input-field" type="number" min="0" placeholder="Stock" value={productForm.stock} onChange={e => setProductForm(prev => ({ ...prev, stock: e.target.value }))} required />
            </div>

            <textarea className="input-field min-h-[90px]" placeholder="English Description" value={productForm.descriptionEn} onChange={e => setProductForm(prev => ({ ...prev, descriptionEn: e.target.value }))} required />
            <textarea className="input-field min-h-[90px]" placeholder="Arabic Description" value={productForm.descriptionAr} onChange={e => setProductForm(prev => ({ ...prev, descriptionAr: e.target.value }))} required />
            <input className="input-field" placeholder="Tags (comma separated)" value={productForm.tags} onChange={e => setProductForm(prev => ({ ...prev, tags: e.target.value }))} />
            <input className="input-field" placeholder="Image URLs (comma separated)" value={productForm.images} onChange={e => setProductForm(prev => ({ ...prev, images: e.target.value }))} />
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Upload product images (no URL needed)</label>
              <input type="file" accept="image/*" multiple onChange={handleProductImageUpload} className="input-field" />
            </div>
            {productForm.images && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {productForm.images
                  .split(',')
                  .map(img => img.trim())
                  .filter(Boolean)
                  .slice(0, 5)
                  .map((img, idx) => (
                    <img key={idx} src={img} alt={`Preview ${idx + 1}`} className="h-20 w-full object-cover rounded-lg border" />
                  ))}
              </div>
            )}

            <label className="flex items-center gap-2 text-gray-700">
              <input type="checkbox" checked={productForm.featured} onChange={e => setProductForm(prev => ({ ...prev, featured: e.target.checked }))} />
              Featured product
            </label>

            <div className="flex justify-end gap-3">
              <button type="button" className="px-4 py-2 rounded-lg border" onClick={() => setShowProductForm(false)}>
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {showCouponForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={submitCoupon} className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-800">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button type="button" onClick={() => setShowCouponForm(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input-field" placeholder="Coupon Code" value={couponForm.code} onChange={e => setCouponForm(prev => ({ ...prev, code: e.target.value }))} required />
              <select className="input-field" value={couponForm.discountType} onChange={e => setCouponForm(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'fixed' }))}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <input className="input-field" type="number" min="0" step="0.01" placeholder="Discount Value" value={couponForm.discountValue} onChange={e => setCouponForm(prev => ({ ...prev, discountValue: e.target.value }))} required />
              <input className="input-field" type="number" min="1" placeholder="Usage Limit" value={couponForm.usageLimit} onChange={e => setCouponForm(prev => ({ ...prev, usageLimit: e.target.value }))} required />
              <input className="input-field" type="date" value={couponForm.startDate} onChange={e => setCouponForm(prev => ({ ...prev, startDate: e.target.value }))} required />
              <input className="input-field" type="date" value={couponForm.endDate} onChange={e => setCouponForm(prev => ({ ...prev, endDate: e.target.value }))} required />
            </div>

            <label className="flex items-center gap-2 text-gray-700">
              <input type="checkbox" checked={couponForm.active} onChange={e => setCouponForm(prev => ({ ...prev, active: e.target.checked }))} />
              Active
            </label>

            <div className="flex justify-end gap-3">
              <button type="button" className="px-4 py-2 rounded-lg border" onClick={() => setShowCouponForm(false)}>
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600">
                {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="container-custom pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-xl">
            <div className="text-sm font-semibold mb-2">Total Products</div>
            <div className="text-4xl font-bold">{products.length}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-xl">
            <div className="text-sm font-semibold mb-2">In Stock</div>
            <div className="text-4xl font-bold">{products.filter(p => p.stock > 0).length}</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-xl">
            <div className="text-sm font-semibold mb-2">Active Coupons</div>
            <div className="text-4xl font-bold">{coupons.filter(c => c.active).length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
