import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CountrySelector, Country } from "../components/country-selector-fixed"

export default function CountrySelectionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)

  // Restore state from URL parameters if available
  useEffect(() => {
    const countryCode = searchParams.get('country')
    const countryName = searchParams.get('countryName')
    const currency = searchParams.get('currency')

    if (countryCode && countryName && currency) {
      setSelectedCountry({
        code: countryCode,
        name: countryName,
        currency: currency,
        language: searchParams.get('language') || 'English',
        region: searchParams.get('region') || 'Unknown'
      })
    }
  }, [searchParams])

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
  }

  const handleCountryContinue = () => {
    if (selectedCountry) {
      // Navigate to investor classification page with country data
      const params = new URLSearchParams({
        country: selectedCountry.code,
        countryName: selectedCountry.name,
        currency: selectedCountry.currency,
        language: selectedCountry.language,
        region: selectedCountry.region
      })

      navigate(`/onboarding/investor-classification?${params.toString()}`)
    }
  }

  return (
    <CountrySelector
      onCountrySelect={handleCountrySelect}
      onContinue={handleCountryContinue}
    />
  )
}