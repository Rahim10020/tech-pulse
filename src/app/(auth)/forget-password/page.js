// pages/forgot-password.js - Page mot de passe oublié
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'envoi de l'email de réinitialisation
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm">TP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TechPulse</span>
          </Link>
          
          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900">Home</Link>
            <Link href="/articles" className="text-gray-700 hover:text-gray-900">Articles</Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">About</Link>
            <Link href="/login" className="text-gray-700 hover:text-gray-900">Sign In</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto pt-24 px-6">
        {!isSubmitted ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h1>
              <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Send reset link
              </button>

              <div className="text-center">
                <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
                  ← Back to login
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Check your email</h1>
            <p className="text-gray-600 mb-8">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link 
              href="/login"
              className="inline-block bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
