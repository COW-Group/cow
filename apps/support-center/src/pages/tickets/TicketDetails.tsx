import React from 'react';
import { useParams } from 'react-router-dom';

const TicketDetails: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Ticket #{id}</h1>
      <p className="text-gray-600 mt-2">Ticket details will be displayed here</p>
    </div>
  );
};

export default TicketDetails;