import React, { useEffect } from 'react';
import { useMaunAppsStore } from '../../store/maun-apps.store';
import { useAppStore } from '../../store';

// App Components (placeholders for now, will implement actual components next)
import { DashboardApp } from './apps/DashboardApp';
import { FocusModeApp } from './apps/FocusModeApp';
import { EmotionalApp } from './apps/EmotionalApp';
import { HabitsApp } from './apps/HabitsApp';
import { JournalApp } from './apps/JournalApp';
import { VisionBoardApp } from './apps/VisionBoardApp';
import { HealthApp } from './apps/HealthApp';
import { WealthApp } from './apps/WealthApp';
import { SalesApp } from './apps/SalesApp';
import { SocialApp } from './apps/SocialApp';
import { EmailApp } from './apps/EmailApp';
import { DriveApp } from './apps/DriveApp';

const AppComponents = {
  'DashboardApp': DashboardApp,
  'FocusModeApp': FocusModeApp,
  'EmotionalApp': EmotionalApp,
  'HabitsApp': HabitsApp,
  'JournalApp': JournalApp,
  'VisionBoardApp': VisionBoardApp,
  'HealthApp': HealthApp,
  'WealthApp': WealthApp,
  'SalesApp': SalesApp,
  'SocialApp': SocialApp,
  'EmailApp': EmailApp,
  'DriveApp': DriveApp,
} as const;

export function MaunAppLauncher() {
  const { activeApp, appContext, closeApp, getAppById, incrementUsage } = useMaunAppsStore();
  const { closeModal } = useAppStore();

  useEffect(() => {
    if (activeApp) {
      incrementUsage(activeApp);
    }
  }, [activeApp, incrementUsage]);

  if (!activeApp || !appContext) {
    return null;
  }

  const app = getAppById(activeApp);
  if (!app || !app.isInstalled || !app.isEnabled) {
    return null;
  }

  const AppComponent = AppComponents[app.component as keyof typeof AppComponents];
  if (!AppComponent) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">App Not Available</h3>
        <p className="text-gray-600">
          The {app.name} app is not yet implemented.
        </p>
      </div>
    );
  }

  const handleClose = () => {
    closeApp();
    closeModal();
  };

  return (
    <div className="w-full h-full">
      <AppComponent
        context={{
          ...appContext,
          onClose: handleClose
        }}
      />
    </div>
  );
}