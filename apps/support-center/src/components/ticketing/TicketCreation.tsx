import React, { useState } from 'react';
import {
  PaperClipIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

interface TicketFormData {
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  attachments: File[];
}

const categories = [
  { id: 'account', name: 'Account & Authentication', icon: QuestionMarkCircleIcon },
  { id: 'trading', name: 'Token Trading', icon: WrenchScrewdriverIcon },
  { id: 'tokenization', name: 'Company Tokenization', icon: InformationCircleIcon },
  { id: 'compliance', name: 'Compliance & Legal', icon: ExclamationTriangleIcon },
  { id: 'technical', name: 'Technical Issues', icon: WrenchScrewdriverIcon },
  { id: 'billing', name: 'Billing & Payments', icon: InformationCircleIcon },
  { id: 'other', name: 'Other', icon: QuestionMarkCircleIcon }
];

const priorities = [
  { 
    id: 'low', 
    name: 'Low', 
    description: 'General questions, non-urgent requests',
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  },
  { 
    id: 'medium', 
    name: 'Medium', 
    description: 'Standard support requests',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  { 
    id: 'high', 
    name: 'High', 
    description: 'Issues affecting your ability to trade or access funds',
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  { 
    id: 'urgent', 
    name: 'Urgent', 
    description: 'Critical issues requiring immediate attention',
    color: 'bg-red-100 text-red-800 border-red-200'
  }
];

interface TicketCreationProps {
  onSubmit: (ticket: TicketFormData) => void;
  onCancel: () => void;
}

const TicketCreation: React.FC<TicketCreationProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<TicketFormData>({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
    attachments: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const selectedCategory = categories.find(c => c.id === formData.category);
  const selectedPriority = priorities.find(p => p.id === formData.priority);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Support Ticket</h2>
          <p className="mt-1 text-sm text-gray-600">
            Provide detailed information about your issue to help us assist you better.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.subject ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Brief description of your issue"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className={`relative flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    formData.category === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={formData.category === category.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="sr-only"
                  />
                  <category.icon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </label>
              ))}
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {priorities.map((priority) => (
                <label
                  key={priority.id}
                  className={`relative flex flex-col p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    formData.priority === priority.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority.id}
                    checked={formData.priority === priority.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' }))}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priority.color}`}>
                      {priority.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">{priority.description}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Please provide as much detail as possible about your issue, including:
• Steps you took before the issue occurred
• Error messages you received
• What you expected to happen
• Your account information (if relevant)
• Any other relevant details"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.description.length} characters (minimum 10 required)
            </p>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500 font-medium">
                    Upload files
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOC, TXT, PNG, JPG up to 10MB each
              </p>
            </div>

            {/* Attachment List */}
            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <PaperClipIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {(selectedCategory || selectedPriority) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Ticket Summary</h3>
              <div className="space-y-1 text-sm text-gray-600">
                {selectedCategory && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Category:</span>
                    <span>{selectedCategory.name}</span>
                  </div>
                )}
                {selectedPriority && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Priority:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${selectedPriority.color}`}>
                      {selectedPriority.name}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Expected Response Time:</span>
                  <span>
                    {formData.priority === 'urgent' ? 'Within 1 hour' :
                     formData.priority === 'high' ? 'Within 4 hours' :
                     formData.priority === 'medium' ? 'Within 24 hours' :
                     'Within 48 hours'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketCreation;