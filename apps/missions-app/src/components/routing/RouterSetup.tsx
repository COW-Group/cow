import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from '../layout/RootLayout';
import { PublicLayout } from '../layout/PublicLayout';
import { LandingPage } from '../../pages/LandingPage';
import { MyOffice } from '../../pages/MyOffice';
import { BoardDetailPage } from '../../pages/BoardDetailPage';
import { LatestBoard } from '../../pages/LatestBoard';
import { Goals } from '../../pages/Goals';
import { Portfolios } from '../../pages/Portfolios';
import { Reports } from '../../pages/Reports';
import { BoardManagement } from '../../pages/BoardManagement';
import { MissionsDashboard } from '../../pages/MissionsDashboard';
import { MissionPage } from '../../pages/MissionPage';
import { BoardsPage } from '../../pages/BoardsPage';
import { BoardPage } from '../../pages/BoardPage';
import { SimpleMondayBoard } from '../board/SimpleMondayBoard';
import { FlexibleBoard } from '../board/FlexibleBoard';
import { InsightsPage } from '../../pages/insights/InsightsPage';
import { AgentsPage } from '../../pages/AgentsPage';
import { Settings } from '../../pages/Settings';
import { HelpCenter } from '../../pages/HelpCenter';


export function RouterSetup() {
  return (
    <Routes>
      {/* Public routes without app layout */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
      </Route>

      {/* App routes with full layout */}
      <Route path="/app" element={<RootLayout />}>
        {/* Main pages */}
        <Route index element={<Navigate to="my-office" replace />} />
        <Route path="my-office" element={<MyOffice />} />

        {/* Mission routes */}
        <Route path="missions" element={<MissionsDashboard />} />
        <Route path="missions/create" element={<MissionPage editMode={false} />} />
        <Route path="missions/:id" element={<MissionPage editMode={true} />} />

        {/* Board routes */}
        <Route path="boards" element={<BoardsPage />} />
        <Route path="boards/latest" element={<LatestBoard />} />
        <Route path="boards/:boardId" element={<BoardPage />} />
        <Route path="board-management" element={<BoardManagement />} />

        {/* Insights routes */}
        <Route path="insights/*" element={<InsightsPage />} />

        {/* Agents routes */}
        <Route path="agents/*" element={<AgentsPage />} />


        {/* Monday.com Style Board Demo */}
        <Route path="monday-board" element={<SimpleMondayBoard />} />

        {/* Flexible Board with Monday.com-style flexibility */}
        <Route path="flexible-board" element={<FlexibleBoard />} />

        {/* Other pages */}
        <Route path="goals" element={<Goals />} />
        <Route path="portfolios" element={<Portfolios />} />
        <Route path="reports" element={<Reports />} />

        {/* Placeholder routes */}
        <Route path="inbox" element={<div className="p-6"><h1 className="text-2xl font-bold">Inbox - Coming Soon</h1></div>} />
        <Route path="calendar" element={<div className="p-6"><h1 className="text-2xl font-bold">Calendar - Coming Soon</h1></div>} />
        <Route path="projects" element={<div className="p-6"><h1 className="text-2xl font-bold">Projects List - Coming Soon</h1></div>} />
        <Route path="teams" element={<div className="p-6"><h1 className="text-2xl font-bold">Teams - Coming Soon</h1></div>} />
        <Route path="templates" element={<div className="p-6"><h1 className="text-2xl font-bold">Templates - Coming Soon</h1></div>} />
        <Route path="upgrade" element={<div className="p-6"><h1 className="text-2xl font-bold">Upgrade - Coming Soon</h1></div>} />
        <Route path="help" element={<HelpCenter />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Legacy routes - redirect to app */}
      <Route path="/my-work" element={<Navigate to="/app/my-office" replace />} />
      <Route path="/my-office" element={<Navigate to="/app/my-office" replace />} />
      <Route path="/boards/*" element={<Navigate to="/app/boards" replace />} />
      <Route path="/missions/*" element={<Navigate to="/app/missions" replace />} />
      <Route path="/insights/*" element={<Navigate to="/app/insights" replace />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}