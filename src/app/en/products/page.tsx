'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
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
      filtered = filtered.filter(p => 
        p.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <Navbar lang="en" />
        <div className="flex-1 flex items-center justify-center">
          <div className="spinner h-12 w-12"></div>
        </div>
        <Footer lang="en" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar lang="en" />
      
      <main className="flex-1 bg-pottery-desert">
        <div className="container-custom py-8">
          <h1 className="text-4xl font-bold text-pottery-earth mb-8">Our Products</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <div className="flex items-center space-x-2 mb-6">
                  <SlidersHorizontal size={20} className="text-pottery-clay" />
                  <h2 className="text-xl font-bold text-pottery-earth">Filters</h2>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-pottery-earth mb-2">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pr-10"
                    />
                    <Search className="absolute right-3 top-3 text-pottery-clay" size={18} />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-pottery-earth mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-pottery-earth mb-2">
                    Price Range: AED {priceRange[0]} - {priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
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
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4 text-pottery-earth">
                <span className="font-medium">{filteredProducts.length}</span> products found
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center">
                  <p className="text-pottery-earth text-lg">No products found matching your filters.</p>
                </div>
              ) : (
                <div className="product-grid">
                  {filteredProducts.map(product => (
                    <Link 
                      key={product.id} 
                      href={`/en/products/${product.id}`}
                      className="card group hover:shadow-2xl transition-shadow duration-300"
                    >
                      <div className="aspect-square bg-pottery-sand relative overflow-hidden">
                        <img 
                          src={product.images[0]} 
                          alt={product.name.en}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/400x400/E8DCC4/8B6F47?text=${encodeURIComponent(product.name.en)}`;
                          }}
                        />
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="badge badge-danger text-lg">Out of Stock</span>
                          </div>
                        )}
                        {product.featured && (
                          <div className="absolute top-2 left-2">
                            <span className="badge bg-pottery-terracotta text-white">Featured</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="text-xs text-pottery-clay mb-1">{product.category}</div>
                        <h3 className="text-xl font-semibold text-pottery-earth mb-2 group-hover:text-pottery-clay">
                          {product.name.en}
                        </h3>
                        <p className="text-pottery-earth text-sm mb-4 line-clamp-2">
                          {product.description.en}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="price-tag">{formatPrice(product.price, 'en')}</span>
                          {product.stock > 0 && product.stock < 10 && (
                            <span className="text-xs text-orange-600">Only {product.stock} left</span>
                          )}
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

      <Footer lang="en" />
    </div>
  );
}
