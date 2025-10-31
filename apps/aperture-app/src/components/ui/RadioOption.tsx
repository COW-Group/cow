import React from 'react';
import { LucideIcon } from 'lucide-react';

interface RadioOptionProps {
  id: string;
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  checked: boolean;
  onChange: (value: string) => void;
  name: string;
  disabled?: boolean;
}

export function RadioOption({
  id,
  value,
  label,
  description,
  icon: Icon,
  checked,
  onChange,
  name,
  disabled = false
}: RadioOptionProps) {
  return (
    <div className="flex items-start">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-1 h-4 w-4 border-gray-600 text-teal-500 focus:ring-teal-500 disabled:opacity-50"
      />
      <div className="ml-3 flex-1">
        <label htmlFor={id} className="flex items-center cursor-pointer">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </span>
          {Icon && (
            <Icon className="ml-2 h-4 w-4 text-gray-400" />
          )}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}