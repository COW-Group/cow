/**
 * Sumi-e Sky + Earth Research Hero Background
 * Inspired by East Asian ink painting (sumi-e) aesthetic
 * Where cyan sky meets earth, knowledge grows
 */

export function ResearchHeroBackground() {
  return (
    <>
      {/* Light Mode: Sumi-e Ink on Rice Paper */}
      <div className="absolute inset-0 dark:hidden">
        {/* Base: Warm Rice Paper */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #F5F3F0 0%, rgba(0, 102, 255, 0.03) 100%)'
          }}
        />

        {/* Sky: Deep Cyan to Sky Blue gradient (logo colors) */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(0, 102, 255, 0.15) 0%, rgba(56, 189, 248, 0.12) 40%, transparent 70%)',
            animation: 'breathe 8s ease-in-out infinite'
          }}
        />

        {/* Emerald Life Accent - Knowledge Growing */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.08) 0%, transparent 50%)'
          }}
        />

        {/* Earth Grounding - Warm Stone horizon */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3"
          style={{
            background: 'linear-gradient(to top, rgba(155, 139, 126, 0.12) 0%, transparent 100%)'
          }}
        />
      </div>

      {/* Dark Mode: Luminous Ink in Night Sky */}
      <div className="hidden dark:block absolute inset-0">
        {/* Base: Navy Deep (family's favorite!) */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #0a1628 0%, #0f1d2e 50%, #0a1628 100%)'
          }}
        />

        {/* Luminous Deep Cyan Sky */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(0, 102, 255, 0.25) 0%, rgba(56, 189, 248, 0.15) 40%, transparent 70%)',
            animation: 'breathe 8s ease-in-out infinite'
          }}
        />

        {/* Sky Blue Shimmer */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at top left, rgba(56, 189, 248, 0.12) 0%, transparent 50%)',
            animation: 'shimmer 10s ease-in-out infinite'
          }}
        />

        {/* Emerald Knowledge Glow */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.1) 0%, transparent 60%)'
          }}
        />

        {/* Subtle Earth Horizon */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/4"
          style={{
            background: 'linear-gradient(to top, rgba(155, 139, 126, 0.08) 0%, transparent 100%)'
          }}
        />
      </div>

      {/* Animated CSS */}
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </>
  )
}
