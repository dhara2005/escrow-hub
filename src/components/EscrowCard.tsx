import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { Escrow, EscrowStatus } from '@/types/escrow';
import { useWallet } from '@/context/WalletContext';
import {
  Clock,
  User,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  ThumbsUp,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface EscrowCardProps {
  escrow: Escrow;
  onAccept?: (id: number) => void;
  onSubmitWork?: (id: number) => void;
  onApprove?: (id: number) => void;
  onDispute?: (id: number) => void;
  onCancel?: (id: number) => void;
  isLoading?: boolean;
}

export const EscrowCard: React.FC<EscrowCardProps> = ({
  escrow,
  onAccept,
  onSubmitWork,
  onApprove,
  onDispute,
  onCancel,
  isLoading,
}) => {
  const { wallet } = useWallet();
  const isClient = wallet.address?.toLowerCase() === escrow.employer.toLowerCase();
  const isFreelancer = wallet.address?.toLowerCase() === escrow.employee.toLowerCase();

  const amountInEth = (parseFloat(escrow.amount) / 1e18).toFixed(4);

  const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const renderActions = () => {
    const actions: React.ReactNode[] = [];

    if (isFreelancer && escrow.status === EscrowStatus.Open && onAccept) {
      actions.push(
        <Button
          key="accept"
          onClick={() => onAccept(escrow.escrowId)}
          disabled={isLoading}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <CheckCircle className="h-4 w-4" />
          Accept Job
        </Button>
      );
    }

    if (isFreelancer && escrow.status === EscrowStatus.InProgress && onSubmitWork) {
      actions.push(
        <Button
          key="submit"
          onClick={() => onSubmitWork(escrow.escrowId)}
          disabled={isLoading}
          className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
        >
          <Send className="h-4 w-4" />
          Submit Work
        </Button>
      );
    }

    if (isClient && escrow.status === EscrowStatus.Completed && onApprove) {
      actions.push(
        <Button
          key="approve"
          onClick={() => onApprove(escrow.escrowId)}
          disabled={isLoading}
          className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
        >
          <ThumbsUp className="h-4 w-4" />
          Approve & Release
        </Button>
      );
    }

    if (isClient && escrow.status === EscrowStatus.Open && onCancel) {
      actions.push(
        <Button
          key="cancel"
          variant="outline"
          onClick={() => onCancel(escrow.escrowId)}
          disabled={isLoading}
          className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <XCircle className="h-4 w-4" />
          Cancel
        </Button>
      );
    }

    if (
      (isClient || isFreelancer) &&
      (escrow.status === EscrowStatus.InProgress || escrow.status === EscrowStatus.Completed) &&
      onDispute
    ) {
      actions.push(
        <Button
          key="dispute"
          variant="outline"
          onClick={() => onDispute(escrow.escrowId)}
          disabled={isLoading}
          className="gap-2 border-warning/50 text-warning hover:bg-warning/10"
        >
          <AlertTriangle className="h-4 w-4" />
          Dispute
        </Button>
      );
    }

    return actions;
  };

  return (
    <Card className="glass-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-muted-foreground">
                #{escrow.escrowId.toString().padStart(4, '0')}
              </span>
              <StatusBadge status={escrow.status} />
            </div>
            <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
              {escrow.jobDesc}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-primary">{amountInEth}</div>
            <div className="text-xs text-muted-foreground">ETH</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4 text-info" />
            <div>
              <div className="text-xs opacity-70">Client</div>
              <div className="font-mono text-xs text-foreground">
                {truncateAddress(escrow.employer)}
                {isClient && (
                  <span className="ml-1 text-primary">(You)</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-4 w-4 text-success" />
            <div>
              <div className="text-xs opacity-70">Freelancer</div>
              <div className="font-mono text-xs text-foreground">
                {truncateAddress(escrow.employee)}
                {isFreelancer && (
                  <span className="ml-1 text-primary">(You)</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          Created {formatDistanceToNow(escrow.timestamp, { addSuffix: true })}
        </div>
      </CardContent>

      {renderActions().length > 0 && (
        <CardFooter className="pt-3 border-t border-border/50 gap-2 flex-wrap">
          {renderActions()}
        </CardFooter>
      )}
    </Card>
  );
};
