'use client';

import { useState } from 'react';

export default function BetaSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    // For now, just log it (we'll add email service later)
    console.log('Beta signup:', { name, email, timestamp: new Date().toISOString() });
    
    // Store in localStorage for now
    const signups = JSON.parse(localStorage.getItem('beta_signups') || '[]');
    signups.push({ name, email, timestamp: new Date().toISOString() });
    localStorage.setItem('beta_signups', JSON.stringify(signups));

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0A1628] via-[#0F2642] to-[#0A1628] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-fadeIn">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-white">You're In!</h1>
          <p className="text-gray-300 text-lg">
            Check your email for access instructions.
          </p>
          <p className="text-gray-400 text-sm">
            Welcome to the first 500 traders using TX.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-8 px-6 py-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0A1628] via-[#0F2642] to-[#0A1628] flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Be Among the First{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500">
              500 Traders
            </span>
            <br />
            to Try TX.
          </h1>
          <p className="text-gray-400 text-lg">
            Spots are limited. Join the beta today.
          </p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-8 md:p-12 max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-6 py-4 bg-black/50 border-2 border-cyan-500/50 rounded-xl text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="w-full px-6 py-4 bg-black/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-linear-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Reserving...' : 'Reserve My Spot'}
            </button>

            {/* Privacy Note */}
            <p className="text-center text-gray-500 text-sm">
              Limited beta access • No spam, ever
            </p>
          </form>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 text-center pt-4">
          <div>
            <div className="text-2xl font-bold text-cyan-400">87%</div>
            <div className="text-sm text-gray-500">Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">24/7</div>
            <div className="text-sm text-gray-500">Monitoring</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-400">Real-time</div>
            <div className="text-sm text-gray-500">Alerts</div>
          </div>
        </div>
      </div>
    </div>
  );
}