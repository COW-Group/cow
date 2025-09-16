import { useEffect, useState, useCallback } from 'react';

interface AdaptiveColors {
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textSubtle: string;
  iconPrimary: string;
  iconSecondary: string;
  iconMuted: string;
}

export function useAdaptiveColors() {
  const [colors, setColors] = useState<AdaptiveColors>({
    textPrimary: 'rgba(255, 255, 255, 0.95)',
    textSecondary: 'rgba(255, 255, 255, 0.88)',
    textMuted: 'rgba(255, 255, 255, 0.78)',
    textSubtle: 'rgba(255, 255, 255, 0.68)',
    iconPrimary: 'rgba(255, 255, 255, 0.92)',
    iconSecondary: 'rgba(255, 255, 255, 0.82)',
    iconMuted: 'rgba(255, 255, 255, 0.72)',
  });

  const [backgroundBrightness, setBackgroundBrightness] = useState(0);

  // Function to analyze background brightness
  const analyzeBackgroundBrightness = useCallback(() => {
    try {
      // Create a small canvas to sample the background
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 100;
      canvas.height = 100;

      // Try to capture the background behind the sidebar
      const sidebarElement = document.querySelector('.liquid-glass-sidebar');
      if (!sidebarElement) return;

      const rect = sidebarElement.getBoundingClientRect();

      // Sample multiple points around the sidebar area
      const samplePoints = [
        { x: rect.left - 50, y: rect.top + 50 },
        { x: rect.left - 50, y: rect.top + rect.height / 2 },
        { x: rect.left - 50, y: rect.top + rect.height - 50 },
        { x: rect.right + 50, y: rect.top + 50 },
        { x: rect.right + 50, y: rect.top + rect.height / 2 },
        { x: rect.right + 50, y: rect.top + rect.height - 50 },
      ];

      let totalBrightness = 0;
      let samplesCount = 0;

      // Since we can't directly sample the Vanta.js background,
      // we'll use time-based heuristics to estimate brightness
      const hour = new Date().getHours();

      // Dawn/sunrise (bright)
      if (hour >= 5 && hour < 8) {
        totalBrightness = 0.8; // Bright peach/coral background
      }
      // Morning (medium-bright)
      else if (hour >= 8 && hour < 12) {
        totalBrightness = 0.6; // Light blue background
      }
      // Afternoon (medium)
      else if (hour >= 12 && hour < 17) {
        totalBrightness = 0.5; // Clear blue background
      }
      // Evening (medium-dark)
      else if (hour >= 17 && hour < 20) {
        totalBrightness = 0.4; // Orange/purple sunset
      }
      // Night (dark)
      else {
        totalBrightness = 0.2; // Deep blue/black night
      }

      setBackgroundBrightness(totalBrightness);
    } catch (error) {
      console.log('Background analysis not available, using default colors');
      setBackgroundBrightness(0.3); // Default to darker colors
    }
  }, []);

  // Update colors based on background brightness with Apple sophistication
  useEffect(() => {
    const isDark = backgroundBrightness < 0.5;
    const brightness = backgroundBrightness;

    if (isDark) {
      // Dark background - use light text with sophisticated contrast
      const baseOpacity = Math.max(0.75, 1 - brightness * 0.4);
      const contrastBoost = brightness < 0.3 ? 0.05 : 0; // Extra contrast for very dark backgrounds

      setColors({
        textPrimary: `rgba(255, 255, 255, ${Math.min(0.98, baseOpacity + contrastBoost + 0.23)})`,
        textSecondary: `rgba(255, 255, 255, ${Math.min(0.92, baseOpacity + contrastBoost + 0.17)})`,
        textMuted: `rgba(255, 255, 255, ${Math.min(0.85, baseOpacity + contrastBoost + 0.10)})`,
        textSubtle: `rgba(255, 255, 255, ${Math.min(0.75, baseOpacity + contrastBoost)})`,
        iconPrimary: `rgba(255, 255, 255, ${Math.min(0.95, baseOpacity + contrastBoost + 0.20)})`,
        iconSecondary: `rgba(255, 255, 255, ${Math.min(0.88, baseOpacity + contrastBoost + 0.13)})`,
        iconMuted: `rgba(255, 255, 255, ${Math.min(0.78, baseOpacity + contrastBoost + 0.03)})`,
      });
    } else {
      // Light background - use dark text with enhanced readability
      const baseDarkness = Math.max(0.65, brightness * 1.1);
      const contrastBoost = brightness > 0.7 ? 0.1 : 0; // Extra contrast for very bright backgrounds

      setColors({
        textPrimary: `rgba(0, 0, 0, ${Math.min(0.95, baseDarkness + contrastBoost + 0.30)})`,
        textSecondary: `rgba(0, 0, 0, ${Math.min(0.88, baseDarkness + contrastBoost + 0.23)})`,
        textMuted: `rgba(0, 0, 0, ${Math.min(0.78, baseDarkness + contrastBoost + 0.13)})`,
        textSubtle: `rgba(0, 0, 0, ${Math.min(0.68, baseDarkness + contrastBoost + 0.03)})`,
        iconPrimary: `rgba(0, 0, 0, ${Math.min(0.92, baseDarkness + contrastBoost + 0.27)})`,
        iconSecondary: `rgba(0, 0, 0, ${Math.min(0.85, baseDarkness + contrastBoost + 0.20)})`,
        iconMuted: `rgba(0, 0, 0, ${Math.min(0.75, baseDarkness + contrastBoost + 0.10)})`,
      });
    }
  }, [backgroundBrightness]);

  // Analyze background on mount and set up interval
  useEffect(() => {
    analyzeBackgroundBrightness();

    // Update every 30 seconds to adapt to time-based Vanta changes
    const interval = setInterval(analyzeBackgroundBrightness, 30000);

    // Also update on window resize
    const handleResize = () => {
      setTimeout(analyzeBackgroundBrightness, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [analyzeBackgroundBrightness]);

  // Apply colors to CSS custom properties
  useEffect(() => {
    const sidebarElement = document.querySelector('.liquid-glass-sidebar') as HTMLElement;
    if (sidebarElement) {
      sidebarElement.style.setProperty('--text-primary', colors.textPrimary);
      sidebarElement.style.setProperty('--text-secondary', colors.textSecondary);
      sidebarElement.style.setProperty('--text-muted', colors.textMuted);
      sidebarElement.style.setProperty('--text-subtle', colors.textSubtle);
      sidebarElement.style.setProperty('--icon-primary', colors.iconPrimary);
      sidebarElement.style.setProperty('--icon-secondary', colors.iconSecondary);
      sidebarElement.style.setProperty('--icon-muted', colors.iconMuted);
    }
  }, [colors]);

  return {
    colors,
    backgroundBrightness,
    refreshColors: analyzeBackgroundBrightness,
  };
}