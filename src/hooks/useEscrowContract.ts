import { useCallback, useState, useEffect } from 'react';
import { Contract, parseEther, formatEther } from 'ethers';
import { useWallet } from '@/context/WalletContext';
import { ESCROW_ABI, ESCROW_CONTRACT_ADDRESS, EscrowData } from '@/contracts/escrowABI';
import { Escrow, EscrowStatus } from '@/types/escrow';
import { toast } from 'sonner';

export const useEscrowContract = () => {
  const { provider, wallet } = useWallet();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [earnings, setEarnings] = useState('0');

  // Initialize contract
  useEffect(() => {
    const initContract = async () => {
      if (!provider || !ESCROW_CONTRACT_ADDRESS) {
        setContract(null);
        return;
      }

      try {
        const signer = await provider.getSigner();
        const escrowContract = new Contract(ESCROW_CONTRACT_ADDRESS, ESCROW_ABI, signer);
        setContract(escrowContract);
      } catch (error) {
        console.error('Failed to initialize contract:', error);
        setContract(null);
      }
    };

    initContract();
  }, [provider]);

  // Fetch escrows and earnings
  const fetchUserData = useCallback(async () => {
    if (!contract || !wallet.address) return;

    setIsLoading(true);
    try {
      // Fetch client and freelancer escrow IDs
      const [clientIds, freelancerIds, userEarnings] = await Promise.all([
        contract.getMyClientEscrows(),
        contract.getMyFreelancerEscrows(),
        contract.getMyEarnings(),
      ]);

      // Combine unique IDs
      const allIds = [...new Set([...clientIds, ...freelancerIds])];

      // Fetch all escrow details
      const escrowPromises = allIds.map((id: bigint) => contract.getEscrow(id));
      const escrowDataList: EscrowData[] = await Promise.all(escrowPromises);

      const formattedEscrows: Escrow[] = escrowDataList.map((data) => ({
        escrowId: Number(data.escrowId),
        employer: data.employer,
        employee: data.employee,
        jobDesc: data.jobDesc,
        amount: data.amount.toString(),
        status: data.status as EscrowStatus,
        timestamp: Number(data.timestamp) * 1000,
      }));

      setEscrows(formattedEscrows.sort((a, b) => b.timestamp - a.timestamp));
      setEarnings(formatEther(userEarnings));
    } catch (error: any) {
      console.error('Failed to fetch escrows:', error);
      toast.error('Failed to fetch escrows', {
        description: error.message || 'Could not load your escrows.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [contract, wallet.address]);

  // Refresh data when contract or wallet changes
  useEffect(() => {
    if (contract && wallet.isConnected) {
      fetchUserData();
    } else {
      setEscrows([]);
      setEarnings('0');
    }
  }, [contract, wallet.isConnected, fetchUserData]);

  const clientEscrows = escrows.filter(
    (e) => e.employer.toLowerCase() === wallet.address?.toLowerCase()
  );

  const freelancerEscrows = escrows.filter(
    (e) => e.employee.toLowerCase() === wallet.address?.toLowerCase()
  );

  // Contract write functions
  const createEscrow = useCallback(
    async (description: string, freelancerAddress: string, amount: string) => {
      if (!contract) {
        toast.error('Contract not connected', {
          description: 'Please ensure you are connected to the correct network.',
        });
        throw new Error('Contract not connected');
      }

      setIsLoading(true);
      try {
        const tx = await contract.createEscrow(description, freelancerAddress, {
          value: parseEther(amount),
        });

        toast.loading('Transaction pending...', { id: 'create-escrow' });
        const receipt = await tx.wait();

        toast.success('Escrow created!', {
          id: 'create-escrow',
          description: `Transaction confirmed: ${receipt.hash.slice(0, 10)}...`,
        });

        await fetchUserData();
        return receipt;
      } catch (error: any) {
        console.error('Create escrow failed:', error);
        toast.error('Transaction failed', {
          id: 'create-escrow',
          description: error.reason || error.message || 'Failed to create escrow.',
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract, fetchUserData]
  );

  const acceptEscrow = useCallback(
    async (escrowId: number) => {
      if (!contract) throw new Error('Contract not connected');

      setIsLoading(true);
      try {
        const tx = await contract.acceptEscrow(escrowId);
        toast.loading('Accepting job...', { id: `accept-${escrowId}` });
        await tx.wait();
        toast.success('Job accepted!', { id: `accept-${escrowId}` });
        await fetchUserData();
      } catch (error: any) {
        toast.error('Failed to accept job', {
          id: `accept-${escrowId}`,
          description: error.reason || error.message,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract, fetchUserData]
  );

  const submitWork = useCallback(
    async (escrowId: number) => {
      if (!contract) throw new Error('Contract not connected');

      setIsLoading(true);
      try {
        const tx = await contract.submitWork(escrowId);
        toast.loading('Submitting work...', { id: `submit-${escrowId}` });
        await tx.wait();
        toast.success('Work submitted!', { id: `submit-${escrowId}` });
        await fetchUserData();
      } catch (error: any) {
        toast.error('Failed to submit work', {
          id: `submit-${escrowId}`,
          description: error.reason || error.message,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract, fetchUserData]
  );

  const approveAndRelease = useCallback(
    async (escrowId: number) => {
      if (!contract) throw new Error('Contract not connected');

      setIsLoading(true);
      try {
        const tx = await contract.approveAndRelease(escrowId);
        toast.loading('Releasing payment...', { id: `release-${escrowId}` });
        await tx.wait();
        toast.success('Payment released!', { id: `release-${escrowId}` });
        await fetchUserData();
      } catch (error: any) {
        toast.error('Failed to release payment', {
          id: `release-${escrowId}`,
          description: error.reason || error.message,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract, fetchUserData]
  );

  const dispute = useCallback(
    async (escrowId: number) => {
      if (!contract) throw new Error('Contract not connected');

      setIsLoading(true);
      try {
        const tx = await contract.dispute(escrowId);
        toast.loading('Filing dispute...', { id: `dispute-${escrowId}` });
        await tx.wait();
        toast.success('Dispute filed!', { id: `dispute-${escrowId}` });
        await fetchUserData();
      } catch (error: any) {
        toast.error('Failed to file dispute', {
          id: `dispute-${escrowId}`,
          description: error.reason || error.message,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract, fetchUserData]
  );

  const cancelEscrow = useCallback(
    async (escrowId: number) => {
      if (!contract) throw new Error('Contract not connected');

      setIsLoading(true);
      try {
        const tx = await contract.cancelEscrow(escrowId);
        toast.loading('Cancelling escrow...', { id: `cancel-${escrowId}` });
        await tx.wait();
        toast.success('Escrow cancelled!', { id: `cancel-${escrowId}` });
        await fetchUserData();
      } catch (error: any) {
        toast.error('Failed to cancel escrow', {
          id: `cancel-${escrowId}`,
          description: error.reason || error.message,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract, fetchUserData]
  );

  const withdrawEarnings = useCallback(async () => {
    if (!contract) throw new Error('Contract not connected');

    setIsLoading(true);
    try {
      const tx = await contract.withdrawEarnings();
      toast.loading('Withdrawing earnings...', { id: 'withdraw' });
      await tx.wait();
      toast.success('Earnings withdrawn!', { id: 'withdraw' });
      await fetchUserData();
    } catch (error: any) {
      toast.error('Failed to withdraw', {
        id: 'withdraw',
        description: error.reason || error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [contract, fetchUserData]);

  return {
    contract,
    isContractReady: !!contract && !!ESCROW_CONTRACT_ADDRESS,
    escrows,
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
    refreshData: fetchUserData,
  };
};
