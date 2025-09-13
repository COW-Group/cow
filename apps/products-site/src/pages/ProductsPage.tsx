import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Coins, 
  BarChart3,
  DollarSign,
  Users,
  Activity,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import type { Product } from '@/types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Manhattan Premium Real Estate',
    symbol: 'MPR',
    description: 'Tokenized luxury real estate portfolio in Manhattan featuring Class A commercial and residential properties',
    type: 'real-estate',
    currentPrice: 125.50,
    priceChange24h: 2.35,
    priceChangePercent24h: 1.91,
    marketCap: 45000000,
    volume24h: 890000,
    totalSupply: 1000000,
    circulatingSupply: 358400,
    imageUrl: '/assets/manhattan-real-estate.jpg',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Gold Reserve Commodity',
    symbol: 'GRC',
    description: 'Physical gold reserves backed by certified bullion stored in secure vaults worldwide',
    type: 'commodities',
    currentPrice: 89.25,
    priceChange24h: 4.12,
    priceChangePercent24h: 4.84,
    marketCap: 28500000,
    volume24h: 1200000,
    totalSupply: 500000,
    circulatingSupply: 319400,
    imageUrl: '/assets/gold-commodity.jpg',
    isActive: true,
    createdAt: '2024-02-10T00:00:00Z'
  },
  {
    id: '3',
    name: 'Tech Giants Index',
    symbol: 'TGI',
    description: 'Diversified portfolio of leading technology companies with strong growth potential',
    type: 'stocks',
    currentPrice: 256.80,
    priceChange24h: -8.45,
    priceChangePercent24h: -3.18,
    marketCap: 75000000,
    volume24h: 2100000,
    totalSupply: 750000,
    circulatingSupply: 292100,
    imageUrl: '/assets/tech-stocks.jpg',
    isActive: true,
    createdAt: '2024-03-05T00:00:00Z'
  },
  {
    id: '4',
    name: 'Green Energy Infrastructure',
    symbol: 'GEI',
    description: 'Renewable energy projects including solar, wind, and hydroelectric power installations',
    type: 'real-estate',
    currentPrice: 67.90,
    priceChange24h: 1.85,
    priceChangePercent24h: 2.80,
    marketCap: 34000000,
    volume24h: 650000,
    totalSupply: 1200000,
    circulatingSupply: 500800,
    imageUrl: '/assets/green-energy.jpg',
    isActive: true,
    createdAt: '2024-04-12T00:00:00Z'
  },
  {
    id: '5',
    name: 'Treasury Bond Portfolio',
    symbol: 'TBP',
    description: 'Diversified US Treasury bonds with varying maturities for stable income generation',
    type: 'bonds',
    currentPrice: 102.15,
    priceChange24h: 0.45,
    priceChangePercent24h: 0.44,
    marketCap: 15000000,
    volume24h: 320000,
    totalSupply: 300000,
    circulatingSupply: 146900,
    imageUrl: '/assets/treasury-bonds.jpg',
    isActive: true,
    createdAt: '2024-05-20T00:00:00Z'
  },
  {
    id: '6',
    name: 'Silver Precious Metal',
    symbol: 'SPM',
    description: 'Physical silver reserves with industrial and investment-grade metals',
    type: 'commodities',
    currentPrice: 34.75,
    priceChange24h: -0.85,
    priceChangePercent24h: -2.39,
    marketCap: 12000000,
    volume24h: 180000,
    totalSupply: 800000,
    circulatingSupply: 345300,
    imageUrl: '/assets/silver-metal.jpg',
    isActive: true,
    createdAt: '2024-06-15T00:00:00Z'
  }
];

const typeColors = {
  'real-estate': 'from-blue-500 to-blue-600',
  'commodities': 'from-yellow-500 to-yellow-600',
  'stocks': 'from-green-500 to-green-600',
  'bonds': 'from-purple-500 to-purple-600'
};

const typeIcons = {
  'real-estate': <Building2 className="h-5 w-5" />,
  'commodities': <Coins className="h-5 w-5" />,
  'stocks': <BarChart3 className="h-5 w-5" />,
  'bonds': <Activity className="h-5 w-5" />
};

export default function ProductsPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change' | 'volume'>('name');

  const filteredProducts = mockProducts.filter(product => {
    if (selectedType !== 'all' && product.type !== selectedType) return false;
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !product.symbol.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return product.isActive;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.currentPrice - a.currentPrice;
      case 'change':
        return b.priceChangePercent24h - a.priceChangePercent24h;
      case 'volume':
        return b.volume24h - a.volume24h;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const totalMarketCap = mockProducts.reduce((sum, product) => sum + product.marketCap, 0);
  const avgChange = mockProducts.reduce((sum, product) => sum + product.priceChangePercent24h, 0) / mockProducts.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass rounded-full px-6 py-3 flex items-center gap-6">
          <Link to="/" className="text-xl font-bold font-playfair">
            COW Products
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/products" className="text-sm text-blue-600 font-medium">
              Products
            </Link>
            <Link to="/dashboard" className="text-sm hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link to="/missions" className="text-sm hover:text-blue-600 transition-colors">
              Missions
            </Link>
          </div>
        </div>
      </nav>

      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#627EEA]/10 to-[#00B774]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#FFB800]/10 to-[#8B4513]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 page-heading text-gray-900">
              Performance Real-World Asset Tokens
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl">
              Discover and invest in tokenized real-world assets with transparent performance tracking and institutional-grade security
            </p>
          </div>

          {/* Market Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-600">Total Market Cap</h3>
                  <DollarSign className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMarketCap)}</p>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-600">Active Products</h3>
                  <BarChart3 className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{mockProducts.length}</p>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-600">Average 24h Change</h3>
                  {avgChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className={`text-2xl font-bold ${avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(avgChange)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-600">Total Investors</h3>
                  <Users className="h-4 w-4 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">12,547</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="flex gap-2">
              {['all', 'real-estate', 'commodities', 'stocks', 'bonds'].map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className={`capitalize ${
                    selectedType === type 
                      ? 'bg-blue-600 text-white' 
                      : 'border-gray-300 text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {type === 'real-estate' ? 'Real Estate' : type}
                </Button>
              ))}
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 glass rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="change">Sort by Change</option>
              <option value="volume">Sort by Volume</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid gap-6">
            {filteredProducts.map((product, index) => (
              <div key={product.id}>
                <Card className="glass hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${typeColors[product.type]}`}>
                          <div className="text-white">
                            {typeIcons[product.type]}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                              {product.symbol}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${typeColors[product.type]} text-white`}>
                              {product.type.replace('-', ' ')}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm max-w-md">{product.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 mb-1">
                          {formatCurrency(product.currentPrice)}
                        </p>
                        <div className="flex items-center justify-end">
                          {product.priceChangePercent24h >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                          )}
                          <span
                            className={`text-sm font-semibold ${
                              product.priceChangePercent24h >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {formatPercentage(product.priceChangePercent24h)}
                          </span>
                          <span className="text-gray-500 text-sm ml-2">
                            ({product.priceChangePercent24h >= 0 ? '+' : ''}{formatCurrency(product.priceChange24h)})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-500">Market Cap</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(product.marketCap)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">24h Volume</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(product.volume24h)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Circulating Supply</p>
                        <p className="font-semibold text-gray-900">{product.circulatingSupply.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Supply</p>
                        <p className="font-semibold text-gray-900">{product.totalSupply.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-green-500 rounded-full" />
                          Active
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300 text-gray-600 hover:text-blue-600"
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Invest Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* No products message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to see more products</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}