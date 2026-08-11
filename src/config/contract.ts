import { TokenInfo } from '../types';

export const ARC_TESTNET_CHAIN_ID = 5042002;

export const RHINESTONE_CONTRACT_ADDRESS: `0x${string}` =
  (import.meta.env.VITE_RHINESTONE_CONTRACT_ADDRESS as `0x${string}`) ||
  '0x2cE9B69BdF095f75D92F15734cB4eE267637d311';

export const ADMIN_WALLET_ADDRESS: `0x${string}` =
  '0xe368bC2Ad3744714a4Eb318D1aC54A2f0194E0fa';

export const TOKENS: Record<string, TokenInfo> = {
  ARC: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ARC',
    decimals: 18,
    name: 'Arc Native Token',
  },
  USDC: {
    address: '0x3600000000000000000000000000000000000000',
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin',
  },
  EURC: {
    address: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a',
    symbol: 'EURC',
    decimals: 6,
    name: 'Euro Coin',
  },
};

export const RHINESTONE_ABI = [
  {
    inputs: [
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'stakeToken', type: 'address' },
      { name: 'applicationStake', type: 'uint256' },
    ],
    name: 'postJob',
    outputs: [{ name: 'jobId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'jobId', type: 'uint256' }],
    name: 'closeJob',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'jobId', type: 'uint256' },
      { name: 'profileLink', type: 'string' },
    ],
    name: 'applyToJob',
    outputs: [{ name: 'applicationId', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'applicationId', type: 'uint256' }],
    name: 'shortlistApplicant',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'applicationId', type: 'uint256' }],
    name: 'withdrawStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'enabled', type: 'bool' }],
    name: 'setStakeRefundPolicy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'jobId', type: 'uint256' }],
    name: 'getJob',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'poster', type: 'address' },
          { name: 'title', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'stakeToken', type: 'address' },
          { name: 'applicationStake', type: 'uint256' },
          { name: 'isOpen', type: 'bool' },
          { name: 'createdAt', type: 'uint256' },
        ],
        name: 'job',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'applicationId', type: 'uint256' }],
    name: 'getApplication',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'jobId', type: 'uint256' },
          { name: 'applicant', type: 'address' },
          { name: 'profileLink', type: 'string' },
          { name: 'isShortlisted', type: 'bool' },
          { name: 'isWithdrawn', type: 'bool' },
          { name: 'appliedAt', type: 'uint256' },
        ],
        name: 'app',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'jobId', type: 'uint256' }],
    name: 'getApplicationsForJob',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'jobId', type: 'uint256' },
          { name: 'applicant', type: 'address' },
          { name: 'profileLink', type: 'string' },
          { name: 'isShortlisted', type: 'bool' },
          { name: 'isWithdrawn', type: 'bool' },
          { name: 'appliedAt', type: 'uint256' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'applicant', type: 'address' }],
    name: 'getApplicationsByApplicant',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'jobId', type: 'uint256' },
          { name: 'applicant', type: 'address' },
          { name: 'profileLink', type: 'string' },
          { name: 'isShortlisted', type: 'bool' },
          { name: 'isWithdrawn', type: 'bool' },
          { name: 'appliedAt', type: 'uint256' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'poster', type: 'address' }],
    name: 'getJobsByPoster',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'poster', type: 'address' },
          { name: 'title', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'stakeToken', type: 'address' },
          { name: 'applicationStake', type: 'uint256' },
          { name: 'isOpen', type: 'bool' },
          { name: 'createdAt', type: 'uint256' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPlatformStats',
    outputs: [
      { name: 'totalJobs', type: 'uint256' },
      { name: 'activeJobs', type: 'uint256' },
      { name: 'totalApplications', type: 'uint256' },
      { name: 'stakeRefundEnabled', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stakeRefundEnabled',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
