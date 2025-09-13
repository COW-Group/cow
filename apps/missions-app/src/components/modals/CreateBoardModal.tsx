import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Share } from 'lucide-react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { CreateBoardRequest, PrivacyType, ManagementType } from '../../types/board.types';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBoardRequest) => void;
}

interface FormData extends CreateBoardRequest {
  customManagementType?: string;
}

const privacyOptions = [
  {
    value: 'main' as PrivacyType,
    label: 'Main',
    description: 'Visible to everyone in your account'
  },
  {
    value: 'private' as PrivacyType,
    label: 'Private',
    description: 'Only you can see this board'
  },
  {
    value: 'shareable' as PrivacyType,
    label: 'Shareable',
    description: 'Anyone with the link can view',
    icon: Share
  }
];

const managementOptions = [
  { value: 'items' as ManagementType, label: 'Items' },
  { value: 'budgets' as ManagementType, label: 'Budgets' },
  { value: 'employees' as ManagementType, label: 'Employees' },
  { value: 'campaigns' as ManagementType, label: 'Campaigns' },
  { value: 'leads' as ManagementType, label: 'Leads' },
  { value: 'projects' as ManagementType, label: 'Projects' },
  { value: 'creatives' as ManagementType, label: 'Creatives' },
  { value: 'clients' as ManagementType, label: 'Clients' },
  { value: 'tasks' as ManagementType, label: 'Tasks' },
  { value: 'custom' as ManagementType, label: 'Custom' }
];

export function CreateBoardModal({ isOpen, onClose, onSubmit }: CreateBoardModalProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: 'New Board',
      privacy: 'main',
      managementType: 'items'
    }
  });

  const watchedManagementType = watch('managementType');

  React.useEffect(() => {
    setShowCustomInput(watchedManagementType === 'custom');
  }, [watchedManagementType]);

  const onFormSubmit = (data: FormData) => {
    const submitData: CreateBoardRequest = {
      name: data.name,
      privacy: data.privacy,
      managementType: data.managementType,
      ...(data.managementType === 'custom' && data.customManagementType && {
        customManagementType: data.customManagementType
      })
    };
    onSubmit(submitData);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    setShowCustomInput(false);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md md:max-w-lg transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white">
                    Create board
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-300 p-1"
                    onClick={handleClose}
                    aria-label="Close modal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                  {/* Board Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      Board name
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Board name is required' })}
                      className="w-full px-3 py-2 border border-gray-600 dark:border-gray-700 rounded bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="New Board"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Privacy */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-3">
                      Privacy
                    </label>
                    <div className="space-y-3">
                      {privacyOptions.map((option) => (
                        <div key={option.value} className="flex items-start">
                          <input
                            type="radio"
                            id={`privacy-${option.value}`}
                            value={option.value}
                            {...register('privacy')}
                            className="mt-1 h-4 w-4 border-gray-600 text-teal-500 focus:ring-teal-500"
                          />
                          <div className="ml-3 flex-1">
                            <label htmlFor={`privacy-${option.value}`} className="flex items-center">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {option.label}
                              </span>
                              {option.icon && (
                                <option.icon className="ml-2 h-4 w-4 text-gray-400" />
                              )}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Management Type */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-3">
                      Select what you're managing in this board
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {managementOptions.map((option) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            id={`management-${option.value}`}
                            value={option.value}
                            {...register('managementType')}
                            className="h-4 w-4 border-gray-600 text-teal-500 focus:ring-teal-500"
                          />
                          <label
                            htmlFor={`management-${option.value}`}
                            className="ml-3 text-sm text-gray-900 dark:text-white cursor-pointer"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    {/* Custom Management Type Input */}
                    {showCustomInput && (
                      <div className="mt-3">
                        <input
                          type="text"
                          {...register('customManagementType', {
                            required: watchedManagementType === 'custom' ? 'Custom type is required' : false
                          })}
                          className="w-full px-3 py-2 border border-gray-600 dark:border-gray-700 rounded bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Enter custom type"
                        />
                        {errors.customManagementType && (
                          <p className="mt-1 text-xs text-red-500">{errors.customManagementType.message}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded transition-colors"
                    >
                      Create Board
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}