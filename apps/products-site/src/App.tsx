import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CopilotProvider } from './contexts/copilot-context';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import OnboardingPage from './pages/OnboardingPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import CountrySelectionPage from './pages/CountrySelectionPage';
import InvestorClassificationPage from './pages/InvestorClassificationPage';
import UserTypeSelectionPage from './pages/UserTypeSelectionPage';
import InstitutionalDashboardPage from './pages/InstitutionalDashboardPage';
import AccreditedDashboardPage from './pages/AccreditedDashboardPage';
import InternationalDashboardPage from './pages/InternationalDashboardPage';
import RetailDashboardPage from './pages/RetailDashboardPage';
import MissionsPage from './pages/MissionsPage';
import ProductsPage from './pages/ProductsPage';
import AuAeroPage from './pages/AuAeroPage';
import AuAeroWhitepaperPage from './pages/AuAeroWhitepaperPage';
import GoldPage from './pages/GoldPage';
import AuSiriAnimationPage from './pages/AuSiriAnimationPage';
import DairyPage from './pages/DairyPage';
import FoodPage from './pages/FoodPage';
import AuRailPage from './pages/AuRailPage';
import SuraPage from './pages/SuraPage';
import GoldSwimPage from './pages/GoldSwimPage';
import SiriZ31Page from './pages/SiriZ31Page';
import InvestGoldSwimPage from './pages/InvestGoldSwimPage';
import InvestSiriZ31Page from './pages/InvestSiriZ31Page';
import ResearchCentrePage from './pages/ResearchCentrePage';
import ResearchArticlePage from './pages/ResearchArticlePage';
import MooPage from './pages/MooPage';
import CheckoutPage from './pages/CheckoutPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <CopilotProvider>
      <div className="App">
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />
        <Route path="/onboarding/country-selection" element={<CountrySelectionPage />} />
        <Route path="/onboarding/investor-classification" element={<InvestorClassificationPage />} />
        <Route path="/onboarding/user-type" element={<UserTypeSelectionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/institutional" element={<InstitutionalDashboardPage />} />
        <Route path="/dashboard/accredited" element={<AccreditedDashboardPage />} />
        <Route path="/dashboard/international" element={<InternationalDashboardPage />} />
        <Route path="/dashboard/retail" element={<RetailDashboardPage />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/auaero" element={<AuAeroPage />} />
        <Route path="/auaero-whitepaper" element={<AuAeroWhitepaperPage />} />
        <Route path="/gold" element={<GoldPage />} />
        <Route path="/ausiri" element={<GoldPage />} />
        <Route path="/ausiri-animation" element={<AuSiriAnimationPage />} />
        <Route path="/dairy" element={<DairyPage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/aurail" element={<AuRailPage />} />
        <Route path="/sura" element={<SuraPage />} />
        <Route path="/gold-swim" element={<GoldSwimPage />} />
        <Route path="/siriz31" element={<SiriZ31Page />} />
        <Route path="/invest/gold-swim" element={<InvestGoldSwimPage />} />
        <Route path="/invest/siriz31" element={<InvestSiriZ31Page />} />
        <Route path="/research" element={<ResearchCentrePage />} />
        <Route path="/research/:slug" element={<ResearchArticlePage />} />
        <Route path="/moo" element={<MooPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
        }}
      />
      </div>
    </CopilotProvider>
  );
}

export default App;