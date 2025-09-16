import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { UserTypeSelector, UserType } from "../components/user-type-selector"
import { Country } from "../components/country-selector-fixed"

export default function UserTypeSelectionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [classificationData, setClassificationData] = useState<any>(null)

  // Restore state from URL parameters
  useEffect(() => {
    const countryCode = searchParams.get('country')
    const countryName = searchParams.get('countryName')
    const currency = searchParams.get('currency')
    const classificationId = searchParams.get('classificationId')
    const classificationTitle = searchParams.get('classificationTitle')
    const minimumInvestment = searchParams.get('minimumInvestment')

    if (countryCode && countryName && currency && classificationId) {
      setSelectedCountry({
        code: countryCode,
        name: countryName,
        currency: currency,
        language: searchParams.get('language') || 'English',
        region: searchParams.get('region') || 'Unknown'
      })

      setClassificationData({
        id: classificationId,
        title: classificationTitle,
        minimumInvestment: minimumInvestment
      })
    } else {
      // Redirect to country selection if missing data
      navigate('/onboarding/country-selection')
    }
  }, [searchParams, navigate])

  const handleUserTypeSelect = (userType: UserType) => {
    if (!selectedCountry || !classificationData) return

    // Create comprehensive URL parameters
    const params = new URLSearchParams({
      country: selectedCountry.code,
      countryName: selectedCountry.name,
      currency: selectedCountry.currency,
      language: selectedCountry.language,
      region: selectedCountry.region,
      classificationId: classificationData.id,
      classificationTitle: classificationData.title,
      minimumInvestment: classificationData.minimumInvestment,
      userType: userType.id,
      userTypeTitle: userType.title
    })

    // Navigate to appropriate dashboard based on user type
    switch (userType.id) {
      case 'individual':
        navigate(`/dashboard/retail?${params.toString()}`)
        break
      case 'advisor':
        navigate(`/dashboard/accredited?${params.toString()}`)
        break
      case 'institutional':
        navigate(`/dashboard/institutional?${params.toString()}`)
        break
      default:
        navigate(`/dashboard?${params.toString()}`)
    }
  }

  const handleBackToInvestorClassification = () => {
    if (!selectedCountry) return

    const params = new URLSearchParams({
      country: selectedCountry.code,
      countryName: selectedCountry.name,
      currency: selectedCountry.currency,
      language: selectedCountry.language,
      region: selectedCountry.region
    })

    navigate(`/onboarding/investor-classification?${params.toString()}`)
  }

  if (!selectedCountry || !classificationData) {
    return <div>Loading...</div>
  }

  return (
    <UserTypeSelector
      onUserTypeSelect={handleUserTypeSelect}
      onBack={handleBackToInvestorClassification}
      selectedCountry={selectedCountry}
      selectedClassification={classificationData}
    />
  )
}