export const ESCROW_ABI = [
  // Events
  "event escrowCreated(uint indexed escrowId, address indexed client, address indexed freelancer, string jobDescription, uint amount)",
  "event escrowAccepted(uint indexed escrowId, address indexed freelancer)",
  "event workSubmitted(uint indexed escrowId, address indexed freelancer)",
  "event paymentReleased(uint indexed escrowId, address indexed client, uint freelancerEarnings, uint platformEarnings)",
  "event escrowDisputed(uint indexed escrowId, address indexed by)",
  "event disputeResolved(uint indexed escrowId, bool releasedtoFreelancer)",
  "event escrowCancelled(uint indexed escrowId, address indexed client)",
  "event earningsWithdrawn(address indexed freelancer, uint amount)",
  
  // Read functions
  "function getEscrow(uint _escrowId) view returns (tuple(uint escrowId, address employer, address employee, string jobDesc, uint amount, uint8 status, uint timestamp))",
  "function getMyClientEscrows() view returns (uint[])",
  "function getMyFreelancerEscrows() view returns (uint[])",
  "function getMyEarnings() view returns (uint)",
  "function platformFee() view returns (uint)",
  "function owner() view returns (address)",
  
  // Write functions
  "function createEscrow(string description, address _freelancer) payable returns (uint)",
  "function acceptEscrow(uint _escrowId)",
  "function submitWork(uint _escrowId)",
  "function approveAndRelease(uint _escrowId)",
  "function dispute(uint _escrowId)",
  "function cancelEscrow(uint _escrowId)",
  "function withdrawEarnings()",
] as const;

// Contract address - UPDATE THIS after deploying your contract
export const ESCROW_CONTRACT_ADDRESS = "";

export type EscrowData = {
  escrowId: bigint;
  employer: string;
  employee: string;
  jobDesc: string;
  amount: bigint;
  status: number;
  timestamp: bigint;
};
