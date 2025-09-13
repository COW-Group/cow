import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Company {
  id: string;
  name: string;
  symbol: string;
  industry: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  totalValue: string;
  tokensIssued: string;
  registrationDate: string;
  compliance: {
    kyc: boolean;
    financials: boolean;
    legal: boolean;
  };
}

const companies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    symbol: 'TECH',
    industry: 'Technology',
    status: 'approved',
    totalValue: '$45.2M',
    tokensIssued: '1,000,000',
    registrationDate: '2024-01-15',
    compliance: { kyc: true, financials: true, legal: true }
  },
  {
    id: '2',
    name: 'GreenEnergy Co.',
    symbol: 'GREEN',
    industry: 'Renewable Energy',
    status: 'approved',
    totalValue: '$32.8M',
    tokensIssued: '750,000',
    registrationDate: '2024-02-20',
    compliance: { kyc: true, financials: true, legal: true }
  },
  {
    id: '3',
    name: 'FinTech Solutions',
    symbol: 'FIN',
    industry: 'Financial Services',
    status: 'under_review',
    totalValue: '$28.5M',
    tokensIssued: '500,000',
    registrationDate: '2024-03-10',
    compliance: { kyc: true, financials: false, legal: true }
  },
  {
    id: '4',
    name: 'Healthcare Innovations',
    symbol: 'HEALTH',
    industry: 'Healthcare',
    status: 'pending',
    totalValue: '$15.0M',
    tokensIssued: '300,000',
    registrationDate: '2024-03-25',
    compliance: { kyc: false, financials: false, legal: false }
  }
];

const CompanyManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: Company['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'under_review':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Company['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage registered companies and their tokenization status
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#627EEA] hover:bg-[#4C63D2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
          Add Company
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="under_review">Under Review</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Companies table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredCompanies.map((company) => (
            <li key={company.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BuildingOfficeIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {company.name}
                        </p>
                        <span className="ml-2 text-sm text-gray-500">({company.symbol})</span>
                      </div>
                      <p className="text-sm text-gray-500">{company.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{company.totalValue}</p>
                      <p className="text-sm text-gray-500">{company.tokensIssued} tokens</p>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(company.status)}
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          company.status
                        )}`}
                      >
                        {company.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Registered: {new Date(company.registrationDate).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>Compliance: </span>
                    <div className="ml-2 flex space-x-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        company.compliance.kyc ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        KYC
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        company.compliance.financials ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        Financials
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        company.compliance.legal ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        Legal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompanyManagement;