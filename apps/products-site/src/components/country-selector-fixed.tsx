import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { ChevronDown, Globe, ArrowRight } from "lucide-react"
import { HeroBackground } from "./hero-background"
import { useAdaptiveText, useAdaptiveButton } from "../hooks/useAdaptiveText"

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

  // Apple-style adaptive text and button styles
  const adaptiveText = useAdaptiveText()
  const adaptiveButton = useAdaptiveButton()

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
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

  return (
    <div className="fixed inset-0 z-50">
      {/* Full Screen Vanta Background */}
      <div className="absolute inset-0 z-0">
        <HeroBackground />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 w-full h-full overflow-auto flex items-center justify-center">
        <div className={`relative w-full max-w-lg mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 'max(3rem, env(safe-area-inset-top) + 3rem)',
          paddingBottom: 'max(3rem, env(safe-area-inset-bottom) + 3rem)'
        }}>
        {/* Logo */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="text-2xl sm:text-3xl font-light mb-3 sm:mb-4 tracking-wider text-readable" style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 300,
            color: 'rgba(0, 0, 0, 0.9)'
          }}>
            COW
          </div>
          <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-current to-transparent mx-auto opacity-30" style={{
            color: 'rgba(0, 0, 0, 0.3)'
          }} />
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium mb-3 sm:mb-4 leading-relaxed px-2 text-readable"
            style={{
              letterSpacing: '0.02em',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 500,
              color: 'rgba(0, 0, 0, 0.9)'
            }}
          >
            Welcome to COW
          </h1>
          <p className="text-sm sm:text-base leading-relaxed px-4 max-w-md mx-auto text-readable" style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 400,
            color: 'rgba(0, 0, 0, 0.7)'
          }}>
            Please select your location to continue to the platform
          </p>
        </div>

        {/* Country Selector */}
        <div className="relative mb-6 sm:mb-8">
          <div
            className={`relative cursor-pointer transition-all duration-300 ${
              isDropdownOpen ? 'ring-1 ring-blue-200' : ''
            }`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <div className="flex items-center justify-between p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  {selectedCountry ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selectedCountry.flag}</span>
                      <div>
                        <div className="font-medium text-sm sm:text-base" style={{
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                          color: 'rgba(0, 0, 0, 0.9)',
                          fontWeight: 500
                        }}>{selectedCountry.name}</div>
                        <div className="text-xs sm:text-sm" style={{
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                          color: 'rgba(0, 0, 0, 0.6)',
                          fontWeight: 400
                        }}>
                          {selectedCountry.currency} • {selectedCountry.language}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm sm:text-base" style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                      color: 'rgba(0, 0, 0, 0.5)',
                      fontWeight: 400
                    }}>Select your country</div>
                  )}
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} />
            </div>
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50"
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                maxHeight: '300px',
                overflowY: 'auto',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
              }}
            >
              {/* Search */}
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base focus:outline-none"
                  style={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    color: 'rgba(0, 0, 0, 0.9)',
                    fontWeight: 400
                  }}
                />
              </div>

              {/* Countries List */}
              <div className="py-2">
                {filteredCountries.map((country) => (
                  <div
                    key={country.code}
                    className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleCountrySelect(country)}
                  >
                    <span className="text-xl">{country.flag}</span>
                    <div className="flex-1">
                      <div className="text-sm sm:text-base font-medium" style={{
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                        color: 'rgba(0, 0, 0, 0.9)',
                        fontWeight: 500
                      }}>{country.name}</div>
                      <div className="text-xs sm:text-sm" style={{
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                        color: 'rgba(0, 0, 0, 0.6)',
                        fontWeight: 400
                      }}>
                        {country.currency} • {country.language}
                      </div>
                    </div>
                    {selectedCountry?.code === country.code && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm" style={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    color: 'rgba(0, 0, 0, 0.5)',
                    fontWeight: 400
                  }}>
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
          className={`w-full py-3 sm:py-4 text-sm sm:text-base transition-all duration-300 ${
            selectedCountry
              ? 'shadow-lg hover:scale-105'
              : 'cursor-not-allowed'
          }`}
          style={{
            background: selectedCountry
              ? 'rgba(0, 122, 255, 1)'
              : 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: selectedCountry ? '1px solid rgba(0, 122, 255, 1)' : '1px solid rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            fontWeight: '500',
            letterSpacing: '0.01em',
            color: selectedCountry ? 'white' : 'rgba(0, 0, 0, 0.7)'
          }}
        >
          <span className="flex items-center justify-center gap-2">
            Continue
            <ArrowRight className={`w-4 h-4 transition-transform ${
              selectedCountry ? 'group-hover:translate-x-1' : ''
            }`} />
          </span>
        </Button>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm leading-relaxed px-4 max-w-sm mx-auto" style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            color: 'rgba(0, 0, 0, 0.6)',
            fontWeight: 400
          }}>
            Your location helps us provide relevant pricing, regulatory information, and language preferences.
          </p>
        </div>
        </div>
      </div>
    </div>
  )
}