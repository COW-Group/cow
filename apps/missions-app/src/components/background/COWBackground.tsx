/**
 * COW Sumi-e Sky + Earth Background Component
 * Replaces Vanta.js with static COW brand gradient
 * Based on COW Communications Brand Guidelines v3.0
 */

export function COWBackground() {
  return (
    <div className="absolute inset-0">
      {/* COW Navy Gradient - Dark Mode Default */}
      <div
        className="absolute inset-0 dark:opacity-100 opacity-0 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to bottom, #0a1628 0%, #0f1d2e 50%, #0a1628 100%)',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* COW Light Gradient - Rice Paper + Earth */}
      <div
        className="absolute inset-0 dark:opacity-0 opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(180deg, #E8F4F8 0%, #F5F3F0 60%, #C9B8A8 100%)',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Subtle Earth Horizon Line - Visible in Dark Mode Only */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px dark:opacity-20 opacity-0 transition-opacity duration-300"
        style={{
          background: '#9B8B7E' // Warm Stone
        }}
      />
    </div>
  );
}

/**
 * Hero Background for Landing Pages
 * Enhanced with cyan sky accent
 */
export function COWHeroBackground() {
  return (
    <div className="absolute inset-0">
      {/* Dark Mode - Navy with Cyan Accent */}
      <div
        className="absolute inset-0 dark:opacity-100 opacity-0 transition-opacity duration-300"
        style={{
          background: `
            linear-gradient(135deg,
              rgba(10, 22, 40, 0.95) 0%,
              rgba(15, 29, 46, 0.98) 50%,
              rgba(10, 22, 40, 0.95) 100%
            ),
            radial-gradient(circle at 50% 0%,
              rgba(14, 165, 233, 0.1) 0%,
              transparent 50%
            )
          `,
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Light Mode - Sky to Earth Gradient */}
      <div
        className="absolute inset-0 dark:opacity-0 opacity-100 transition-opacity duration-300"
        style={{
          background: `
            linear-gradient(180deg,
              #E8F4F8 0%,      /* Sky wash */
              #F5F3F0 50%,     /* Rice paper */
              #C9B8A8 100%     /* Soft clay horizon */
            ),
            radial-gradient(circle at 50% 0%,
              rgba(0, 165, 207, 0.08) 0%,
              transparent 60%
            )
          `,
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Subtle overlay for depth */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 dark:to-black/20"
      />
    </div>
  );
}
