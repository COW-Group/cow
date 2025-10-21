import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CopilotProvider } from './contexts/copilot-context';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import OnboardingPage from './pages/OnboardingPage';
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
import AuSiriPage from './pages/AuSiriPage';
import AuSiriAnimationPage from './pages/AuSiriAnimationPage';
import ResearchCentrePage from './pages/ResearchCentrePage';
import ResearchArticlePage from './pages/ResearchArticlePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <CopilotProvider>
      <div className="App">
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
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
        <Route path="/ausiri" element={<AuSiriPage />} />
        <Route path="/ausiri-animation" element={<AuSiriAnimationPage />} />
        <Route path="/research" element={<ResearchCentrePage />} />
        <Route path="/research/:slug" element={<ResearchArticlePage />} />
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