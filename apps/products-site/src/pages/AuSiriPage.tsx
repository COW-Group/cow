import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useCart } from "../contexts/cart-context";
import { useAuthContext } from "../lib/auth-context";
import { useWeb3 } from "../contexts/web3-context";
import { ProductMenu } from "../components/product-menu";
import { CartDropdown } from "../components/cart-dropdown";
import { AuthModal } from "../components/auth-modal";
import { Milestones } from "../components/milestones";
import { ArrowLeft, DollarSign, TrendingUp, RefreshCcw, ShoppingBag, Coins } from "lucide-react";

export default function AuSiriPage() {
  const { addToCart } = useCart();
  const { auth, signOut } = useAuthContext();
  const { isConnected, address, connectWallet, disconnectWallet, error, clearError } = useWeb3();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAddToCart = (amount: number) => {
    addToCart({
      id: `ausiri-${Date.now()}`,
      name: `AuSIRI Token (${amount.toLocaleString()})`,
      description: "Pure gold-backed compounding token",
      price: amount,
      link: "/ausiri",
    });
  };

  const handleConnectWallet = async () => {
    try {
      console.log("Attempting to connect wallet");
      await connectWallet();
      console.log("Wallet connected successfully");
    } catch (err: any) {
      console.error("Failed to connect wallet:", err);
      alert(`Failed to connect wallet: ${err.message}`);
    }
  };

  const handleDisconnectWallet = () => {
    try {
      console.log("Disconnecting wallet");
      disconnectWallet();
      console.log("Wallet disconnected successfully");
    } catch (err) {
      console.error("Failed to disconnect wallet:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-6 border border-gray-800">
          <Link to="/" className="text-xl font-bold">
            COW
          </Link>
          <ProductMenu />
          <CartDropdown />
          <div className="flex items-center gap-3">
            {auth.isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                  >
                    Dashboard
                  </Button>
                </Link>
                <button onClick={signOut} className="text-sm text-gray-400 hover:text-white">
                  Sign Out
                </button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In
              </Button>
            )}
            {isConnected ? (
              <>
                <Coins className="h-5 w-5 text-gray-400" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-400">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                  onClick={handleDisconnectWallet}
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                onClick={handleConnectWallet}
              >
                <Coins className="h-5 w-5" />
                <div className="h-2 w-2 rounded-full ml-2 bg-red-500" />
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-900 to-black">
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-yellow-300">AuSIRI</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Pure gold-backed compounding token with retail cycle optimization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-yellow-500 text-black hover:bg-yellow-600"
              onClick={() => handleAddToCart(1000)}
            >
              Pre-order AuSIRI
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-yellow-600 text-yellow-300 hover:bg-yellow-900 bg-transparent"
            >
              View Whitepaper
            </Button>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="pt-20 pb-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tokens
          </Link>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-yellow-400 text-sm uppercase tracking-wider mb-4">OVERVIEW</p>
              <h2 className="text-5xl font-bold mb-6">AuSIRI</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                AuSIRI stands for Gold-backed Systematic Investment Return Initiative - COW's breakthrough in pure gold
                asset tokenization with retail cycle optimization and margin compounding for predictable wealth
                generation.
              </p>
              <p className="text-gray-400 mb-8 leading-relaxed">
                This token represents a revolutionary approach to gold investment, combining the security of physical
                gold backing with sophisticated retail cycle strategies that compound margins through systematic buying
                and selling optimization. Each token is backed by verified gold reserves while generating returns
                through our proprietary market timing algorithms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-yellow-500 text-black hover:bg-yellow-600"
                  onClick={() => handleAddToCart(1000)}
                >
                  Pre-order AuSIRI
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-yellow-600 text-yellow-300 hover:bg-yellow-900 bg-transparent"
                >
                  View Whitepaper
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="w-80 h-80 mx-auto bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 rounded-full flex items-center justify-center border border-yellow-500/50">
                <Coins className="h-32 w-32 text-yellow-400" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-gray-800">
                <h3 className="font-bold mb-2">AuSIRI Token</h3>
                <p className="text-sm text-gray-400 mb-4">Starting at $1,000 minimum</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gold backing:</span>
                    <span>100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expected APY:</span>
                    <span className="text-yellow-400">15-25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Key Features of AuSIRI</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover the power of a truly secure and optimized gold-backed token.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-yellow-400" /> 100% Gold Backed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Every AuSIRI token is fully backed by physical gold, ensuring intrinsic value and stability.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCcw className="h-6 w-6 text-yellow-400" /> Compounding Returns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Benefit from a unique mechanism that compounds returns directly into your token value.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-6 w-6 text-yellow-400" /> Retail Cycle Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Optimized for retail market cycles to maximize growth opportunities.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-yellow-400" /> Stable Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Designed for consistent and predictable growth, minimizing volatility.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">How AuSIRI Works</h2>
          <p className="text-gray-400 text-lg mb-12">
            A simplified explanation of the mechanics behind AuSIRI's value and growth.
          </p>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <div className="flex-shrink-0 text-yellow-400 text-5xl font-bold">1</div>
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">Gold Backing</h3>
                <p className="text-gray-300">
                  Funds from AuSIRI token sales are used to acquire and secure physical gold, held in audited vaults.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <div className="flex-shrink-0 text-yellow-400 text-5xl font-bold">2</div>
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">Compounding Mechanism</h3>
                <p className="text-gray-300">
                  A portion of the revenue generated from strategic operations is used to acquire more gold, which is
                  then added to the backing, increasing token value.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <div className="flex-shrink-0 text-yellow-400 text-5xl font-bold">3</div>
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">Retail Cycle Optimization</h3>
                <p className="text-gray-300">
                  Our algorithms analyze retail market trends to optimize the timing of gold acquisitions and sales,
                  maximizing compounding efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <Milestones tokenType="ausiri" />

      {/* Call to Action */}
      <section className="py-20 px-4 bg-yellow-900/30 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Invest in AuSIRI?</h2>
          <p className="text-xl text-yellow-200 mb-8">
            Secure your wealth with a gold-backed token designed for predictable, compounding growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-yellow-500 text-black hover:bg-yellow-600"
              onClick={() => handleAddToCart(1000)}
            >
              Add $1,000 to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black bg-transparent"
              onClick={() => handleAddToCart(5000)}
            >
              Add $5,000 to Cart
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}