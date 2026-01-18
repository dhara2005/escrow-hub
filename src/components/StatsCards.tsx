import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Escrow, EscrowStatus } from '@/types/escrow';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface StatsCardsProps {
  escrows: Escrow[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ escrows }) => {
  const stats = [
    {
      label: 'Total Escrows',
      value: escrows.length,
      icon: FileText,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      label: 'In Progress',
      value: escrows.filter((e) => e.status === EscrowStatus.InProgress).length,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Completed',
      value: escrows.filter(
        (e) => e.status === EscrowStatus.Released || e.status === EscrowStatus.Completed
      ).length,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Disputed',
      value: escrows.filter((e) => e.status === EscrowStatus.Disputed).length,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
