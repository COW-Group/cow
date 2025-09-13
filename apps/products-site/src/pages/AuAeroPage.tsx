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
import { ArrowLeft, DollarSign, BarChart, ShieldCheck, Plane } from "lucide-react";

export default function AuAeroPage() {
  const { addToCart } = useCart();
  const { auth, signOut } = useAuthContext();
  const { isConnected, address, connectWallet, disconnectWallet, error, clearError } = useWeb3();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAddToCart = (amount: number) => {
    addToCart({
      id: `auaero-${Date.now()}`,
      name: `AuAERO Token (${amount.toLocaleString()})`,
      description: "Gold and commercial airline asset-backed token",
      price: amount,
      link: "/auaero",
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
                <Plane className="h-5 w-5 text-gray-400" />
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
                <Plane className="h-5 w-5" />
                <div className="h-2 w-2 rounded-full ml-2 bg-red-500" />
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-black">
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-blue-300">AuAERO</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Gold and commercial airline asset-backed token with aggressive performance optimization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => handleAddToCart(5000)}
            >
              Pre-order AuAERO
            </Button>
            <Link to="/auaero-whitepaper">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-300 hover:bg-blue-900 bg-transparent"
              >
                View Whitepaper
              </Button>
            </Link>
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
              <p className="text-blue-400 text-sm uppercase tracking-wider mb-4">OVERVIEW</p>
              <h2 className="text-5xl font-bold mb-6">AuAERO</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                AuAERO stands for Gold-Aerospace Enhanced Return Optimization - COW's most aggressive performance token
                backed by both gold reserves and commercial passenger airline assets with advanced business optimization
                strategies.
              </p>
              <p className="text-gray-400 mb-8 leading-relaxed">
                This hybrid token combines the stability of gold backing with the high-growth potential of optimized
                commercial aviation assets. Through sophisticated financial engineering, business problem-solving, and
                operational optimization, AuAERO delivers aggressive compounding returns while maintaining asset
                security through diversified backing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => handleAddToCart(5000)}
                >
                  Pre-order AuAERO
                </Button>
                <Link to="/auaero-whitepaper">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-300 hover:bg-blue-900 bg-transparent"
                  >
                    View Whitepaper
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-80 h-80 mx-auto bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-full flex items-center justify-center border border-blue-500/50">
                <Plane className="h-32 w-32 text-blue-400" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-gray-800">
                <h3 className="font-bold mb-2">AuAERO Token</h3>
                <p className="text-sm text-gray-400 mb-4">Starting at $5,000 minimum</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Asset backing:</span>
                    <span>Gold + Aviation</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expected APY:</span>
                    <span className="text-blue-400">25-40%</span>
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
            <h2 className="text-4xl font-bold mb-4">Key Features of AuAERO</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience a new paradigm of asset-backed tokens designed for aggressive growth and security.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-blue-400" /> Gold Backed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Each AuAERO token is partially backed by physical gold, providing a stable foundation.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-6 w-6 text-blue-400" /> Airline Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Leverages commercial airline assets for aggressive performance optimization.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-blue-400" /> Aggressive Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Advanced financial engineering maximizes asset performance and returns.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-blue-400" /> Enhanced Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Secured by physical gold and optimized aviation assets with transparent auditing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Performance Projections */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Performance Projections</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 border-blue-500/30">
              <CardHeader>
                <CardTitle>Conservative Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Annual Return:</span>
                    <span className="text-blue-400">25-30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk Level:</span>
                    <span>Moderate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Asset Allocation:</span>
                    <span>60% Gold, 40% Aviation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-400/10 to-green-600/10 border-green-500/30">
              <CardHeader>
                <CardTitle>Aggressive Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Annual Return:</span>
                    <span className="text-green-400">35-40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk Level:</span>
                    <span>Higher</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Asset Allocation:</span>
                    <span>40% Gold, 60% Aviation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">How AuAERO Works</h2>
          <p className="text-gray-400 text-lg mb-12">
            A simplified explanation of the mechanics behind AuAERO's value and growth.
          </p>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <div className="flex-shrink-0 text-blue-400 text-5xl font-bold">1</div>
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">Asset Acquisition</h3>
                <p className="text-gray-300">
                  Funds from AuAERO token sales are strategically invested in a diversified portfolio of physical gold
                  and high-performing commercial airline assets.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <div className="flex-shrink-0 text-blue-400 text-5xl font-bold">2</div>
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">Performance Optimization</h3>
                <p className="text-gray-300">
                  Our expert team actively manages the asset portfolio, employing advanced financial engineering
                  techniques to maximize returns and optimize performance.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <div className="flex-shrink-0 text-blue-400 text-5xl font-bold">3</div>
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">Token Value Growth</h3>
                <p className="text-gray-300">
                  The value generated from the optimized assets directly contributes to the growth of the AuAERO token,
                  providing holders with aggressive compounding returns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <Milestones tokenType="auaero" />

      {/* Call to Action */}
      <section className="py-20 px-4 bg-blue-900/30 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready for Aggressive Growth?</h2>
          <p className="text-xl text-blue-200 mb-8">
            Experience the power of dual-asset backing with optimized aviation performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => handleAddToCart(5000)}
            >
              Add $5,000 to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black bg-transparent"
              onClick={() => handleAddToCart(10000)}
            >
              Add $10,000 to Cart
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}