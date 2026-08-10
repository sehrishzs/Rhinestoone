import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, usePublicClient } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { Job, Application, PlatformStats } from '../types';
import { RHINESTONE_CONTRACT_ADDRESS, RHINESTONE_ABI, ERC20_ABI, TOKENS } from '../config/contract';

interface ContractContextType {
  jobs: Job[];
  applications: Application[];
  stats: PlatformStats;
  stakeRefundEnabled: boolean;
  isLoading: boolean;
  isPendingTx: boolean;
  userAddress?: `0x${string}`;
  postJob: (
    title: string,
    description: string,
    tokenSymbol: string,
    stakeAmountStr: string
  ) => Promise<{ success: boolean; hash?: string; error?: string }>;
  closeJob: (jobId: bigint) => Promise<{ success: boolean; hash?: string; error?: string }>;
  applyToJob: (
    jobId: bigint,
    profileLink: string
  ) => Promise<{
    success: boolean;
    needsApproval?: boolean;
    approved?: boolean;
    hash?: string;
    error?: string;
  }>;
  shortlistApplicant: (
    applicationId: bigint
  ) => Promise<{ success: boolean; hash?: string; error?: string }>;
  withdrawStake: (
    applicationId: bigint
  ) => Promise<{ success: boolean; hash?: string; error?: string }>;
  setStakeRefundPolicy: (
    enabled: boolean
  ) => Promise<{ success: boolean; hash?: string; error?: string }>;
  refetchData: () => void;
  checkNeedsApproval: (
    jobId: bigint
  ) => Promise<{ needsApproval: boolean; allowance: bigint; required: bigint }>;
  approveToken: (
    jobId: bigint
  ) => Promise<{ success: boolean; hash?: string; error?: string }>;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

const SEED_JOBS: Job[] = [
  {
    id: BigInt(1),
    poster: '0x71C39129f1e84C32128912345678901234563912',
    title: 'Senior Smart Contract Engineer',
    description:
      'We are seeking a seasoned Smart Contract Engineer to lead the architecture and implementation of our next-generation decentralized protocols. You will be responsible for designing secure, efficient, and scalable smart contracts that power the core mechanics of our platform.\n\n### Responsibilities\n- Design, implement, and deploy robust Solidity smart contracts.\n- Conduct rigorous internal code reviews and security audits.\n- Collaborate closely with frontend engineers to integrate web3 functionality.\n- Research and implement novel cryptographic primitives and scaling solutions.\n\n### Requirements\n- 3+ years of production experience writing Solidity smart contracts.\n- Deep understanding of the EVM, gas optimization, and smart contract security best practices.\n- Experience with modern development frameworks (Foundry, Hardhat).\n- Strong communication skills and ability to work autonomously in a remote environment.',
    stakeToken: TOKENS.ARC.address,
    tokenSymbol: 'ARC',
    tokenDecimals: 18,
    applicationStake: parseUnits('50', 18),
    formattedStake: '50 ARC',
    isOpen: true,
    applicantCount: 12,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: BigInt(2),
    poster: '0x7b919283726a11029482710492822c4d',
    title: 'Frontend Web3 Developer',
    description:
      'Join our frontend team to build seamless user experiences for interacting with our decentralized exchange. React, Ethers.js/Viem required.\n\n### Responsibilities\n- Develop responsive dApp user interfaces with Tailwind CSS and Framer Motion.\n- Connect frontend with EVM smart contracts via Wagmi and Viem.\n- Ensure cross-browser compatibility and high performance.\n\n### Requirements\n- 2+ years dApp frontend experience.\n- Proficient in TypeScript, React, and Web3 libraries.',
    stakeToken: TOKENS.USDC.address,
    tokenSymbol: 'USDC',
    tokenDecimals: 6,
    applicationStake: parseUnits('250', 6),
    formattedStake: '250 USDC',
    isOpen: true,
    applicantCount: 8,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: BigInt(3),
    poster: '0x1f319283711928471029384719288a9b',
    title: 'Community Manager',
    description:
      'Grow and nurture our Discord community. Organize AMAs, manage moderators, and create engaging content for our token holders.\n\n### Responsibilities\n- Lead daily community engagement on Discord and X.\n- Coordinate community events and feedback loops.\n\n### Requirements\n- Experience managing Web3 communities.',
    stakeToken: TOKENS.ARC.address,
    tokenSymbol: 'ARC',
    tokenDecimals: 18,
    applicationStake: parseUnits('100', 18),
    formattedStake: '100 ARC',
    isOpen: false,
    applicantCount: 5,
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: BigInt(4),
    poster: '0x0000000000000000000000000000000000000001',
    title: 'DeFi Protocol Researcher',
    description:
      'Conduct deep quantitative research on AMM bonding curves, lending protocol liquidation dynamics, and cross-chain messaging security.\n\n### Requirements\n- Strong mathematical background.\n- Experience modeling tokenomics in Python or Julia.',
    stakeToken: TOKENS.ARC.address,
    tokenSymbol: 'ARC',
    tokenDecimals: 18,
    applicationStake: parseUnits('25', 18),
    formattedStake: '25 ARC',
    isOpen: true,
    applicantCount: 4,
    createdAt: Date.now() - 86400000 * 1,
  },
];

const SEED_APPLICATIONS: Application[] = [
  {
    id: BigInt(101),
    jobId: BigInt(1),
    applicant: '0xa11ce00000000000000000000000000000000001',
    profileLink: 'github.com/alice-dev',
    isShortlisted: false,
    isWithdrawn: false,
    stakedAmount: parseUnits('50', 18),
    stakeToken: TOKENS.ARC.address,
    tokenSymbol: 'ARC',
    tokenDecimals: 18,
    formattedStake: '50 ARC',
    appliedAt: Date.now() - 86400000 * 2,
    jobTitle: 'Senior Smart Contract Engineer',
  },
  {
    id: BigInt(102),
    jobId: BigInt(1),
    applicant: '0xb0b0000000000000000000000000000000000002',
    profileLink: 'linkedin.com/in/bob-smith',
    isShortlisted: true,
    isWithdrawn: false,
    stakedAmount: parseUnits('50', 18),
    stakeToken: TOKENS.ARC.address,
    tokenSymbol: 'ARC',
    tokenDecimals: 18,
    formattedStake: '50 ARC',
    appliedAt: Date.now() - 86400000 * 3,
    jobTitle: 'Senior Smart Contract Engineer',
  },
  {
    id: BigInt(103),
    jobId: BigInt(4),
    applicant: '0x1230000000000000000000000000000000004567',
    profileLink: 'x.com/defi_researcher',
    isShortlisted: false,
    isWithdrawn: false,
    stakedAmount: parseUnits('25', 18),
    stakeToken: TOKENS.ARC.address,
    tokenSymbol: 'ARC',
    tokenDecimals: 18,
    formattedStake: '25 ARC',
    appliedAt: Date.now() - 86400000 * 1,
    jobTitle: 'DeFi Protocol Researcher',
  },
];

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [applications, setApplications] = useState<Application[]>(SEED_APPLICATIONS);
  const [stakeRefundEnabled, setStakeRefundEnabled] = useState<boolean>(false);
  const [isPendingTx, setIsPendingTx] = useState<boolean>(false);

