import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { injectedWallet, walletConnectWallet, rainbowWallet } from '@rainbow-me/rainbowkit/wallets'
import { base, mainnet } from 'viem/chains'

/** WalletConnect project ID — override via VITE_WC_PROJECT_ID env var */
const WALLETCONNECT_PROJECT_ID =
  import.meta.env.VITE_WC_PROJECT_ID ?? 'd95fae64c47b28d0fa1cb252d50b5000'

export const wagmiConfig = getDefaultConfig({
  appName: 'ERC-8004 Search',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [base, mainnet],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [injectedWallet, rainbowWallet, walletConnectWallet],
    },
  ],
})
