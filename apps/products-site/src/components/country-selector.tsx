import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { ChevronDown, Globe, ArrowRight } from "lucide-react"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Vanta.js Background */}
      <HeroBackground />

      <div className={`relative z-10 w-full max-w-md mx-auto px-8 py-12 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="text-3xl font-light text-white mb-4 tracking-wider" style={{
            textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)'
          }}>
            COW
          </div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-50" />
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-light text-white mb-4 leading-relaxed"
            style={{
              letterSpacing: '0.02em',
              fontFamily: 'Inter, sans-serif',
              textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)'
            }}
          >
            Welcome to COW
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed" style={{
            textShadow: '0 1px 4px rgba(0,0,0,0.5)'
          }}>
            Please select your location to continue to the platform
          </p>
        </div>

        {/* Country Selector */}
        <div className="relative mb-8">
          <div
            className={`relative cursor-pointer transition-all duration-300 ${
              isDropdownOpen ? 'ring-1 ring-white/20' : ''
            }`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <div className="text-left">
                  {selectedCountry ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selectedCountry.flag}</span>
                      <div>
                        <div className="text-white font-medium">{selectedCountry.name}</div>
                        <div className="text-gray-400 text-xs">
                          {selectedCountry.currency} • {selectedCountry.language}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400">Select your country</div>
                  )}
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} />
            </div>
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50"
              style={{
                background: 'rgba(20, 20, 20, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                maxHeight: '300px',
                overflowY: 'auto'
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
          className={`w-full py-4 transition-all duration-300 ${
            selectedCountry
              ? 'text-white shadow-lg hover:scale-105'"
              : 'text-gray-500 cursor-not-allowed'"
          }`}
          style={{
            borderRadius: '8px',
            fontWeight: '400',
            letterSpacing: '0.01em'
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
        <div className="text-center mt-8">
          <p className="text-gray-400 text-xs" style={{
            textShadow: '0 1px 4px rgba(0,0,0,0.5)'
          }}>
            Your location helps us provide relevant pricing,
            <br />
            regulatory information, and language preferences.
          </p>
        </div>
      </div>
    </div>
  )
}