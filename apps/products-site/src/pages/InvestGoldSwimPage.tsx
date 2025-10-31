import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuthContext } from "../lib/auth-context";
import { ProductMenu } from "../components/product-menu";
import { CartDropdown } from "../components/cart-dropdown";
import { ThemeToggle } from "../components/theme-toggle";
import { Calculator, Lock, Table, BarChart3, FileSpreadsheet, ArrowLeft, ChevronRight, Info } from "lucide-react";
import cowLogo from "../assets/cow-logo.png";
import { GoldPriceProvider, useGoldPriceContext } from "../contexts/gold-price-context";
import QuarterlyProjectionTable from "../components/quarterly-projection-table";
import QuarterlyGrowthChart from "../components/quarterly-growth-chart";
import GoldSwimOverview from "../components/gold-swim-overview";
import GoldSwimOverviewSection from "../components/gold-swim-overview-section";
import { FINANCIAL_MODELS, type FinancialModelParams } from "../lib/gold-price-calculations";

type Section = "overview" | "assumptions" | "charts" | "table"
type ModelType = 'conservative' | 'moderate' | 'optimistic' | 'custom'
type Currency = 'EUR' | 'USD'

const sections = [
  { id: "overview" as Section, label: "Overview", icon: FileSpreadsheet },
  { id: "assumptions" as Section, label: "Assumptions", icon: Calculator },
  { id: "table" as Section, label: "Quarterly Projection Table", icon: Table },
  { id: "charts" as Section, label: "Growth Visualizations", icon: BarChart3 },
]

