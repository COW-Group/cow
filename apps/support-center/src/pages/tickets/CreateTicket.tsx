import React from 'react';
import { useNavigate } from 'react-router-dom';
import TicketCreation from '../../components/ticketing/TicketCreation';

const CreateTicket: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (ticketData: {
    subject: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    description: string;
    attachments: File[];
  }) => {
    console.log('Creating ticket:', ticketData);
    // TODO: Submit to API
    navigate('/tickets');
  };

  const handleCancel = () => {
    navigate('/tickets');
  };

  return (
    <div className="p-6">
      <TicketCreation onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default CreateTicket;