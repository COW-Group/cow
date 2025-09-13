import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from '../layout/RootLayout';
import { Home } from '../../pages/Home';
import { Dashboard } from '../../pages/Dashboard';
import { MyWork } from '../../pages/MyWork';
import { BoardDetailPage } from '../../pages/BoardDetailPage';
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


export function RouterSetup() {
  return (
    <Routes>
      {/* Root layout with nested routes */}
      <Route path="/" element={<RootLayout />}>
        {/* Home page */}
        <Route index element={<Home />} />
        
        {/* Main pages */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="my-work" element={<MyWork />} />
        
        {/* Mission routes */}
        <Route path="missions" element={<MissionsDashboard />} />
        <Route path="missions/create" element={<MissionPage editMode={false} />} />
        <Route path="missions/:id" element={<MissionPage editMode={true} />} />
        
        {/* Board routes */}
        <Route path="boards" element={<BoardsPage />} />
        <Route path="boards/:boardId" element={<BoardPage />} />
        <Route path="boards/:slug" element={<BoardDetailPage />} />
        <Route path="board-management" element={<BoardManagement />} />
        
        {/* Insights routes */}
        <Route path="insights/*" element={<InsightsPage />} />
        
        
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
        <Route path="insights" element={<div className="p-6"><h1 className="text-2xl font-bold">Insights - Coming Soon</h1></div>} />
        <Route path="projects" element={<div className="p-6"><h1 className="text-2xl font-bold">Projects List - Coming Soon</h1></div>} />
        <Route path="teams" element={<div className="p-6"><h1 className="text-2xl font-bold">Teams - Coming Soon</h1></div>} />
        <Route path="templates" element={<div className="p-6"><h1 className="text-2xl font-bold">Templates - Coming Soon</h1></div>} />
        <Route path="upgrade" element={<div className="p-6"><h1 className="text-2xl font-bold">Upgrade - Coming Soon</h1></div>} />
        <Route path="help" element={<div className="p-6"><h1 className="text-2xl font-bold">Help Center - Coming Soon</h1></div>} />
      </Route>
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/my-work" replace />} />
    </Routes>
  );
}