function InvestGoldSwimContent() {
  const { auth } = useAuthContext();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const { spotAsk, eurExchangeRate } = useGoldPriceContext();

  // State for currency selection
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('EUR');

  // Financial Model State
  const [selectedModel, setSelectedModel] = useState<ModelType>('moderate');
  const [modelParams, setModelParams] = useState<FinancialModelParams>(FINANCIAL_MODELS.moderate.params);

  // Calculate default Total Unit Subscription
  const exchangeRate = eurExchangeRate || 1.2;
  const spotPriceEUR = spotAsk ? spotAsk / exchangeRate : 3434.67;
  const defaultTotalUnitSubscription = (((spotPriceEUR) / 31.1034768 + 15) / (1 - modelParams.transactionBrokerage)) * 1000;

  // State for custom Total Unit Subscription (null means use default)
  const [customTotalUnitSubscription, setCustomTotalUnitSubscription] = useState<number | null>(null);

  // Use custom value if set, otherwise use calculated default
  const totalUnitSubscription = customTotalUnitSubscription ?? defaultTotalUnitSubscription;

  // Initial Investment Amount = 25% × Total Unit Subscription
  const initialInvestment = totalUnitSubscription * 0.25;

  // Handle model selection
  const handleModelChange = (model: ModelType) => {
    setSelectedModel(model);
    if (model !== 'custom') {
      setModelParams(FINANCIAL_MODELS[model].params);
    }
  };

  // Handle individual parameter changes
  const handleParamChange = (paramName: keyof FinancialModelParams, value: number) => {
    setSelectedModel('custom');
    setModelParams(prev => ({ ...prev, [paramName]: value }));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <GoldSwimOverviewSection />;
      case "assumptions":
        return (
          <GoldSwimOverview
            initialInvestment={initialInvestment}
            totalUnitSubscription={totalUnitSubscription}
            defaultTotalUnitSubscription={defaultTotalUnitSubscription}
            onTotalUnitSubscriptionChange={setCustomTotalUnitSubscription}
            selectedModel={selectedModel}
            modelParams={modelParams}
            onModelChange={handleModelChange}
            onParamChange={handleParamChange}
            selectedCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
          />
        );
      case "charts":
        return <QuarterlyGrowthChart initialInvestment={initialInvestment} modelParams={modelParams} />;
      case "table":
        return (
          <QuarterlyProjectionTable
            initialInvestment={initialInvestment}
            totalUnitSubscription={totalUnitSubscription}
            modelParams={modelParams}
            selectedCurrency={selectedCurrency}
          />
        );
      default:
        return <GoldSwimOverviewSection />;
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ background: 'var(--mode-bg)' }}>
      <style>{`
        :root {
          --mode-bg: #F5F3F0;
          --mode-text: #1f2937;
          --mode-card-bg: rgba(255, 255, 255, 0.9);
          --mode-border: rgba(201, 184, 168, 0.3);
        }
        .dark {
          --mode-bg: #0a1628;
          --mode-text: #f9fafb;
          --mode-card-bg: rgba(17, 24, 39, 0.9);
          --mode-border: rgba(75, 85, 99, 0.3);
        }
      `}</style>

      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[85%] max-w-5xl">
        <div
          className="px-6 py-3 flex items-center justify-between gap-3 transition-all duration-300 bg-white/90 dark:bg-gray-900/90 border border-white/40 dark:border-gray-700/40"
          style={{
            backdropFilter: 'blur(25px) saturate(180%)',
            borderRadius: '20px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={cowLogo}
                alt="COW Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-lg font-light tracking-tight text-gray-900 dark:text-gray-100" style={{ letterSpacing: '0.02em', fontWeight: '300' }}>
                COW
              </span>
            </Link>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            <ProductMenu />
            <CartDropdown />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            {auth.isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 dark:text-gray-300"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => navigate('/')}
                className="bg-amber-700 hover:bg-amber-800 dark:bg-amber-700 dark:hover:bg-amber-800 text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center text-xs sm:text-sm overflow-x-auto mb-4 sm:mb-6">
            <Link to="/" className="text-blue-600 dark:text-blue-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:underline transition-colors whitespace-nowrap font-medium">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-gray-400 flex-shrink-0" />
            <Link to="/dashboard" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors whitespace-nowrap">
              Dashboard
            </Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">Gold SWIM Calculator</span>
          </nav>

          {/* Back Button */}
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-500 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)', boxShadow: '0 8px 16px rgba(180, 83, 9, 0.2)' }}>
                  <Calculator className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-5xl sm:text-6xl font-light mb-4 text-gray-900 dark:text-gray-100" style={{ letterSpacing: '-0.02em' }}>
                GOLD SWIM Investment Calculator
              </h1>
              <p className="text-lg font-light text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Model your quarterly gold retailing investment with professional-grade financial projections
              </p>
            </motion.div>
          </div>

          {/* MyGOLD Component Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-2 border-blue-500/30 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 max-w-4xl mx-auto">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Component of MyGOLD Investment Product
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                      GOLD SWIM represents 25% of the MyGOLD diversified investment allocation and is not available as a standalone investment. This calculator is provided for educational purposes to help you understand the physical gold retailing component within your MyGOLD investment.
                    </p>
                    <div className="flex items-center gap-3">
                      <Link to="/dashboard">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                          View MyGOLD Investment
                        </Button>
                      </Link>
                      <span className="text-xs text-blue-700 dark:text-blue-300">
                        MyGOLD: 25% GOLD SWIM + 8.33% SIRI Z31 + 18.33% Cash + 48.33% Alternative Assets
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Authentication Gate */}
          {!auth.isAuthenticated ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-2 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 max-w-2xl mx-auto">
                <CardContent className="pt-12 pb-12 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Lock className="w-10 h-10 text-amber-600 dark:text-amber-500" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold text-amber-900 dark:text-amber-100 mb-4">
                    Authentication Required
                  </h2>
                  <p className="text-amber-800 dark:text-amber-200 mb-8 max-w-md mx-auto">
                    The GOLD SWIM Investment Calculator is available exclusively to authenticated investors. Sign in or create an account to access professional-grade financial modeling tools.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      size="lg"
                      onClick={() => navigate('/')}
                      className="bg-amber-700 hover:bg-amber-800 dark:bg-amber-700 dark:hover:bg-amber-800 text-white"
                    >
                      Sign In to Access Calculator
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate('/gold-swim')}
                      className="border-amber-300 text-amber-700 dark:text-amber-300 dark:border-amber-700"
                    >
                      View Product Info
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* Calculator Interface for Authenticated Users */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex gap-4"
            >
              {/* Sidebar Navigation */}
              <aside className="w-80 flex-shrink-0">
                <nav className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-blue-200 dark:border-gray-700 overflow-hidden sticky top-24">
                  {/* Title */}
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold text-white">Gold SWIM</h2>
                      <span className="text-sm font-semibold text-white bg-white/25 px-2.5 py-1 rounded-full shadow-sm">
                        Calculator
                      </span>
                    </div>
                    <p className="text-xs font-medium text-cyan-50 tracking-wide uppercase">
                      Accumulated Value Projection
                    </p>
                  </div>

                  <div className="p-2.5 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                    {/* Navigation Items */}
                    <ul className="space-y-1">
                      {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                          <li key={section.id}>
                            <button
                              onClick={() => setActiveSection(section.id)}
                              className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 ${
                                isActive
                                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/30"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-800 hover:shadow-sm bg-transparent"
                              }`}
                            >
                              <div className={`flex items-center justify-center w-7 h-7 rounded-md transition-all ${
                                isActive
                                  ? "bg-white/20"
                                  : "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 group-hover:from-blue-200 group-hover:to-cyan-200"
                              }`}>
                                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-blue-600 dark:text-blue-400"}`} />
                              </div>
                              <span className={`text-xs font-normal flex-1 text-left ${
                                isActive ? "text-white" : "text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                              }`}>
                                {section.label}
                              </span>
                              {isActive && (
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </nav>
              </aside>

              {/* Main Content */}
              <main className="flex-1 min-w-0">
                {renderSection()}
              </main>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-8 border-t" style={{ borderColor: 'var(--mode-border)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-light text-gray-600 dark:text-gray-400">
            <strong>My Gold Grams Inc.</strong> is an independent company. Securities offered by My Gold Grams Inc.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            For information contact <a href="mailto:ir@mygoldgrams.com" className="text-amber-700 dark:text-amber-500 hover:underline">ir@mygoldgrams.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function InvestGoldSwimPage() {
  return (
    <GoldPriceProvider>
      <InvestGoldSwimContent />
    </GoldPriceProvider>
  );
}
