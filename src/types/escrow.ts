export enum EscrowStatus {
  Open = 0,
  InProgress = 1,
  Completed = 2,
  Disputed = 3,
  Released = 4,
  Cancelled = 5,
}

export interface Escrow {
  escrowId: number;
  employer: string;
  employee: string;
  jobDesc: string;
  amount: string; // in wei, displayed as ETH
  status: EscrowStatus;
  timestamp: number;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: string;
}

export const statusLabels: Record<EscrowStatus, string> = {
  [EscrowStatus.Open]: 'Open',
  [EscrowStatus.InProgress]: 'In Progress',
  [EscrowStatus.Completed]: 'Completed',
  [EscrowStatus.Disputed]: 'Disputed',
  [EscrowStatus.Released]: 'Released',
  [EscrowStatus.Cancelled]: 'Cancelled',
};

export const statusColors: Record<EscrowStatus, string> = {
  [EscrowStatus.Open]: 'bg-info/20 text-info border-info/30',
  [EscrowStatus.InProgress]: 'bg-warning/20 text-warning border-warning/30',
  [EscrowStatus.Completed]: 'bg-primary/20 text-primary border-primary/30',
  [EscrowStatus.Disputed]: 'bg-destructive/20 text-destructive border-destructive/30',
  [EscrowStatus.Released]: 'bg-success/20 text-success border-success/30',
  [EscrowStatus.Cancelled]: 'bg-muted text-muted-foreground border-muted',
};
