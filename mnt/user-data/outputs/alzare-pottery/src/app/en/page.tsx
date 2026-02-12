import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProducts } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const products = getProducts();
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar lang="en" />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[700px] bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 flex items-center overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-96 h-96 bg-amber-400 rounded-full blur-3xl opacity-20 animate-float"></div>
            <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-orange-400 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-400 rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="container-custom relative z-10 py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 bg-white bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full mb-6 shadow-lg">
                <Sparkles size={20} className="text-amber-500" />
                <span className="text-amber-600 font-bold">Authentic Emirati Craftsmanship</span>
              </div>
              
              <h1 className="text-7xl font-black mb-6 leading-tight">
                <span className="block text-gray-800">Handcrafted</span>
                <span className="block gradient-text">Pottery</span>
                <span className="block text-gray-700">Excellence</span>
              </h1>
              
              <p className="text-2xl text-gray-700 mb-10 leading-relaxed font-medium">
                Traditional Emirati clay artistry meets modern design. Each piece tells a story of heritage and craftsmanship.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/en/products" className="btn-primary inline-flex items-center space-x-3 text-xl">
                  <span>Shop Collection</span>
                  <ArrowRight size={24} />
                </Link>
                <Link href="/en/products" className="btn-outline inline-flex items-center space-x-3 text-xl">
                  <Star size={24} />
                  <span>View Featured</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-2 rounded-full mb-4">
                <Sparkles size={18} className="text-amber-600" />
                <span className="text-amber-700 font-bold">Handpicked Collection</span>
              </div>
              <h2 className="text-5xl font-black text-gray-800 mb-4">Featured Products</h2>
              <p className="text-gray-600 text-xl">Discover our most popular pottery pieces</p>
            </div>

            <div className="product-grid">
              {featuredProducts.map(product => (
                <Link 
                  key={product.id} 
                  href={`/en/products/${product.id}`}
                  className="card hover-lift"
                >
                  <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 relative overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.name.en}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/400x400/FED7AA/F59E0B?text=${encodeURIComponent(product.name.en)}`;
                      }}
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="badge badge-danger text-lg">Out of Stock</span>
                      </div>
                    )}
                    {product.featured && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center space-x-1">
                          <Star size={16} fill="white" />
                          <span>Featured</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-amber-600">
                      {product.name.en}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                      {product.description.en}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="price-tag">{formatPrice(product.price, 'en')}</span>
                      <span className="text-sm text-amber-600 font-bold group-hover:underline flex items-center space-x-1">
                        <span>View Details</span>
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link href="/en/products" className="btn-outline inline-flex items-center space-x-3 text-lg">
                <span>View All Products</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-gray-800 mb-4">Shop by Category</h2>
              <p className="text-gray-600 text-xl">Find the perfect pottery for your needs</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {['Indoor Planters', 'Outdoor Planters', 'Decorative Pots', 'Garden Sets', 'Custom Orders', 'Traditional Clay Pots'].map(category => (
                <Link
                  key={category}
                  href={`/en/products?category=${encodeURIComponent(category)}`}
                  className="bg-white rounded-2xl p-8 text-center hover:shadow-pottery-lg hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-amber-300"
                >
                  <div className="text-amber-600 font-bold text-lg">{category}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-2 rounded-full mb-6">
                <Sparkles size={18} className="text-amber-600" />
                <span className="text-amber-700 font-bold">Our Story</span>
              </div>
              <h2 className="text-5xl font-black text-gray-800 mb-8">Our Craft</h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                At Al Zare' Pottery, we preserve the ancient art of Emirati pottery making. Each piece is handcrafted 
                by skilled artisans using traditional techniques passed down through generations, combined with 
                contemporary design sensibilities.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed">
                From the rich clay of the UAE desert to the final glazed finish, every pot tells a story of 
                dedication, heritage, and artistry.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer lang="en" />
    </div>
  );
}
