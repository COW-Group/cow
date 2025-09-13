import React from 'react';
import { Link } from 'react-router-dom';
import { MissionCard as MissionCardType } from '../../types/mission.types';
import { AvatarDisplay } from './AvatarDisplay';
import { StatusDisplay } from './StatusDisplay';
import { PriorityDisplay } from './PriorityDisplay';
import { ProgressDisplay } from './ProgressDisplay';
import { DeleteBlock } from './DeleteBlock';

interface MissionCardProps {
  mission: MissionCardType;
  color: string;
}

export function MissionCard({ mission, color }: MissionCardProps) {
  return (
    <div className="mission-card flex w-full items-center bg-gray-800 rounded-lg mb-2 p-4 hover:bg-gray-700 transition-colors">
      {/* Color indicator */}
      <div 
        className="mission-color w-4 h-16 rounded mr-4"
        style={{ backgroundColor: color }}
      />
      
      {/* Main content - clickable link */}
      <Link
        to={`/missions/${mission.documentId}`}
        className="flex-1 flex items-center text-white no-underline hover:no-underline"
      >
        {/* Mission title */}
        <div className="flex-1 min-w-64">
          <h3 className="text-lg font-semibold text-white mb-1">{mission.title}</h3>
          <p className="text-sm text-gray-400">{mission.description}</p>
        </div>
        
        {/* Avatar */}
        <div className="mx-4">
          <AvatarDisplay mission={mission} />
        </div>
        
        {/* Status */}
        <div className="mx-4">
          <StatusDisplay status={mission.status} />
        </div>
        
        {/* Priority */}
        <div className="mx-4">
          <PriorityDisplay priority={mission.priority} />
        </div>
        
        {/* Progress */}
        <div className="mx-4">
          <ProgressDisplay progress={mission.progress} />
        </div>
      </Link>
      
      {/* Delete block - outside link so it doesn't trigger navigation */}
      <div className="ml-4">
        <DeleteBlock documentId={mission.id} />
      </div>
    </div>
  );
}