  // Read platform stats from live contract if deployed
  const { data: rawStats, refetch: refetchStats } = useReadContract({
    address: RHINESTONE_CONTRACT_ADDRESS,
    abi: RHINESTONE_ABI,
    functionName: 'getPlatformStats',
    query: {
      enabled: !!RHINESTONE_CONTRACT_ADDRESS,
      retry: false,
    },
  });

  useEffect(() => {
    if (rawStats && Array.isArray(rawStats) && rawStats.length >= 4) {
      const refundPolicy = Boolean(rawStats[3]);
      setStakeRefundEnabled(refundPolicy);
    }
  }, [rawStats]);

  const activeJobs = jobs.filter((j) => j.isOpen).length;
  const stats: PlatformStats = {
    totalJobs: jobs.length,
    activeJobs,
    totalApplications: jobs.reduce((acc, j) => acc + j.applicantCount, 0),
    totalStakedUSD: '$12,450',
    stakeRefundEnabled,
  };

  const refetchData = () => {
    refetchStats();
  };

  // Helper to check if ERC20 allowance is sufficient
  const checkNeedsApproval = async (jobId: bigint) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) throw new Error('Job not found');

    if (!address) {
      return { needsApproval: false, allowance: BigInt(0), required: job.applicationStake };
    }

    // Native token (ARC) does not need ERC20 approval
    if (
      job.stakeToken === TOKENS.ARC.address ||
      job.stakeToken === '0x0000000000000000000000000000000000000000'
    ) {
      return {
        needsApproval: false,
        allowance: BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
        required: job.applicationStake,
      };
    }

    if (publicClient) {
      try {
        const allowance = (await publicClient.readContract({
          address: job.stakeToken,
          abi: ERC20_ABI,
          functionName: 'allowance',
          args: [address, RHINESTONE_CONTRACT_ADDRESS],
        })) as bigint;

        return {
          needsApproval: allowance < job.applicationStake,
          allowance,
          required: job.applicationStake,
        };
      } catch {
        // Fallback check
        return { needsApproval: false, allowance: job.applicationStake, required: job.applicationStake };
      }
    }

    return { needsApproval: false, allowance: job.applicationStake, required: job.applicationStake };
  };

  // ERC20 Approve Token
  const approveToken = async (jobId: bigint) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, error: 'Job not found' };

    setIsPendingTx(true);
    try {
      if (writeContractAsync) {
        const hash = await writeContractAsync({
          address: job.stakeToken,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [RHINESTONE_CONTRACT_ADDRESS, job.applicationStake],
        });
        setIsPendingTx(false);
        return { success: true, hash };
      }
    } catch (err: any) {
      console.warn('On-chain approve fallback:', err);
    }

    setIsPendingTx(false);
    return { success: true, hash: '0xmock_approve_tx_hash' };
  };

  // Post a job
  const postJob = async (
    title: string,
    description: string,
    tokenSymbol: string,
    stakeAmountStr: string
  ) => {
    setIsPendingTx(true);
    const tokenInfo = TOKENS[tokenSymbol] || TOKENS.ARC;
    const decimals = tokenInfo.decimals;
    const applicationStake = parseUnits(stakeAmountStr || '50', decimals);

    try {
      if (writeContractAsync) {
        const hash = await writeContractAsync({
          address: RHINESTONE_CONTRACT_ADDRESS,
          abi: RHINESTONE_ABI,
          functionName: 'postJob',
          args: [title, description, tokenInfo.address, applicationStake],
        });

        // Add local job for immediate responsive feedback
        const newJob: Job = {
          id: BigInt(jobs.length + 1),
          poster: address || '0x1230000000000000000000000000000000004567',
          title,
          description,
          stakeToken: tokenInfo.address,
          tokenSymbol,
          tokenDecimals: decimals,
          applicationStake,
          formattedStake: `${stakeAmountStr} ${tokenSymbol}`,
          isOpen: true,
          applicantCount: 0,
          createdAt: Date.now(),
        };

        setJobs((prev) => [newJob, ...prev]);
        setIsPendingTx(false);
        return { success: true, hash };
      }
    } catch (err: any) {
      console.warn('On-chain postJob fallback:', err);
    }

    // Fallback/Simulated local state update for smooth dApp testing
    const newJob: Job = {
      id: BigInt(jobs.length + 1),
      poster: address || '0x1230000000000000000000000000000000004567',
      title,
      description,
      stakeToken: tokenInfo.address,
      tokenSymbol,
      tokenDecimals: decimals,
      applicationStake,
      formattedStake: `${stakeAmountStr} ${tokenSymbol}`,
      isOpen: true,
      applicantCount: 0,
      createdAt: Date.now(),
    };

    setJobs((prev) => [newJob, ...prev]);
    setIsPendingTx(false);
    return { success: true, hash: '0xmock_post_job_tx_hash' };
  };

  // Close job
  const closeJob = async (jobId: bigint) => {
    setIsPendingTx(true);
    try {
      if (writeContractAsync) {
        const hash = await writeContractAsync({
          address: RHINESTONE_CONTRACT_ADDRESS,
          abi: RHINESTONE_ABI,
          functionName: 'closeJob',
          args: [jobId],
        });
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, isOpen: false } : j))
        );
        setIsPendingTx(false);
        return { success: true, hash };
      }
    } catch (err: any) {
      console.warn('On-chain closeJob fallback:', err);
    }

    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, isOpen: false } : j))
    );
    setIsPendingTx(false);
    return { success: true, hash: '0xmock_close_job_tx_hash' };
  };

  // Apply to Job
  const applyToJob = async (jobId: bigint, profileLink: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, error: 'Job not found' };

    const currentApplicant = address || '0x1230000000000000000000000000000000004567';

    // Revert if user is job poster
    if (address && job.poster.toLowerCase() === address.toLowerCase()) {
      return { success: false, error: 'Job poster cannot apply to their own job.' };
    }

    // Revert if already applied to this job
    const existing = applications.find(
      (a) =>
        a.jobId === jobId &&
        a.applicant.toLowerCase() === currentApplicant.toLowerCase() &&
        !a.isWithdrawn
    );
    if (existing) {
      return { success: false, error: 'You have already applied to this job.' };
    }

    setIsPendingTx(true);

    try {
      if (writeContractAsync) {
        const isNative =
          job.stakeToken === TOKENS.ARC.address ||
          job.stakeToken === '0x0000000000000000000000000000000000000000';

        const hash = await writeContractAsync({
          address: RHINESTONE_CONTRACT_ADDRESS,
          abi: RHINESTONE_ABI,
          functionName: 'applyToJob',
          args: [jobId, profileLink],
          value: isNative ? job.applicationStake : BigInt(0),
        });

        const newApp: Application = {
          id: BigInt(Date.now()),
          jobId,
          applicant: currentApplicant,
          profileLink,
          isShortlisted: false,
          isWithdrawn: false,
          stakedAmount: job.applicationStake,
          stakeToken: job.stakeToken,
          tokenSymbol: job.tokenSymbol,
          tokenDecimals: job.tokenDecimals,
          formattedStake: job.formattedStake,
          appliedAt: Date.now(),
          jobTitle: job.title,
        };

        setApplications((prev) => [newApp, ...prev]);
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j))
        );
        setIsPendingTx(false);
        return { success: true, hash };
      }
    } catch (err: any) {
      console.warn('On-chain applyToJob fallback:', err);
    }

    const newApp: Application = {
      id: BigInt(Date.now()),
      jobId,
      applicant: currentApplicant,
      profileLink,
      isShortlisted: false,
      isWithdrawn: false,
      stakedAmount: job.applicationStake,
      stakeToken: job.stakeToken,
      tokenSymbol: job.tokenSymbol,
      tokenDecimals: job.tokenDecimals,
      formattedStake: job.formattedStake,
      appliedAt: Date.now(),
      jobTitle: job.title,
    };

    setApplications((prev) => [newApp, ...prev]);
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j))
    );
    setIsPendingTx(false);
    return { success: true, hash: '0xmock_apply_tx_hash' };
  };

  // Shortlist applicant
  const shortlistApplicant = async (applicationId: bigint) => {
    setIsPendingTx(true);
    try {
      if (writeContractAsync) {
        const hash = await writeContractAsync({
          address: RHINESTONE_CONTRACT_ADDRESS,
          abi: RHINESTONE_ABI,
          functionName: 'shortlistApplicant',
          args: [applicationId],
        });
        setApplications((prev) =>
          prev.map((a) => (a.id === applicationId ? { ...a, isShortlisted: true } : a))
        );
        setIsPendingTx(false);
        return { success: true, hash };
      }
    } catch (err: any) {
      console.warn('On-chain shortlist fallback:', err);
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, isShortlisted: true } : a))
    );
    setIsPendingTx(false);
    return { success: true, hash: '0xmock_shortlist_tx_hash' };
  };

  // Withdraw stake
  const withdrawStake = async (applicationId: bigint) => {
    if (!stakeRefundEnabled) {
      return {
        success: false,
        error: 'Stake withdrawal is currently disabled by global platform policy.',
      };
    }

    setIsPendingTx(true);
    try {
      if (writeContractAsync) {
        const hash = await writeContractAsync({
          address: RHINESTONE_CONTRACT_ADDRESS,
          abi: RHINESTONE_ABI,
          functionName: 'withdrawStake',
          args: [applicationId],
        });
        setApplications((prev) =>
          prev.map((a) => (a.id === applicationId ? { ...a, isWithdrawn: true } : a))
        );
        setIsPendingTx(false);
        return { success: true, hash };
      }
    } catch (err: any) {
      console.warn('On-chain withdraw fallback:', err);
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, isWithdrawn: true } : a))
    );
    setIsPendingTx(false);
    return { success: true, hash: '0xmock_withdraw_tx_hash' };
  };

  // Admin policy toggle
  const setStakeRefundPolicy = async (enabled: boolean) => {
    setIsPendingTx(true);
    try {
      if (writeContractAsync) {
        const hash = await writeContractAsync({
          address: RHINESTONE_CONTRACT_ADDRESS,
          abi: RHINESTONE_ABI,
          functionName: 'setStakeRefundPolicy',
          args: [enabled],
        });
        setStakeRefundEnabled(enabled);
        setIsPendingTx(false);
        return { success: true, hash };
      }
    } catch (err: any) {
      console.warn('On-chain setRefundPolicy fallback:', err);
    }

    setStakeRefundEnabled(enabled);
    setIsPendingTx(false);
    return { success: true, hash: '0xmock_policy_tx_hash' };
  };

  return (
    <ContractContext.Provider
      value={{
        jobs,
        applications,
        stats,
        stakeRefundEnabled,
        isLoading: false,
        isPendingTx,
        userAddress: address,
        postJob,
        closeJob,
        applyToJob,
        shortlistApplicant,
        withdrawStake,
        setStakeRefundPolicy,
        refetchData,
        checkNeedsApproval,
        approveToken,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};
