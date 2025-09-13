import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-white to-blue-50 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#627EEA]/10 to-[#00B774]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#FFB800]/10 to-[#8B4513]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        <div>
          {/* Error illustration */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-[#627EEA] to-[#00B774] rounded-full flex items-center justify-center">
              <Search className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4 page-heading">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved to a different location.
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <Link to="/" className="block">
              <Button className="w-full bg-[#627EEA] hover:bg-[#4C63D2] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium">
                <Home className="h-5 w-5" />
                Go to Homepage
              </Button>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </button>
          </div>

          {/* Help text */}
          <p className="text-sm text-gray-500 mt-8">
            Need help? <Link to="/" className="text-[#627EEA] hover:underline">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}