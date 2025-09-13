import React, { useState } from 'react';
import {
  UserIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface Investor {
  id: string;
  name: string;
  email: string;
  type: 'individual' | 'institutional' | 'accredited';
  kycStatus: 'approved' | 'pending' | 'rejected' | 'under_review';
  amlStatus: 'approved' | 'pending' | 'rejected' | 'flagged';
  totalInvestment: string;
  portfolioValue: string;
  joinDate: string;
  lastActivity: string;
  riskScore: 'low' | 'medium' | 'high';
  country: string;
}

const investors: Investor[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    type: 'accredited',
    kycStatus: 'approved',
    amlStatus: 'approved',
    totalInvestment: '$125,000',
    portfolioValue: '$143,750',
    joinDate: '2024-01-15',
    lastActivity: '2 hours ago',
    riskScore: 'low',
    country: 'USA'
  },
  {
    id: '2',
    name: 'Investment Partners LLC',
    email: 'contact@investmentpartners.com',
    type: 'institutional',
    kycStatus: 'approved',
    amlStatus: 'approved',
    totalInvestment: '$2,500,000',
    portfolioValue: '$2,875,000',
    joinDate: '2024-01-20',
    lastActivity: '1 day ago',
    riskScore: 'low',
    country: 'USA'
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    type: 'individual',
    kycStatus: 'under_review',
    amlStatus: 'pending',
    totalInvestment: '$50,000',
    portfolioValue: '$52,500',
    joinDate: '2024-03-10',
    lastActivity: '5 hours ago',
    riskScore: 'medium',
    country: 'Canada'
  },
  {
    id: '4',
    name: 'Marcus Chen',
    email: 'marcus.chen@email.com',
    type: 'accredited',
    kycStatus: 'approved',
    amlStatus: 'flagged',
    totalInvestment: '$75,000',
    portfolioValue: '$71,250',
    joinDate: '2024-02-28',
    lastActivity: '3 days ago',
    riskScore: 'high',
    country: 'Singapore'
  }
];

const InvestorOversight: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || investor.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
                         investor.kycStatus === statusFilter || 
                         investor.amlStatus === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'flagged':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'under_review':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'flagged':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Investor Oversight</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor investor KYC/AML status and compliance requirements
        </p>
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
                placeholder="Search investors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="individual">Individual</option>
              <option value="accredited">Accredited</option>
              <option value="institutional">Institutional</option>
            </select>
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
              <option value="flagged">Flagged</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Investors table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredInvestors.map((investor) => (
            <li key={investor.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {investor.name}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          investor.type === 'institutional' ? 'bg-purple-100 text-purple-800' :
                          investor.type === 'accredited' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {investor.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{investor.email}</p>
                      <p className="text-sm text-gray-500">{investor.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{investor.portfolioValue}</p>
                      <p className="text-sm text-gray-500">Total invested: {investor.totalInvestment}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center">
                        {getStatusIcon(investor.kycStatus)}
                        <span
                          className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            investor.kycStatus
                          )}`}
                        >
                          KYC: {investor.kycStatus}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(investor.amlStatus)}
                        <span
                          className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            investor.amlStatus
                          )}`}
                        >
                          AML: {investor.amlStatus}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(
                          investor.riskScore
                        )}`}
                      >
                        {investor.riskScore} risk
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <DocumentTextIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Joined: {new Date(investor.joinDate).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>Last activity: {investor.lastActivity}</span>
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

export default InvestorOversight;