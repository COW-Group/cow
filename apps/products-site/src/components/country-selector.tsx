import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { ChevronDown, Globe, ArrowRight, Info } from "lucide-react"
import { HeroBackground } from "./hero-background"

export interface Country {
  code: string
  name: string
  currency: string
  language: string
  region: string
  flag?: string
}

export interface CountrySelectorProps {
  onCountrySelect: (country: Country) => void
  onContinue: () => void
}

const countries: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD', language: 'English', region: 'North America', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', language: 'English', region: 'Europe', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', currency: 'CAD', language: 'English', region: 'North America', flag: '🇨🇦' },
  { code: 'DE', name: 'Germany', currency: 'EUR', language: 'German', region: 'Europe', flag: '🇩🇪' },
  { code: 'FR', name: 'France', currency: 'EUR', language: 'French', region: 'Europe', flag: '🇫🇷' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', language: 'German', region: 'Europe', flag: '🇨🇭' },
  { code: 'AU', name: 'Australia', currency: 'AUD', language: 'English', region: 'Oceania', flag: '🇦🇺' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', language: 'English', region: 'Asia', flag: '🇸🇬' },
  { code: 'HK', name: 'Hong Kong SAR', currency: 'HKD', language: 'English', region: 'Asia', flag: '🇭🇰' },
  { code: 'JP', name: 'Japan', currency: 'JPY', language: 'Japanese', region: 'Asia', flag: '🇯🇵' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', language: 'Dutch', region: 'Europe', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', currency: 'SEK', language: 'Swedish', region: 'Europe', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', currency: 'NOK', language: 'Norwegian', region: 'Europe', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', currency: 'DKK', language: 'Danish', region: 'Europe', flag: '🇩🇰' },
  { code: 'IT', name: 'Italy', currency: 'EUR', language: 'Italian', region: 'Europe', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', currency: 'EUR', language: 'Spanish', region: 'Europe', flag: '🇪🇸' },
  { code: 'BE', name: 'Belgium', currency: 'EUR', language: 'Dutch', region: 'Europe', flag: '🇧🇪' },
  { code: 'AT', name: 'Austria', currency: 'EUR', language: 'German', region: 'Europe', flag: '🇦🇹' },
  { code: 'LU', name: 'Luxembourg', currency: 'EUR', language: 'French', region: 'Europe', flag: '🇱🇺' },
  { code: 'IE', name: 'Ireland', currency: 'EUR', language: 'English', region: 'Europe', flag: '🇮🇪' },
]

export function CountrySelector({ onCountrySelect, onContinue }: CountrySelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isDarkBackground, setIsDarkBackground] = useState(true)

  // Dynamic background detection
  useEffect(() => {
    const detectBackgroundLuminance = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 100
      canvas.height = 100

      // Sample multiple points on the background
      const imageData = ctx.getImageData(0, 0, 100, 100)
      let totalLuminance = 0
      let sampleCount = 0

      // Sample every 10th pixel for performance
      for (let i = 0; i < imageData.data.length; i += 40) {
        const r = imageData.data[i] || 0
        const g = imageData.data[i + 1] || 0
        const b = imageData.data[i + 2] || 0

        // Calculate relative luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        totalLuminance += luminance
        sampleCount++
      }

      const avgLuminance = totalLuminance / sampleCount
      setIsDarkBackground(avgLuminance < 0.5)
    }

    // Initial detection
    const timer = setTimeout(() => {
      detectBackgroundLuminance()
      setIsVisible(true)
    }, 200)

    // Re-detect every 2 seconds for dynamic backgrounds
    const interval = setInterval(detectBackgroundLuminance, 2000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setIsDropdownOpen(false)
    setSearchTerm('')
    onCountrySelect(country)
  }

  const handleContinue = () => {
    if (selectedCountry) {
      onContinue()
    }
  }

  // Apple Liquid Glass text styles - Professional implementation
  const getTextStyles = (isLogo = false) => {
    return {
      color: 'rgba(255, 255, 255, 0.85)',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      fontWeight: isLogo ? 200 : 300,
      letterSpacing: isLogo ? '0.05em' : '0.02em',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, sans-serif',
      fontFeatureSettings: '"ss01", "ss02"',
      fontOpticalSizing: 'auto',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Vanta.js Background */}
      <HeroBackground />

      <div className="relative z-10 w-full h-full overflow-auto flex items-center justify-center">
        <div className={`relative w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 'max(2rem, env(safe-area-inset-top) + 2rem)',
          paddingBottom: 'max(2rem, env(safe-area-inset-bottom) + 2rem)',
          paddingLeft: 'max(1rem, env(safe-area-inset-left) + 1rem)',
          paddingRight: 'max(1rem, env(safe-area-inset-right) + 1rem)'
        }}>
        {/* Unified Brand Container */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          {/* Logo */}
          <div
            className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4 tracking-wider"
            style={getTextStyles(true)}
          >
            COW
          </div>

          {/* Divider */}
          <div className="w-12 sm:w-16 lg:w-20 h-px mx-auto opacity-30 bg-gradient-to-r from-transparent via-white to-transparent mb-6 sm:mb-8" />

          {/* Brand Message */}
          <div className="space-y-2 sm:space-y-3">
            <p
              className="text-xs sm:text-sm lg:text-base opacity-80 px-2"
              style={{
                ...getTextStyles(),
                fontSize: 'clamp(12px, 3vw, 16px)',
                opacity: 0.8
              }}
            >
              Let's Create Your
            </p>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight sm:leading-relaxed px-2"
              style={{
                ...getTextStyles(),
                fontSize: 'clamp(24px, 8vw, 48px)',
                fontWeight: 300
              }}
            >
              Cycles of Wealth
            </h1>
          </div>
        </div>

        {/* Country Selector */}
        <div className="relative mb-6 sm:mb-8 lg:mb-10">
          <div
            className={`relative cursor-pointer transition-all duration-300 ${
              isDropdownOpen ? 'ring-1 ring-white/20' : ''
            }`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              minHeight: '48px'
            }}
          >
            <div className="flex items-center justify-between p-3 sm:p-4 lg:p-5" style={{ minHeight: '48px' }}>
              <div className="flex items-center gap-3 flex-1">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  {selectedCountry ? (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xl sm:text-2xl flex-shrink-0">{selectedCountry.flag}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-white font-medium text-sm sm:text-base lg:text-lg truncate">{selectedCountry.name}</div>
                        <div className="text-gray-400 text-xs sm:text-sm">
                          {selectedCountry.currency} • {selectedCountry.language}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm sm:text-base lg:text-lg">Select your country</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div className="relative">
                  <Info
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 hover:text-gray-300 active:text-gray-300 cursor-pointer transition-colors"
                    onClick={() => setShowTooltip(!showTooltip)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    style={{ minHeight: '44px', minWidth: '44px', padding: '12px' }}
                  />
                  {showTooltip && (
                    <div
                      className="fixed inset-x-4 bottom-20 sm:absolute sm:bottom-full sm:right-0 sm:left-auto sm:inset-x-auto sm:mb-2 w-auto sm:w-64 p-3 text-xs sm:text-sm text-white bg-black/90 backdrop-blur-sm rounded-lg shadow-lg z-50"
                      style={{ textShadow: 'none' }}
                      onClick={() => setShowTooltip(false)}
                    >
                      Your location helps us provide relevant pricing, regulatory information, and language preferences.
                      <div className="hidden sm:block absolute top-full right-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-black/90"></div>
                    </div>
                  )}
                </div>
                <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-400 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} />
              </div>
            </div>
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50"
              style={{
                background: 'rgba(20, 20, 20, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                maxHeight: 'min(40vh, 320px)',
                overflowY: 'auto',
                bottom: 'auto'
              }}
            >
              {/* Search */}
              <div className="p-4 border-b border-white/10">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                />
              </div>

              {/* Countries List */}
              <div className="py-2">
                {filteredCountries.map((country) => (
                  <div
                    key={country.code}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => handleCountrySelect(country)}
                  >
                    <span className="text-xl">{country.flag}</span>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{country.name}</div>
                      <div className="text-gray-400 text-xs">
                        {country.currency} • {country.language}
                      </div>
                    </div>
                    {selectedCountry?.code === country.code && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="px-4 py-6 text-center text-gray-500 text-sm">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedCountry}
          className={`w-full py-3 sm:py-4 lg:py-5 transition-all duration-300 ${
            selectedCountry
              ? 'text-white shadow-lg hover:scale-105'"
              : 'text-gray-500 cursor-not-allowed'"
          }`}
          style={{
            background: selectedCountry
              ? 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))'
              : 'rgba(255, 255, 255, 0.05)',
            backdropFilter: selectedCountry ? 'blur(20px)' : 'blur(10px)',
            border: selectedCountry
              ? '1px solid rgba(255, 255, 255, 0.2)'
              : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            fontWeight: '500',
            letterSpacing: '0.01em',
            boxShadow: selectedCountry
              ? '0 8px 32px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
              : 'none',
            minHeight: '48px',
            fontSize: 'clamp(14px, 4vw, 16px)'
          }}
        >
          <span className="flex items-center justify-center gap-2 sm:gap-3">
            <span className="text-sm sm:text-base lg:text-lg font-medium">Continue</span>
            <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
              selectedCountry ? 'group-hover:translate-x-1' : ''
            }`} />
          </span>
        </Button>

      </div>
    </div>
  )
}