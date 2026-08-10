export type TokenSymbol = 'ARC' | 'USDC' | 'EURC' | 'CUSTOM';

export interface TokenInfo {
  address: `0x${string}`;
  symbol: TokenSymbol;
  decimals: number;
  name: string;
}

export interface Job {
  id: bigint;
  poster: `0x${string}`;
  title: string;
  description: string;
  stakeToken: `0x${string}`;
  tokenSymbol: string;
  tokenDecimals: number;
  applicationStake: bigint;
  formattedStake: string;
  isOpen: boolean;
  applicantCount: number;
  createdAt: number;
}

export interface Application {
  id: bigint;
  jobId: bigint;
  applicant: `0x${string}`;
  profileLink: string;
  isShortlisted: boolean;
  isWithdrawn: boolean;
  stakedAmount: bigint;
  stakeToken: `0x${string}`;
  tokenSymbol: string;
  tokenDecimals: number;
  formattedStake: string;
  appliedAt: number;
  jobTitle?: string;
}

export interface PlatformStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalStakedUSD: string;
  stakeRefundEnabled: boolean;
}
