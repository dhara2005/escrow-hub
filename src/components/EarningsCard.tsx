import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowDownToLine, Loader2 } from 'lucide-react';

interface EarningsCardProps {
  earnings: string;
  onWithdraw: () => void;
  isLoading: boolean;
}

export const EarningsCard: React.FC<EarningsCardProps> = ({
  earnings,
  onWithdraw,
  isLoading,
}) => {
  const earningsInEth = (parseFloat(earnings) / 1e18).toFixed(4);
  const hasEarnings = parseFloat(earnings) > 0;

  return (
    <Card className="glass-card border-success/20 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent pointer-events-none" />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Wallet className="h-4 w-4 text-success" />
          Available Earnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-success">{earningsInEth}</div>
            <div className="text-sm text-muted-foreground">ETH</div>
          </div>
          <Button
            onClick={onWithdraw}
            disabled={!hasEarnings || isLoading}
            className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowDownToLine className="h-4 w-4" />
            )}
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
