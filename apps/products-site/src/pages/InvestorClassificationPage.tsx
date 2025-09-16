import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { InvestorClassificationApple, InvestorClassification } from "../components/investor-classification-apple"
import { Country } from "../components/country-selector-fixed"

export default function InvestorClassificationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)

  // Restore country from URL parameters
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
    } else {
      // Redirect to country selection if no country data
      navigate('/onboarding/country-selection')
    }
  }, [searchParams, navigate])

  const handleInvestorClassificationSelect = (classification: InvestorClassification) => {
    if (!selectedCountry) return

    // Create URL parameters with both country and classification data
    const params = new URLSearchParams({
      country: selectedCountry.code,
      countryName: selectedCountry.name,
      currency: selectedCountry.currency,
      language: selectedCountry.language,
      region: selectedCountry.region,
      classificationId: classification.id,
      classificationTitle: classification.title,
      minimumInvestment: classification.minimumInvestment
    })

    // Skip user type selection for institutional investors, go directly to dashboard
    if (classification.id === 'institutional' || classification.id === 'sovereign-wealth') {
      navigate(`/dashboard/institutional?${params.toString()}`)
    } else {
      // Go to user type selection for individual investors
      navigate(`/onboarding/user-type?${params.toString()}`)
    }
  }

  const handleBackToCountrySelection = () => {
    navigate('/onboarding/country-selection')
  }

  if (!selectedCountry) {
    return <div>Loading...</div>
  }

  return (
    <InvestorClassificationApple
      selectedCountry={selectedCountry}
      onClassificationSelect={handleInvestorClassificationSelect}
      onBack={handleBackToCountrySelection}
    />
  )
}