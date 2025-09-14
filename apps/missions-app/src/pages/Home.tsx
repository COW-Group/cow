import React, { useState } from 'react';
import { HomeDashboard } from '../components/home/HomeDashboard';
import { CustomizableHomePage } from '../components/home/CustomizableHomePage';
import { Button } from '../components/ui/Button';
import { Settings, Layout } from 'lucide-react';

export function Home() {
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
            Classic View
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
          Customizable View
        </Button>
      </div>

      <HomeDashboard />
    </div>
  );
}