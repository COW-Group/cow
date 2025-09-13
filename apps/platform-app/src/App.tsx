import { Routes, Route } from 'react-router-dom';
import PlatformLayout from './components/layout/PlatformLayout';
import Dashboard from './pages/Dashboard';
import MissionsWorkspace from './pages/MissionsWorkspace';

function App() {
  return (
    <PlatformLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/missions" element={<MissionsWorkspace />} />
        <Route path="/trading" element={<div className="p-6">Trading page coming soon...</div>} />
        <Route path="/portfolio" element={<div className="p-6">Portfolio page coming soon...</div>} />
        <Route path="/companies" element={<div className="p-6">Companies page coming soon...</div>} />
        <Route path="/investors" element={<div className="p-6">Investors page coming soon...</div>} />
        <Route path="/documents" element={<div className="p-6">Documents page coming soon...</div>} />
        <Route path="/settings" element={<div className="p-6">Settings page coming soon...</div>} />
        <Route path="*" element={<div className="p-6">Page not found</div>} />
      </Routes>
    </PlatformLayout>
  );
}

export default App;