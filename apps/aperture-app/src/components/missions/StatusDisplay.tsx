import React from 'react';
import { MissionStatus } from '../../types/mission.types';

interface StatusDisplayProps {
  status: MissionStatus;
}

// Color function like in the video
function getStatusColor(status: MissionStatus): string {
  switch (status) {
    case 'done':
      return 'rgb(186, 255, 201)'; // Green
    case 'working_on_it':
      return 'rgb(255, 223, 186)'; // Orange
    case 'stuck':
      return 'rgb(255, 179, 186)'; // Red
    case 'not_started':
      return 'rgb(186, 225, 255)'; // Blue
    case 'cancelled':
      return 'rgb(200, 200, 200)'; // Gray
    default:
      return 'rgb(186, 225, 255)'; // Default blue
  }
}

function getStatusText(status: MissionStatus): string {
  switch (status) {
    case 'done':
      return 'Done';
    case 'working_on_it':
      return 'Working on it';
    case 'stuck':
      return 'Stuck';
    case 'not_started':
      return 'Not Started';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
}

export function StatusDisplay({ status }: StatusDisplayProps) {
  return (
    <div className="status-display flex justify-center">
      <div
        className="px-3 py-1 rounded-full text-black font-medium text-sm min-w-24 text-center"
        style={{ backgroundColor: getStatusColor(status) }}
      >
        {getStatusText(status)}
      </div>
    </div>
  );
}