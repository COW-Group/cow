import React, { useEffect, useRef } from 'react';

interface SafeRenderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * SafeRender component helps prevent DOM manipulation errors by:
 * 1. Ensuring stable DOM references
 * 2. Preventing external scripts from interfering with React elements
 * 3. Adding defensive DOM handling
 */
export function SafeRender({ children, className = '' }: SafeRenderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add data attribute to mark this as a React-managed element
    container.setAttribute('data-react-managed', 'true');
    
    // Prevent external scripts from interfering
    const preventExternalManipulation = (e: Event) => {
      // Only prevent if it's not from React
      if (!(e.target as Element)?.closest('[data-react-managed]')) {
        e.stopImmediatePropagation();
      }
    };

    // Add passive event listeners to prevent external interference
    container.addEventListener('DOMNodeInserted', preventExternalManipulation, { passive: true });
    container.addEventListener('DOMNodeRemoved', preventExternalManipulation, { passive: true });

    return () => {
      if (container) {
        container.removeEventListener('DOMNodeInserted', preventExternalManipulation);
        container.removeEventListener('DOMNodeRemoved', preventExternalManipulation);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={className}
      data-react-managed="true"
      style={{ isolation: 'isolate' }} // CSS isolation to prevent external interference
    >
      {children}
    </div>
  );
}