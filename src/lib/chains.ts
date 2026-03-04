/** Chain ID → human-readable name and optional icon color. */

export interface ChainMeta {
  name: string
  /** Hex color for the chain badge */
  color: string
}

/** Supported ERC-8004 networks. */
const CHAINS: Record<number, ChainMeta> = {
  // Mainnet chains
  1: { name: 'Ethereum', color: '#627EEA' },
  10: { name: 'Optimism', color: '#FF0420' },
  56: { name: 'BNB Chain', color: '#F0B90B' },
  100: { name: 'Gnosis', color: '#04795B' },
  137: { name: 'Polygon', color: '#8247E5' },
  143: { name: 'Monad', color: '#836EF9' },
  2741: { name: 'Abstract', color: '#0052FF' },
  4326: { name: 'MegaETH', color: '#FF6B00' },
  5000: { name: 'Mantle', color: '#000000' },
  8453: { name: 'Base', color: '#0052FF' },
  42161: { name: 'Arbitrum', color: '#28A0F0' },
  42220: { name: 'Celo', color: '#35D07F' },
  43114: { name: 'Avalanche', color: '#E84142' },
  59144: { name: 'Linea', color: '#61DFFF' },
  167000: { name: 'Taiko', color: '#E81899' },
  534352: { name: 'Scroll', color: '#FFEEDA' },
  // Testnet chains
  97: { name: 'BNB Testnet', color: '#F0B90B' },
  10143: { name: 'Monad Testnet', color: '#836EF9' },
  11124: { name: 'Abstract Testnet', color: '#0052FF' },
  6342: { name: 'MegaETH Testnet', color: '#FF6B00' },
  5003: { name: 'Mantle Sepolia', color: '#000000' },
  43113: { name: 'Avalanche Fuji', color: '#E84142' },
  44787: { name: 'Celo Alfajores', color: '#35D07F' },
  59141: { name: 'Linea Sepolia', color: '#61DFFF' },
  80002: { name: 'Polygon Amoy', color: '#8247E5' },
  84532: { name: 'Base Sepolia', color: '#0052FF' },
  421614: { name: 'Arbitrum Sepolia', color: '#28A0F0' },
  534351: { name: 'Scroll Sepolia', color: '#FFEEDA' },
  11155111: { name: 'Ethereum Sepolia', color: '#CFB5F0' },
  11155420: { name: 'Optimism Sepolia', color: '#FF0420' },
}

/** Resolve chain metadata, falling back to a generic entry. */
export function getChain(chainId: number): ChainMeta {
  return (
    CHAINS[chainId] ?? {
      name: `Chain ${chainId}`,
      color: '#888078',
    }
  )
}
