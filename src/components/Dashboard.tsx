import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EscrowCard } from './EscrowCard';
import { CreateEscrowDialog } from './CreateEscrowDialog';
import { EarningsCard } from './EarningsCard';
import { StatsCards } from './StatsCards';
import { useWallet } from '@/context/WalletContext';
import { useEscrows } from '@/hooks/useEscrows';
import { Briefcase, User, FileX } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { wallet } = useWallet();
  const {
    clientEscrows,
    freelancerEscrows,
    earnings,
    isLoading,
    createEscrow,
    acceptEscrow,
    submitWork,
    approveAndRelease,
    dispute,
    cancelEscrow,
    withdrawEarnings,
  } = useEscrows(wallet.address);

  const allEscrows = [...clientEscrows, ...freelancerEscrows];
  // Remove duplicates
  const uniqueEscrows = allEscrows.filter(
    (escrow, index, self) =>
      index === self.findIndex((e) => e.escrowId === escrow.escrowId)
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-full bg-muted/50 mb-4">
        <FileX className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );

  return (
    <div className="container py-8 space-y-8">
      {/* Stats Overview */}
      <StatsCards escrows={uniqueEscrows} />

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Escrows List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Escrows</h2>
            <CreateEscrowDialog onSubmit={createEscrow} isLoading={isLoading} />
          </div>

          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
              <TabsTrigger value="client" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <User className="h-4 w-4" />
                As Client ({clientEscrows.length})
              </TabsTrigger>
              <TabsTrigger value="freelancer" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Briefcase className="h-4 w-4" />
                As Freelancer ({freelancerEscrows.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="client" className="mt-6 space-y-4">
              {clientEscrows.length === 0 ? (
                <EmptyState message="No escrows created yet. Create your first escrow to hire a freelancer!" />
              ) : (
                clientEscrows.map((escrow) => (
                  <EscrowCard
                    key={escrow.escrowId}
                    escrow={escrow}
                    onApprove={approveAndRelease}
                    onDispute={dispute}
                    onCancel={cancelEscrow}
                    isLoading={isLoading}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="freelancer" className="mt-6 space-y-4">
              {freelancerEscrows.length === 0 ? (
                <EmptyState message="No jobs assigned to you yet. Share your address with clients to get hired!" />
              ) : (
                freelancerEscrows.map((escrow) => (
                  <EscrowCard
                    key={escrow.escrowId}
                    escrow={escrow}
                    onAccept={acceptEscrow}
                    onSubmitWork={submitWork}
                    onDispute={dispute}
                    isLoading={isLoading}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <EarningsCard
            earnings={earnings}
            onWithdraw={withdrawEarnings}
            isLoading={isLoading}
          />

          {/* How it works */}
          <div className="glass-card rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg">How It Works</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                  1
                </div>
                <p>Client creates an escrow with job details and funds</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                  2
                </div>
                <p>Freelancer accepts the job and starts working</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                  3
                </div>
                <p>Freelancer submits completed work</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                  4
                </div>
                <p>Client approves and releases payment</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Platform fee: <span className="text-primary font-medium">5%</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
