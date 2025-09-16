"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  Target,
  Users,
  BarChart,
  Handshake,
  ShieldQuestion,
  FileText,
  TrendingUp,
  Award,
} from "lucide-react"
import { useState } from "react"

export default function SalesPage() {
  const [showRevenueCard, setShowRevenueCard] = useState(false)
  const [showGoalsCard, setShowGoalsCard] = useState(false)
  const [showCrmCard, setShowCrmCard] = useState(false)
  const [showAnalyticsCard, setShowAnalyticsCard] = useState(false)
  const [showCustomerServicingCard, setShowCustomerServicingCard] = useState(false)
  const [showObjectionHandlingCard, setShowObjectionHandlingCard] = useState(false)
  const [showOfferDocumentationCard, setShowOfferDocumentationCard] = useState(false)
  const [showLicensingCard, setShowLicensingCard] = useState(false) // New state for Licensing card

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <h1 className="text-3xl font-light zen-heading">Sales Dashboard</h1>
            </div>
            <p className="text-lg text-muted-foreground zen-body max-w-2xl mx-auto">
              Track your sales performance and grow your business with intention.
            </p>
          </div>

          {/* Sales Control Bar */}
          <div className="glassmorphism p-4 rounded-lg mb-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              className="zen-control-button"
              onClick={() => setShowRevenueCard(!showRevenueCard)}
              aria-label="Revenue Tracking"
            >
              <DollarSign className="w-5 h-5" />
            </Button>
            <Button
              className="zen-control-button"
              onClick={() => setShowGoalsCard(!showGoalsCard)}
              aria-label="Goal Tracking"
            >
              <Target className="w-5 h-5" />
            </Button>
            <Button className="zen-control-button" onClick={() => setShowCrmCard(!showCrmCard)} aria-label="CRM">
              <Users className="w-5 h-5" />
            </Button>
            <Button
              className="zen-control-button"
              onClick={() => setShowAnalyticsCard(!showAnalyticsCard)}
              aria-label="Analytics"
            >
              <BarChart className="w-5 h-5" />
            </Button>
            <Button
              className="zen-control-button"
              onClick={() => setShowCustomerServicingCard(!showCustomerServicingCard)}
              aria-label="Customer Servicing"
            >
              <Handshake className="w-5 h-5" />
            </Button>
            <Button
              className="zen-control-button"
              onClick={() => setShowObjectionHandlingCard(!showObjectionHandlingCard)}
              aria-label="Objection Handling & Training"
            >
              <ShieldQuestion className="w-5 h-5" />
            </Button>
            <Button
              className="zen-control-button"
              onClick={() => setShowOfferDocumentationCard(!showOfferDocumentationCard)}
              aria-label="Offer Documentation"
            >
              <FileText className="w-5 h-5" />
            </Button>
            {/* New Button for Licensing, Qualifications, and Experience */}
            <Button
              className="zen-control-button"
              onClick={() => setShowLicensingCard(!showLicensingCard)}
              aria-label="Licensing, Qualifications, and Experience"
            >
              <Award className="w-5 h-5" />
            </Button>
          </div>

          {/* Conditional Cards */}
          {showRevenueCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cream-25">
                  <DollarSign className="w-5 h-5" />
                  Revenue Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="text-cream-25">
                <p>Monitor your sales revenue, growth trends, and financial performance.</p>
                {/* Add more revenue tracking components here */}
              </CardContent>
            </Card>
          )}

          {showGoalsCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cream-25">
                  <Target className="w-5 h-5" />
                  Goal Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="text-cream-25">
                <p>Set, track, and achieve your sales targets and objectives.</p>
                {/* Add more goal tracking components here */}
              </CardContent>
            </Card>
          )}

          {showCrmCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cream-25">
                  <Users className="w-5 h-5" />
                  CRM
                </CardTitle>
              </CardHeader>
              <CardContent className="text-cream-25">
                <p>Manage customer relationships, leads, and sales pipelines efficiently.</p>
                {/* Add more CRM components here */}
              </CardContent>
            </Card>
          )}

          {showAnalyticsCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cream-25">
                  <BarChart className="w-5 h-5" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="text-cream-25">
                <p>Gain insights from your sales data with comprehensive analytics.</p>
                {/* Add more analytics components here */}
              </CardContent>
            </Card>
          )}

          {showCustomerServicingCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cream-25">
                  <Handshake className="w-5 h-5" />
                  Customer Servicing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-cream-25">
                <p>Tools and resources for effective customer support and engagement.</p>
                {/* Add more customer servicing components here */}
              </CardContent>
            </Card>
          )}

          {showObjectionHandlingCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cream-25">
                  <ShieldQuestion className="w-5 h-5" />
                  Objection Handling & Training
                </CardTitle>
              </CardHeader>
              <CardContent className="text-cream-25">
                <p>Resources and training for overcoming sales objections.</p>
                {/* Add more objection handling components here */}
              </CardContent>
            </Card>
          )}

          {showOfferDocumentationCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cream-25">
                  <FileText className="w-5 h-5" />
                  Offer Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-cream-25">
                <p>Centralized access to all your sales offers and documentation.</p>
                {/* Add more offer documentation components here */}
              </CardContent>
            </Card>
          )}

          {/* New Card for Licensing, Qualifications, and Experience */}
          {showLicensingCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cream-25">
                  <Award className="w-5 h-5" />
                  Licensing, Qualifications, & Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="text-cream-25">
                <p>Manage and display your professional licenses, qualifications, and experience.</p>
                {/* Add more content for licensing, qualifications, and experience here */}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
