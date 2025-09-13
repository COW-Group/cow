import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import CompanyManagement from './pages/companies/CompanyManagement';
import InvestorOversight from './pages/investors/InvestorOversight';
import TradingOversight from './pages/trading/TradingOversight';
import ComplianceAdmin from './pages/compliance/ComplianceAdmin';
import StaffManagement from './pages/staff/StaffManagement';
import SystemAdmin from './pages/system/SystemAdmin';
import BlockchainAdmin from './pages/blockchain/BlockchainAdmin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/companies/*" element={
            <ProtectedRoute>
              <Layout>
                <CompanyManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/investors/*" element={
            <ProtectedRoute>
              <Layout>
                <InvestorOversight />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/trading/*" element={
            <ProtectedRoute>
              <Layout>
                <TradingOversight />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/compliance/*" element={
            <ProtectedRoute>
              <Layout>
                <ComplianceAdmin />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/staff/*" element={
            <ProtectedRoute>
              <Layout>
                <StaffManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/system/*" element={
            <ProtectedRoute>
              <Layout>
                <SystemAdmin />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/blockchain/*" element={
            <ProtectedRoute>
              <Layout>
                <BlockchainAdmin />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;