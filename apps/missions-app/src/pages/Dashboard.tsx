import React, { useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { CustomizableHomePage } from '../components/home/CustomizableHomePage';
import { Button } from '../components/ui/Button';
import { Settings, Layout } from 'lucide-react';

export function Dashboard() {
  const [useCustomizable, setUseCustomizable] = useState(true);

  if (useCustomizable) {
    return (
      <div className="relative">
        {/* Toggle Button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUseCustomizable(false)}
            className="bg-white shadow-sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Classic Dashboard
          </Button>
        </div>

        <CustomizableHomePage />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setUseCustomizable(true)}
          className="bg-white shadow-sm"
        >
          <Layout className="w-4 h-4 mr-2" />
          Customizable Dashboard
        </Button>
      </div>

      <DashboardLayout />
    </div>
  );
}