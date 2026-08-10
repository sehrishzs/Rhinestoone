import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { injectedWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';

export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    name: 'Arc',
    symbol: 'ARC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
    },
  },
  testnet: true,
});

export const walletConnectProjectId =
  (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string) ||
  '044601f652123a436438a53e95f86a53';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Wallets',
      wallets: [injectedWallet, coinbaseWallet],
    },
  ],
  {
    appName: 'Rhinestone',
    projectId: walletConnectProjectId,
  }
);

export const wagmiConfig = createConfig({
  connectors,
  chains: [arcTestnet],
  transports: {
    [arcTestnet.id]: http(),
  },
});


