import React from 'react';

interface PriorityDisplayProps {
  priority: number; // 1-5
}

export function PriorityDisplay({ priority }: PriorityDisplayProps) {
  // Create array of 5 stars
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starNumber = index + 1;
    const isActive = priority >= starNumber;
    
    return (
      <span
        key={starNumber}
        className="text-lg mx-1"
        style={{
          color: isActive ? 'rgb(253, 253, 150)' : 'transparent'
        }}
      >
        ★
      </span>
    );
  });

  return (
    <div className="priority-display flex justify-center">
      <div className="star-container flex items-center">
        {stars}
      </div>
    </div>
  );
}