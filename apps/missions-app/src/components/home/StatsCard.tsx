import React from 'react';
import { Link } from 'react-router-dom';
import { User, DollarSign, Building, TrendingUp } from 'lucide-react';
import { StatsCardProps } from '../../types/home.types';

const iconMap = {
  User,
  DollarSign, 
  Building,
  TrendingUp
};

export function StatsCard({ 
  label, 
  value, 
  icon, 
  iconColor, 
  bgColor, 
  route, 
  onClick 
}: StatsCardProps) {
  const IconComponent = iconMap[icon];
  
  const cardContent = (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${iconColor}`}>{value}</p>
        </div>
        <div className={`p-2 rounded-full ${bgColor}`}>
          <IconComponent className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  if (route) {
    return (
      <Link to={route} className="block">
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {cardContent}
      </button>
    );
  }

  return cardContent;
}