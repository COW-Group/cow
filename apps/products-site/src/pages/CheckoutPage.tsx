import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useCart } from "../contexts/cart-context";
import { useAuthContext } from "../lib/auth-context";
import { ProductMenu } from "../components/product-menu";
import { CartDropdown } from "../components/cart-dropdown";
import { ThemeToggle } from "../components/theme-toggle";
import {
  ArrowLeft,
  Building2,
  Copy,
  CheckCircle,
  AlertCircle,
  DollarSign,
  FileText,
  Mail,
  ChevronRight,
  Download,
  CreditCard,
  Smartphone,
  University
} from "lucide-react";
import cowLogo from "../assets/cow-logo.png";

type PaymentMethod = 'wire' | 'zelle' | 'ach';

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { auth } = useAuthContext();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wire');

  useEffect(() => {
    setIsClient(true);
    // Redirect if not authenticated
    if (!auth.isAuthenticated) {
      navigate('/');
    }
    // Redirect if cart is empty
    if (cart.length === 0) {
      navigate('/dashboard');
    }
  }, [auth.isAuthenticated, cart.length, navigate]);

  const totalPrice = getTotalPrice();

  const wireInstructions = {
    companyName: "My Gold Grams Inc",
    companyAddress: "995 Marsh Rd, Redwood City, CA, USA 94063",
    accountNumber: "9357972372",
    routingNumber: "121000248",
    swiftCode: "WFBIUS6S",
    bankName: "Wells Fargo",
    bankAddress: "420 Montgomery St, San Francisco, CA 94104, USA"
  };

  const achInstructions = {
    companyName: "My Gold Grams Inc",
    accountNumber: "9357972372",
    routingNumber: "121042882",
    accountType: "Checking",
    bankName: "Wells Fargo"
  };

  const zelleInstructions = {
    email: "billing@mygoldgrams.com",
    recipientName: "My Gold Grams Inc"
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadInstructions = () => {
    let instructions = '';

    if (paymentMethod === 'wire') {
      instructions = `
WIRE TRANSFER INSTRUCTIONS
==========================

Order Total: $${totalPrice.toFixed(2)}

BENEFICIARY INFORMATION:
Company Name: ${wireInstructions.companyName}
Company Address: ${wireInstructions.companyAddress}

BANK INFORMATION:
Bank Name: ${wireInstructions.bankName}
Bank Address: ${wireInstructions.bankAddress}
Account Number: ${wireInstructions.accountNumber}
Wire Routing Number: ${wireInstructions.routingNumber}
SWIFT Code: ${wireInstructions.swiftCode}

PAYMENT REFERENCE:
Please include your email (${auth.user?.email || 'your registered email'}) in the wire transfer reference/memo field.

ORDER DETAILS:
${cart.map((item, index) => `${index + 1}. ${item.name} - $${item.price.toFixed(2)}`).join('\n')}

Total Amount: $${totalPrice.toFixed(2)}

---
For questions, contact: ir@mygoldgrams.com
`;
    } else if (paymentMethod === 'zelle') {
      instructions = `
ZELLE PAYMENT INSTRUCTIONS
==========================

Order Total: $${totalPrice.toFixed(2)}

ZELLE RECIPIENT:
Recipient Email: ${zelleInstructions.email}
Recipient Name: ${zelleInstructions.recipientName}

IMPORTANT:
- Include your email (${auth.user?.email || 'your registered email'}) in the payment memo/note
- Zelle payments typically process instantly
- Maximum amount for Zelle: $3,500

ORDER DETAILS:
${cart.map((item, index) => `${index + 1}. ${item.name} - $${item.price.toFixed(2)}`).join('\n')}

Total Amount: $${totalPrice.toFixed(2)}

---
For questions, contact: billing@mygoldgrams.com
`;
    } else if (paymentMethod === 'ach') {
      instructions = `
ACH PAYMENT INSTRUCTIONS
========================

Order Total: $${totalPrice.toFixed(2)}

BENEFICIARY INFORMATION:
Company Name: ${achInstructions.companyName}

BANK INFORMATION:
Bank Name: ${achInstructions.bankName}
Account Number: ${achInstructions.accountNumber}
ACH Routing Number: ${achInstructions.routingNumber}
Account Type: ${achInstructions.accountType}

PAYMENT REFERENCE:
Please include your email (${auth.user?.email || 'your registered email'}) in the ACH payment reference/memo field.

IMPORTANT:
- ACH payments typically process in 3-5 business days
- Ensure you select "ACH/Direct Debit" as payment type
- Some banks may call this "eCheck" or "Bank Transfer"

ORDER DETAILS:
${cart.map((item, index) => `${index + 1}. ${item.name} - $${item.price.toFixed(2)}`).join('\n')}

Total Amount: $${totalPrice.toFixed(2)}

---
For questions, contact: ir@mygoldgrams.com
`;
    }

    const blob = new Blob([instructions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paymentMethod}-payment-instructions-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
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
              <img src={cowLogo} alt="COW Logo" className="h-8 w-8 object-contain" />
              <span className="text-lg font-light tracking-tight text-gray-900 dark:text-gray-100">
                COW
              </span>
            </Link>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            <ProductMenu />
            <CartDropdown />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 dark:text-gray-300"
            >
              Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 px-8 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center text-xs sm:text-sm overflow-x-auto mb-6">
            <Link to="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors whitespace-nowrap font-medium">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-gray-400 flex-shrink-0" />
            <Link to="/dashboard" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors whitespace-nowrap">
              Dashboard
            </Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">Checkout</span>
          </nav>

          {/* Back Button */}
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-500 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-light mb-4 text-gray-900 dark:text-gray-100">
              Complete Your Investment
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose your preferred payment method and follow the instructions below
            </p>
          </motion.div>

          {/* Payment Method Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl max-w-4xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
                  Select Payment Method
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Wire Transfer */}
                  <button
                    onClick={() => setPaymentMethod('wire')}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      paymentMethod === 'wire'
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/20 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Building2 className={`w-8 h-8 mb-2 ${paymentMethod === 'wire' ? 'text-amber-600' : 'text-gray-500'}`} />
                      <h4 className={`font-semibold mb-1 ${paymentMethod === 'wire' ? 'text-amber-900 dark:text-amber-100' : 'text-gray-900 dark:text-gray-100'}`}>
                        Wire Transfer
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">All amounts • 1-3 days</p>
                      {paymentMethod === 'wire' && (
                        <Badge className="mt-2 bg-amber-600 text-white">Selected</Badge>
                      )}
                    </div>
                  </button>

                  {/* Zelle */}
                  <button
                    onClick={() => setPaymentMethod('zelle')}
                    disabled={totalPrice >= 3500}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      totalPrice >= 3500
                        ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700'
                        : paymentMethod === 'zelle'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Smartphone className={`w-8 h-8 mb-2 ${totalPrice >= 3500 ? 'text-gray-400' : paymentMethod === 'zelle' ? 'text-purple-600' : 'text-gray-500'}`} />
                      <h4 className={`font-semibold mb-1 ${totalPrice >= 3500 ? 'text-gray-400' : paymentMethod === 'zelle' ? 'text-purple-900 dark:text-purple-100' : 'text-gray-900 dark:text-gray-100'}`}>
                        Zelle
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Under $3,500 • Instant</p>
                      {totalPrice >= 3500 && (
                        <Badge variant="outline" className="mt-2 text-xs">Not available</Badge>
                      )}
                      {paymentMethod === 'zelle' && totalPrice < 3500 && (
                        <Badge className="mt-2 bg-purple-600 text-white">Selected</Badge>
                      )}
                    </div>
                  </button>

                  {/* ACH */}
                  <button
                    onClick={() => setPaymentMethod('ach')}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      paymentMethod === 'ach'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <University className={`w-8 h-8 mb-2 ${paymentMethod === 'ach' ? 'text-blue-600' : 'text-gray-500'}`} />
                      <h4 className={`font-semibold mb-1 ${paymentMethod === 'ach' ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`}>
                        ACH Transfer
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">All amounts • 3-5 days</p>
                      {paymentMethod === 'ach' && (
                        <Badge className="mt-2 bg-blue-600 text-white">Selected</Badge>
                      )}
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl sticky top-24">
                  <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <FileText className="w-5 h-5 text-amber-600" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-amber-600 dark:text-amber-500">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleDownloadInstructions}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Instructions
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Payment Instructions */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Information Banner */}
                <Card className="border-2 border-blue-500/30 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Important Payment Instructions
                        </h3>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          {paymentMethod === 'wire' && (
                            <>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Include your registered email ({auth.user?.email}) in the wire transfer reference</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Wire transfers typically process within 1-3 business days</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>You'll receive a confirmation email once payment is received</span>
                              </li>
                            </>
                          )}
                          {paymentMethod === 'zelle' && (
                            <>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Include your registered email ({auth.user?.email}) in the Zelle payment note</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Zelle payments process instantly</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Maximum Zelle payment amount: $3,500</span>
                              </li>
                            </>
                          )}
                          {paymentMethod === 'ach' && (
                            <>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Include your registered email ({auth.user?.email}) in the ACH payment reference</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>ACH payments typically process in 3-5 business days</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Select "ACH/Direct Debit" as your payment type</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Zelle Instructions */}
                {paymentMethod === 'zelle' && (
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                        Zelle Payment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between group bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Recipient Email
                            </label>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1 font-mono">
                              {zelleInstructions.email}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(zelleInstructions.email, 'zelleEmail')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === 'zelleEmail' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-start justify-between group">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Recipient Name
                            </label>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                              {zelleInstructions.recipientName}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(zelleInstructions.recipientName, 'zelleRecipient')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === 'zelleRecipient' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <p className="text-sm text-amber-900 dark:text-amber-100 font-medium mb-2">
                            How to send via Zelle:
                          </p>
                          <ol className="text-sm text-amber-800 dark:text-amber-200 space-y-1 list-decimal list-inside">
                            <li>Open your banking app</li>
                            <li>Select Zelle from the menu</li>
                            <li>Enter recipient email: {zelleInstructions.email}</li>
                            <li>Enter amount: ${totalPrice.toFixed(2)}</li>
                            <li>Add your email ({auth.user?.email}) in the note/memo</li>
                            <li>Review and send</li>
                          </ol>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Wire Transfer - Beneficiary Information */}
                {paymentMethod === 'wire' && (
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Building2 className="w-5 h-5 text-amber-600" />
                        Beneficiary Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between group">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Company Name
                            </label>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                              {wireInstructions.companyName}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(wireInstructions.companyName, 'companyName')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === 'companyName' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-start justify-between group">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Company Address
                            </label>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                              {wireInstructions.companyAddress}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(wireInstructions.companyAddress, 'companyAddress')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === 'companyAddress' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* ACH - Beneficiary Information */}
                {paymentMethod === 'ach' && (
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        Beneficiary Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between group">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Company Name
                            </label>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                              {achInstructions.companyName}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(achInstructions.companyName, 'achCompanyName')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === 'achCompanyName' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Wire Transfer - Bank Information */}
                {paymentMethod === 'wire' && (
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        Bank Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between group">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Bank Name
                            </label>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                              {wireInstructions.bankName}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(wireInstructions.bankName, 'bankName')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === 'bankName' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-start justify-between group">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Bank Address
                            </label>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                              {wireInstructions.bankAddress}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(wireInstructions.bankAddress, 'bankAddress')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === 'bankAddress' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-start justify-between group bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Account Number
                            </label>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1 font-mono">
                              {wireInstructions.accountNumber}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(wireInstructions.accountNumber, 'accountNumber')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === 'accountNumber' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-start justify-between group bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Wire Routing Number
                            </label>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1 font-mono">
                              {wireInstructions.routingNumber}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(wireInstructions.routingNumber, 'routingNumber')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === 'routingNumber' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-start justify-between group bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              SWIFT Code
                            </label>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1 font-mono">
                              {wireInstructions.swiftCode}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(wireInstructions.swiftCode, 'swiftCode')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === 'swiftCode' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* ACH - Bank Information */}
                {paymentMethod === 'ach' && (
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <University className="w-5 h-5 text-blue-600" />
                        ACH Bank Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between group">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Bank Name
                            </label>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                              {achInstructions.bankName}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(achInstructions.bankName, 'achBankName')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === 'achBankName' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-start justify-between group bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Account Number
                            </label>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1 font-mono">
                              {achInstructions.accountNumber}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(achInstructions.accountNumber, 'achAccountNumber')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === 'achAccountNumber' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-start justify-between group bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              ACH Routing Number
                            </label>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1 font-mono">
                              {achInstructions.routingNumber}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(achInstructions.routingNumber, 'achRoutingNumber')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === 'achRoutingNumber' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-start justify-between group bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Account Type
                            </label>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                              {achInstructions.accountType}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(achInstructions.accountType, 'achAccountType')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedField === 'achAccountType' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Reference - Only for Wire and ACH */}
                {(paymentMethod === 'wire' || paymentMethod === 'ach') && (
                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-2 border-amber-300 dark:border-amber-700 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                            Payment Reference (Required)
                          </h3>
                          <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                            Include the following in your {paymentMethod === 'wire' ? 'wire transfer' : 'ACH payment'} reference/memo field:
                          </p>
                          <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                            <p className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                              {auth.user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Contact Support */}
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Questions or Need Help?
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {paymentMethod === 'zelle' ? (
                            <>
                              For Zelle payment support, contact{" "}
                              <a href="mailto:billing@mygoldgrams.com" className="text-purple-700 dark:text-purple-400 hover:underline font-medium">
                                billing@mygoldgrams.com
                              </a>
                            </>
                          ) : (
                            <>
                              Contact our investor relations team at{" "}
                              <a href="mailto:ir@mygoldgrams.com" className="text-amber-700 dark:text-amber-500 hover:underline font-medium">
                                ir@mygoldgrams.com
                              </a>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-950/50">
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
