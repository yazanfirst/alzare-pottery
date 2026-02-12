'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-amber-400 rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-400 rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-4 shadow-pottery-lg">
            <Lock size={36} className="text-white" />
          </div>
          <h1 className="text-4xl font-black mb-2">
            <span className="gradient-text">Admin Portal</span>
          </h1>
          <p className="text-gray-600 font-medium">Al Zare' Pottery Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-pottery-lg p-8 border border-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                <Sparkles size={16} className="text-amber-500" />
                <span>Admin Password</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field text-lg"
                placeholder="Enter your secret password"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 text-red-700 px-5 py-4 rounded-xl font-medium shadow-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="spinner h-5 w-5"></div>
                  <span>Logging in...</span>
                </span>
              ) : (
                'Unlock Dashboard'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <a href="/en" className="text-amber-600 hover:text-amber-700 font-semibold hover:underline">
              ← Back to Website
            </a>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="bg-white bg-opacity-60 backdrop-blur-sm rounded-xl px-4 py-3 inline-block">
            🔒 Secured with JWT Authentication
          </p>
        </div>
      </div>
    </div>
  );
}
