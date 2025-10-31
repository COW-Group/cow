import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ReportingPage } from './ReportingPage';
import { PortfoliosPage } from './PortfoliosPage';
import { GoalsPage } from './GoalsPage';

export function InsightsPage() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="reporting" replace />} />
      <Route path="/reporting/*" element={<ReportingPage />} />
      <Route path="/portfolios/*" element={<PortfoliosPage />} />
      <Route path="/goals/*" element={<GoalsPage />} />
    </Routes>
  );
}