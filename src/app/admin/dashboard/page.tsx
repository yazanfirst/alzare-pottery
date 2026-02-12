'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Plus, Edit, Trash2, Tag, LogOut } from 'lucide-react';
import { Product, Coupon } from '@/types';
import { formatPrice, generateId } from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    // Simple client-side check
    const token = document.cookie.split('; ').find(row => row.startsWith('admin_token='));
    if (!token) {
      router.push('/admin/login');
    }
  };

  const loadData = async () => {
    try {
      const [productsRes, couponsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/coupons')
      ]);
      
      const productsData = await productsRes.json();
      const couponsData = await couponsRes.json();
      
      setProducts(productsData.products || []);
      setCoupons(couponsData.coupons || []);
    } catch (error) {
      console.error('Error loading data:', error);
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

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    
    try {
      await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      loadData();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="spinner h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-amber-500">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-amber-600 mt-1">Al Zare' Pottery Management</p>
            </div>
            <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-amber-100'
            }`}
          >
            <Package size={20} />
            <span>Products ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'coupons'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-amber-100'
            }`}
          >
            <Tag size={20} />
            <span>Coupons ({coupons.length})</span>
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-lg"
              >
                <Plus size={20} />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 relative">
                    <img
                      src={product.images[0]}
                      alt={product.name.en}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/400x400/FED7AA/D97706?text=${encodeURIComponent(product.name.en)}`;
                      }}
                    />
                    {product.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name.en}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.name.ar}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-amber-600">
                        {formatPrice(product.price, 'en')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowProductForm(true);
                        }}
                        className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        <Edit size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Coupons</h2>
              <div className="space-y-4">
                {coupons.map(coupon => (
                  <div key={coupon.id} className="border-2 border-amber-200 rounded-lg p-6 hover:border-amber-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-amber-600">{coupon.code}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            coupon.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {coupon.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="mt-2 text-gray-600">
                          {coupon.discountType === 'percentage' 
                            ? `${coupon.discountValue}% off`
                            : `${coupon.discountValue} AED off`
                          }
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Used: {coupon.usageCount} / {coupon.usageLimit}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
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
