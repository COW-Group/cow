import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

interface TimePeriod {
  id: string;
  label: string;
  value: string;
  period: string;
  year?: number;
  isActive?: boolean;
}

interface TimePeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  className?: string;
}

export function TimePeriodSelector({ selectedPeriod, onPeriodChange, className = '' }: TimePeriodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('quarters');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  
  const timePeriods: Record<string, TimePeriod[]> = {
    quarters: [
      { id: 'q1-2024', label: 'Q1', value: 'Q1 2024', period: 'Jan 1 - Mar 31', year: 2024 },
      { id: 'q2-2024', label: 'Q2', value: 'Q2 2024', period: 'Apr 1 - Jun 30', year: 2024, isActive: true },
      { id: 'q3-2024', label: 'Q3', value: 'Q3 2024', period: 'Jul 1 - Sep 30', year: 2024 },
      { id: 'q4-2024', label: 'Q4', value: 'Q4 2024', period: 'Oct 1 - Dec 31', year: 2024 },
      { id: 'q1-2025', label: 'Q1', value: 'Q1 2025', period: 'Jan 1 - Mar 31', year: 2025 },
      { id: 'q2-2025', label: 'Q2', value: 'Q2 2025', period: 'Apr 1 - Jun 30', year: 2025 },
    ],
    halfyears: [
      { id: 'h1-2024', label: 'H1', value: 'H1 2024', period: 'Jan 1 - Jun 30', year: 2024 },
      { id: 'h2-2024', label: 'H2', value: 'H2 2024', period: 'Jul 1 - Dec 31', year: 2024, isActive: true },
      { id: 'h1-2025', label: 'H1', value: 'H1 2025', period: 'Jan 1 - Jun 30', year: 2025 },
      { id: 'h2-2025', label: 'H2', value: 'H2 2025', period: 'Jul 1 - Dec 31', year: 2025 },
    ],
    years: [
      { id: 'y-2023', label: '2023', value: '2023', period: 'Jan 1 - Dec 31', year: 2023 },
      { id: 'y-2024', label: '2024', value: '2024', period: 'Jan 1 - Dec 31', year: 2024, isActive: true },
      { id: 'y-2025', label: '2025', value: '2025', period: 'Jan 1 - Dec 31', year: 2025 },
    ]
  };

  const selectedPeriodData = Object.values(timePeriods).flat().find(p => p.value === selectedPeriod);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePeriodSelect = (period: TimePeriod) => {
    onPeriodChange(period.value);
    setIsOpen(false);
  };

  const groupByYear = (periods: TimePeriod[]) => {
    const groups: Record<number, TimePeriod[]> = {};
    periods.forEach(period => {
      if (period.year) {
        if (!groups[period.year]) groups[period.year] = [];
        groups[period.year].push(period);
      }
    });
    return groups;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        <Calendar className="h-4 w-4" />
        <span>{selectedPeriodData?.value || 'All time'}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
          {/* Header Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'quarters', label: 'Quarters' },
              { id: 'halfyears', label: 'Half-years' },
              { id: 'years', label: 'Years' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 max-h-64 overflow-y-auto">
            {selectedTab === 'quarters' || selectedTab === 'halfyears' ? (
              <div className="space-y-4">
                {Object.entries(groupByYear(timePeriods[selectedTab])).reverse().map(([year, periods]) => (
                  <div key={year}>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      {year}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {periods.map((period) => (
                        <button
                          key={period.id}
                          onClick={() => handlePeriodSelect(period)}
                          className={`text-left p-3 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            selectedPeriod === period.value
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700'
                              : 'border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {period.label}
                            </span>
                            {period.isActive && (
                              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {period.period}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {timePeriods[selectedTab].map((period) => (
                  <button
                    key={period.id}
                    onClick={() => handlePeriodSelect(period)}
                    className={`w-full text-left p-3 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedPeriod === period.value
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700'
                        : 'border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {period.label}
                      </span>
                      {period.isActive && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {period.period}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <button
              onClick={() => handlePeriodSelect({ id: 'all', label: 'All time', value: 'All time', period: '' })}
              className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              All time periods
            </button>
          </div>
        </div>
      )}
    </div>
  );
}