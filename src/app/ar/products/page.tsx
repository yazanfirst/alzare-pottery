'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function ProductsPageAr() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setFilteredProducts(data.products);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        p =>
          p.name.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, priceRange, products]);

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar lang="ar" />
        <div className="flex-1 flex items-center justify-center">
          <div className="spinner h-12 w-12"></div>
        </div>
        <Footer lang="ar" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar lang="ar" />

      <main className="flex-1 bg-pottery-desert">
        <div className="container-custom py-8">
          <h1 className="text-4xl font-bold text-pottery-earth mb-8">منتجاتنا</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <div className="flex items-center space-x-2 space-x-reverse mb-6">
                  <SlidersHorizontal size={20} className="text-pottery-clay" />
                  <h2 className="text-xl font-bold text-pottery-earth">الفلاتر</h2>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-pottery-earth mb-2">بحث</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ابحث في المنتجات..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="input-field pl-10"
                    />
                    <Search className="absolute left-3 top-3 text-pottery-clay" size={18} />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-pottery-earth mb-2">الفئة</label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="">كل الفئات</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-pottery-earth mb-2">
                    نطاق السعر: {formatPrice(priceRange[0], 'ar')} - {formatPrice(priceRange[1], 'ar')}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setPriceRange([0, 1000]);
                  }}
                  className="btn-outline w-full"
                >
                  مسح الفلاتر
                </button>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="mb-4 text-pottery-earth">
                <span className="font-medium">{filteredProducts.length}</span> منتج مطابق
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center">
                  <p className="text-pottery-earth text-lg">لا توجد منتجات مطابقة للفلاتر المحددة.</p>
                </div>
              ) : (
                <div className="product-grid">
                  {filteredProducts.map(product => (
                    <Link
                      key={product.id}
                      href={`/ar/products/${product.id}`}
                      className="card group hover:shadow-2xl transition-shadow duration-300"
                    >
                      <div className="aspect-square bg-pottery-sand relative overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name.ar}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={e => {
                            e.currentTarget.src = `https://placehold.co/400x400/E8DCC4/8B6F47?text=${encodeURIComponent(product.name.ar)}`;
                          }}
                        />
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="badge badge-danger">غير متوفر</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-pottery-earth mb-2 group-hover:text-pottery-clay">
                          {product.name.ar}
                        </h3>
                        <p className="text-pottery-earth text-sm mb-4 line-clamp-2">{product.description.ar}</p>
                        <div className="flex items-center justify-between">
                          <span className="price-tag">{formatPrice(product.price, 'ar')}</span>
                          <span className="text-sm text-pottery-clay font-medium group-hover:underline">عرض التفاصيل</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer lang="ar" />
    </div>
  );
}
