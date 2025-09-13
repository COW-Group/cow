import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Shield, TrendingUp, Globe, Building, Users, ArrowRight, ChevronRight } from 'lucide-react'
import { useAuthContext } from '@/lib/auth-context'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userType, setUserType] = useState<string>('')
  const [investmentExperience, setInvestmentExperience] = useState<string>('')
  const [primaryInterest, setPrimaryInterest] = useState<string>('')
  const [region, setRegion] = useState<string>('')
  const { updateUserProfile, getDashboardRoute } = useAuthContext()
  const navigate = useNavigate()

  const handleComplete = async () => {
    try {
      await updateUserProfile({
        user_type: userType as any,
        investment_experience: investmentExperience as any,
        primary_interest: primaryInterest as any,
        compliance_status: {
          kyc_verified: false,
          accredited_verified: userType === 'accredited_investor' || userType === 'institutional_investor',
          mifid_assessment_completed: userType === 'international_investor',
          region: region as any
        }
      })
      navigate(getDashboardRoute())
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-amber-500 text-white shadow-lg' 
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    currentStep > step ? 'bg-amber-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <h1 className="text-4xl font-light text-center text-gray-900 mb-4">Welcome to COW</h1>
          <p className="text-xl text-center text-gray-600 font-light">Let's customize your experience for optimal performance asset allocation</p>
        </div>

        {/* Step Content */}
        <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-12">
            
            {/* Step 1: Investor Type */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-light text-gray-900 mb-4">What type of investor are you?</h2>
                  <p className="text-lg text-gray-600 font-light">This helps us provide the right regulatory framework and investment options.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <button
                    onClick={() => setUserType('accredited_investor')}
                    className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                      userType === 'accredited_investor' 
                        ? 'border-amber-500 bg-amber-50 shadow-lg' 
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">Accredited Investor</h3>
                        <p className="text-sm text-blue-600">US Regulation D 506(c)</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      $200K+ annual income or $1M+ net worth. Access to all token offerings with sophisticated investor benefits.
                    </p>
                  </button>

                  <button
                    onClick={() => setUserType('international_investor')}
                    className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                      userType === 'international_investor' 
                        ? 'border-amber-500 bg-amber-50 shadow-lg' 
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">International Investor</h3>
                        <p className="text-sm text-amber-600">EU/Cyprus/Estonia Framework</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      MiFID II suitability assessment with European passporting benefits and cross-border compliance.
                    </p>
                  </button>

                  <button
                    onClick={() => setUserType('institutional_investor')}
                    className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                      userType === 'institutional_investor' 
                        ? 'border-amber-500 bg-amber-50 shadow-lg' 
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Building className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">Institutional Investor</h3>
                        <p className="text-sm text-green-600">Professional Management</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Investment funds, family offices, and institutional asset managers with professional-grade tools.
                    </p>
                  </button>

                  <button
                    onClick={() => setUserType('retail_investor')}
                    className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                      userType === 'retail_investor' 
                        ? 'border-amber-500 bg-amber-50 shadow-lg' 
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">Individual Investor</h3>
                        <p className="text-sm text-purple-600">Personal Portfolio</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Individual investors seeking portfolio diversification with real world asset exposure.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Investment Experience */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-light text-gray-900 mb-4">What's your investment experience?</h2>
                  <p className="text-lg text-gray-600 font-light">This helps us tailor the complexity of information and recommendations.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { id: 'beginner', title: 'Beginner', desc: 'New to investing or alternative assets', icon: '🌱' },
                    { id: 'intermediate', title: 'Intermediate', desc: 'Some experience with stocks, bonds, ETFs', icon: '📈' },
                    { id: 'advanced', title: 'Advanced', desc: 'Familiar with alternative investments', icon: '🎯' },
                    { id: 'professional', title: 'Professional', desc: 'Investment professional or advisor', icon: '🏆' }
                  ].map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setInvestmentExperience(level.id)}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                        investmentExperience === level.id 
                          ? 'border-amber-500 bg-amber-50 shadow-lg' 
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-2xl">{level.icon}</span>
                        <h3 className="text-xl font-medium text-gray-900">{level.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm">{level.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Primary Interest */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-light text-gray-900 mb-4">What's your primary investment goal?</h2>
                  <p className="text-lg text-gray-600 font-light">We'll recommend the optimal asset allocation for your objectives.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { id: 'wealth_preservation', title: 'Wealth Preservation', desc: 'Protect capital with stable returns', icon: Shield },
                    { id: 'income_generation', title: 'Income Generation', desc: 'Regular cash flows and distributions', icon: TrendingUp },
                    { id: 'growth', title: 'Growth', desc: 'Capital appreciation over time', icon: ChevronRight },
                    { id: 'diversification', title: 'Diversification', desc: 'Balance risk across asset classes', icon: Globe }
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setPrimaryInterest(goal.id)}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                        primaryInterest === goal.id 
                          ? 'border-amber-500 bg-amber-50 shadow-lg' 
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                          <goal.icon className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">{goal.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm">{goal.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Region */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-light text-gray-900 mb-4">What's your primary region?</h2>
                  <p className="text-lg text-gray-600 font-light">This determines your regulatory framework and compliance requirements.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { id: 'us', title: 'United States', desc: 'SEC/CFTC regulation, USD denominated', flag: '🇺🇸' },
                    { id: 'eu', title: 'European Union', desc: 'MiFID II framework, EUR denominated', flag: '🇪🇺' },
                    { id: 'international', title: 'International', desc: 'Global framework, multi-currency', flag: '🌍' }
                  ].map((region) => (
                    <button
                      key={region.id}
                      onClick={() => setRegion(region.id)}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                        region === region.id 
                          ? 'border-amber-500 bg-amber-50 shadow-lg' 
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="mb-4">
                        <span className="text-4xl">{region.flag}</span>
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">{region.title}</h3>
                      <p className="text-gray-600 text-sm">{region.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-8 py-3 rounded-xl"
              >
                Previous
              </Button>
              
              <div className="text-sm text-gray-500">
                Step {currentStep} of 4
              </div>
              
              {currentStep < 4 ? (
                <Button 
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !userType) ||
                    (currentStep === 2 && !investmentExperience) ||
                    (currentStep === 3 && !primaryInterest)
                  }
                  className="px-8 py-3 rounded-xl bg-amber-600 hover:bg-amber-700"
                >
                  Next <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  disabled={!region}
                  className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700"
                >
                  Complete Setup <CheckCircle className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}