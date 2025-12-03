import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  colorClass: string;
  textColorClass: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subValue, icon: Icon, colorClass, textColorClass }) => {
  return (
    <div className={`p-4 rounded-xl border ${colorClass} bg-white shadow-sm transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className={`p-2 rounded-full bg-opacity-10 ${colorClass.replace('border', 'bg')}`}>
          <Icon size={18} className={textColorClass} />
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`text-2xl font-bold ${textColorClass}`}>{value}</span>
        {subValue && <span className="text-xs text-gray-400 mt-1">{subValue}</span>}
      </div>
    </div>
  );
};