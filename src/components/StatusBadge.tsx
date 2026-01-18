import React from 'react';
import { EscrowStatus, statusLabels, statusColors } from '@/types/escrow';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: EscrowStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <span
      className={cn(
        'status-badge border',
        statusColors[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
};
