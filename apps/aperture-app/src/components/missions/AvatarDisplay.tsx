import React from 'react';
import { MissionCard } from '../../types/mission.types';

interface AvatarDisplayProps {
  mission: MissionCard;
}

// Blank avatar fallback
const BLANK_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNiAxOC41QzYgMTYuNSA4LjUgMTUgMTIgMTVTMTggMTYuNSAxOCAxOC41IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K';

export function AvatarDisplay({ mission }: AvatarDisplayProps) {
  return (
    <div className="avatar-container flex justify-center w-20">
      <div className="image-container w-12 h-12 rounded-full overflow-hidden border-2 border-gray-600">
        <img
          src={mission.avatar || BLANK_AVATAR}
          alt={`Photo of ${mission.owner}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to blank avatar if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = BLANK_AVATAR;
          }}
        />
      </div>
    </div>
  );
}