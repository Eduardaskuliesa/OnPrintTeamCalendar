import { LucideIcon } from 'lucide-react';
import React from 'react';

interface StatCardProps {
  title: string | React.ReactNode;
  value: string | number | React.ReactNode;
  subtitle: string | React.ReactNode;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  textColor: string;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  textColor,
}: StatCardProps) => (
  <div className="bg-[#fefaf6] p-6 rounded-2xl shadow-md">
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-lg font-semibold text-db">{title}</h3>
      <div className={`${iconBg} p-2 rounded-lg`}>
        <Icon className={iconColor} size={20} />
      </div>
    </div>
    <div className="flex items-baseline space-x-1">
      <div className={`text-3xl font-bold ${textColor}`}>{value}</div>
    </div>
    {subtitle && (
      <div className="text-sm font-medium text-db mt-1">{subtitle}</div>
    )}
  </div>
);

export default StatCard;