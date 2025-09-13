/**
 * Public Site Hero Section
 * Landing page hero with glassmorphism design
 */

import React from 'react';
import { ArrowRight, TrendingUp, Shield, Users } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#F5E6D3] via-white to-blue-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#627EEA]/10 to-[#00B774]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#FFB800]/10 to-[#8B4513]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-gray-700">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Regulatory-Compliant Tokenization Platform
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Cycles of{' '}
                <span className="bg-gradient-to-r from-[#627EEA] to-[#00B774] bg-clip-text text-transparent">
                  Wealth
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Bridge traditional finance and blockchain technology through wise, patient wealth building. 
                Tokenize companies, manage investments, and grow wealth through market cycles.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="px-6 py-3 bg-[#627EEA] hover:bg-[#4C63D2] text-white rounded-lg justify-center sm:justify-start flex items-center gap-2 font-medium"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg justify-center sm:justify-start flex items-center font-medium"
              >
                Learn More
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-600" />
                SEC Compliant
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4 text-blue-600" />
                1000+ Investors
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                $50M+ Tokenized
              </div>
            </div>
          </div>

          {/* Right column - Interactive Demo */}
          <div className="relative">
            {/* Main dashboard preview */}
            <div className="p-6 bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-[#627EEA] to-[#00B774] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      🐄
                    </div>
                    <h3 className="text-lg font-semibold">Portfolio Overview</h3>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <div className="h-2 w-2 bg-amber-500 rounded-full" />
                    <div className="h-2 w-2 bg-red-500 rounded-full" />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="text-2xl font-bold text-green-600">$127,500</p>
                    <p className="text-xs text-green-600">+12.5%</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-sm text-gray-500">Active Tokens</p>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-xs text-gray-500">Companies</p>
                  </div>
                </div>

                {/* Token list */}
                <div className="space-y-2">
                  {[
                    { name: 'TechCorp Token', symbol: 'TECH', value: '$45,000', change: '+8.2%', network: 'ethereum' },
                    { name: 'GreenEnergy Co', symbol: 'GREEN', value: '$32,000', change: '+15.1%', network: 'polygon' },
                    { name: 'FinTech Solutions', symbol: 'FIN', value: '$28,500', change: '+6.7%', network: 'solana' },
                  ].map((token, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-full ${
                          token.network === 'ethereum' ? 'bg-[#627EEA]' :
                          token.network === 'polygon' ? 'bg-[#8247E5]' :
                          'bg-[#9945FF]'
                        }`} />
                        <div>
                          <p className="text-sm font-medium">{token.symbol}</p>
                          <p className="text-xs text-gray-500">{token.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{token.value}</p>
                        <p className="text-xs text-green-600">{token.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div 
              className="absolute -top-4 -left-4 p-4 bg-white/20 backdrop-blur-sm border border-white/10 rounded-lg shadow-md transform -rotate-6 hover:rotate-0 transition-transform duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  📈
                </div>
                <div>
                  <p className="text-sm font-bold">Monthly Growth</p>
                  <p className="text-xs text-green-600">+24.7%</p>
                </div>
              </div>
            </div>

            <div 
              className="absolute -bottom-4 -right-4 p-4 bg-white/20 backdrop-blur-sm border border-white/10 rounded-lg shadow-md transform rotate-6 hover:rotate-0 transition-transform duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  🛡️
                </div>
                <div>
                  <p className="text-sm font-bold">Compliance</p>
                  <p className="text-xs text-blue-600">100% Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
