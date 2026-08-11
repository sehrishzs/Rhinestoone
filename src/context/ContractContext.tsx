import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
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

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stakeRefundEnabled, setStakeRefundEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPendingTx, setIsPendingTx] = useState<boolean>(false);

  // Fetch all real contract data
  const fetchAllData = useCallback(async () => {
    if (!publicClient) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const statsData = (await publicClient.readContract({
        address: RHINESTONE_CONTRACT_ADDRESS,
        abi: RHINESTONE_ABI,
        functionName: 'getPlatformStats',
      })) as [bigint, bigint, bigint, boolean];

      const [totalJobsBig, , , refundPolicy] = statsData;
      setStakeRefundEnabled(Boolean(refundPolicy));

      const totalJobsCount = Number(totalJobsBig);
      if (totalJobsCount === 0) {
        setJobs([]);
        setApplications([]);
        setIsLoading(false);
        return;
      }

      const fetchedJobs: Job[] = [];
      const fetchedApps: Application[] = [];

      for (let i = 1; i <= totalJobsCount; i++) {
        try {
          const jobData = (await publicClient.readContract({
            address: RHINESTONE_CONTRACT_ADDRESS,
            abi: RHINESTONE_ABI,
            functionName: 'getJob',
            args: [BigInt(i)],
          })) as any;

          if (!jobData) continue;

          const id = jobData.id !== undefined ? BigInt(jobData.id) : BigInt(i);
          const poster = jobData.poster;
          const title = jobData.title || '';
          const description = jobData.description || '';
          const stakeToken = jobData.stakeToken;
          const applicationStake = BigInt(jobData.applicationStake || 0);
          const isOpen = Boolean(jobData.isOpen);
          const createdAt = Number(jobData.createdAt) * 1000 || Date.now();

          let tokenSymbol = 'ARC';
          let tokenDecimals = 18;

          const matchedToken = Object.values(TOKENS).find(
            (t) => t.address.toLowerCase() === stakeToken.toLowerCase()
          );
          if (matchedToken) {
            tokenSymbol = matchedToken.symbol;
            tokenDecimals = matchedToken.decimals;
          }

          const formattedStakeVal = formatUnits(applicationStake, tokenDecimals);
          const formattedStake = `${formattedStakeVal} ${tokenSymbol}`;

          let jobAppsData: any[] = [];
          try {
            jobAppsData = (await publicClient.readContract({
              address: RHINESTONE_CONTRACT_ADDRESS,
              abi: RHINESTONE_ABI,
              functionName: 'getApplicationsForJob',
              args: [id],
            })) as any[];
          } catch (e) {
            console.warn(`Could not fetch applications for job ${id}`, e);
          }

          fetchedJobs.push({
            id,
            poster,
            title,
            description,
            stakeToken,
            tokenSymbol,
            tokenDecimals,
            applicationStake,
            formattedStake,
            isOpen,
            applicantCount: jobAppsData.length,
            createdAt,
          });

          for (const appItem of jobAppsData) {
            fetchedApps.push({
              id: BigInt(appItem.id),
              jobId: BigInt(appItem.jobId || id),
              applicant: appItem.applicant,
              profileLink: appItem.profileLink,
              isShortlisted: Boolean(appItem.isShortlisted),
              isWithdrawn: Boolean(appItem.isWithdrawn),
              stakedAmount: applicationStake,
              stakeToken,
              tokenSymbol,
              tokenDecimals,
              formattedStake,
              appliedAt: Number(appItem.appliedAt) * 1000 || Date.now(),
              jobTitle: title,
            });
          }
        } catch (err) {
          console.warn(`Failed to fetch job ${i}:`, err);
        }
      }

      setJobs(fetchedJobs);
      setApplications(fetchedApps);
    } catch (err) {
      console.warn('Error reading from contract on Arc Testnet:', err);
      setJobs([]);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const activeJobs = jobs.filter((j) => j.isOpen).length;
  const stats: PlatformStats = {
    totalJobs: jobs.length,
    activeJobs,
    totalApplications: applications.length,
    totalStakedUSD: `${applications.length} Staked Applications`,
    stakeRefundEnabled,
  };

  const refetchData = () => {
    fetchAllData();
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
      setIsPendingTx(false);
      return { success: false, error: err.message || 'Approval failed' };
    }

    setIsPendingTx(false);
    return { success: false, error: 'Wallet not ready' };
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

        setIsPendingTx(false);
        setTimeout(() => fetchAllData(), 2000);
        return { success: true, hash };
      }
    } catch (err: any) {
      setIsPendingTx(false);
      return { success: false, error: err.message || 'Failed to post job' };
    }

    setIsPendingTx(false);
    return { success: false, error: 'Wallet not connected' };
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

        setIsPendingTx(false);
        setTimeout(() => fetchAllData(), 2000);
        return { success: true, hash };
      }
    } catch (err: any) {
      setIsPendingTx(false);
      return { success: false, error: err.message || 'Failed to close job' };
    }

    setIsPendingTx(false);
    return { success: false, error: 'Wallet not connected' };
  };

  // Apply to Job
  const applyToJob = async (jobId: bigint, profileLink: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, error: 'Job not found' };

    if (!address) {
      return { success: false, error: 'Please connect your wallet to apply.' };
    }

    // Revert if user is job poster
    if (job.poster.toLowerCase() === address.toLowerCase()) {
      return { success: false, error: 'Job poster cannot apply to their own job.' };
    }

    // Revert if already applied to this job
    const existing = applications.find(
      (a) =>
        a.jobId === jobId &&
        a.applicant.toLowerCase() === address.toLowerCase() &&
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

        setIsPendingTx(false);
        setTimeout(() => fetchAllData(), 2000);
        return { success: true, hash };
      }
    } catch (err: any) {
      setIsPendingTx(false);
      return { success: false, error: err.message || 'Failed to apply' };
    }

    setIsPendingTx(false);
    return { success: false, error: 'Wallet not connected' };
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

        setIsPendingTx(false);
        setTimeout(() => fetchAllData(), 2000);
        return { success: true, hash };
      }
    } catch (err: any) {
      setIsPendingTx(false);
      return { success: false, error: err.message || 'Failed to shortlist applicant' };
    }

    setIsPendingTx(false);
    return { success: false, error: 'Wallet not connected' };
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

        setIsPendingTx(false);
        setTimeout(() => fetchAllData(), 2000);
        return { success: true, hash };
      }
    } catch (err: any) {
      setIsPendingTx(false);
      return { success: false, error: err.message || 'Failed to withdraw stake' };
    }

    setIsPendingTx(false);
    return { success: false, error: 'Wallet not connected' };
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
        setTimeout(() => fetchAllData(), 2000);
        return { success: true, hash };
      }
    } catch (err: any) {
      setIsPendingTx(false);
      return { success: false, error: err.message || 'Failed to update refund policy' };
    }

    setIsPendingTx(false);
    return { success: false, error: 'Wallet not connected' };
  };

  return (
    <ContractContext.Provider
      value={{
        jobs,
        applications,
        stats,
        stakeRefundEnabled,
        isLoading,
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
