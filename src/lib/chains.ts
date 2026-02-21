/** Chain ID → human-readable name and optional icon color. */

export interface ChainMeta {
  name: string
  /** Short label for badges */
  short: string
  /** Hex color for the chain badge */
  color: string
}

/** Supported ERC-8004 networks. */
const CHAINS: Record<number, ChainMeta> = {
  // Mainnet chains
  1: { name: 'Ethereum', short: 'ETH', color: '#627EEA' },
  10: { name: 'Optimism', short: 'OP', color: '#FF0420' },
  56: { name: 'BNB Chain', short: 'BNB', color: '#F0B90B' },
  100: { name: 'Gnosis', short: 'GNO', color: '#04795B' },
  137: { name: 'Polygon', short: 'MATIC', color: '#8247E5' },
  143: { name: 'Monad', short: 'MON', color: '#836EF9' },
  2741: { name: 'Abstract', short: 'ABS', color: '#0052FF' },
  4326: { name: 'MegaETH', short: 'METH', color: '#FF6B00' },
  5000: { name: 'Mantle', short: 'MNT', color: '#000000' },
  8453: { name: 'Base', short: 'Base', color: '#0052FF' },
  42161: { name: 'Arbitrum', short: 'ARB', color: '#28A0F0' },
  42220: { name: 'Celo', short: 'CELO', color: '#FCFF52' },
  43114: { name: 'Avalanche', short: 'AVAX', color: '#E84142' },
  59144: { name: 'Linea', short: 'LNA', color: '#61DFFF' },
  167000: { name: 'Taiko', short: 'TAIKO', color: '#E81899' },
  534352: { name: 'Scroll', short: 'SCR', color: '#FFEEDA' },
  // Testnet chains
  97: { name: 'BNB Testnet', short: 'tBNB', color: '#F0B90B' },
  10143: { name: 'Monad Testnet', short: 'tMON', color: '#836EF9' },
  11124: { name: 'Abstract Testnet', short: 'tABS', color: '#0052FF' },
  6342: { name: 'MegaETH Testnet', short: 'tMETH', color: '#FF6B00' },
  5003: { name: 'Mantle Sepolia', short: 'tMNT', color: '#000000' },
  43113: { name: 'Avalanche Fuji', short: 'tAVAX', color: '#E84142' },
  44787: { name: 'Celo Alfajores', short: 'tCELO', color: '#FCFF52' },
  59141: { name: 'Linea Sepolia', short: 'tLNA', color: '#61DFFF' },
  80002: { name: 'Polygon Amoy', short: 'tMATIC', color: '#8247E5' },
  84532: { name: 'Base Sepolia', short: 'tBase', color: '#0052FF' },
  421614: { name: 'Arbitrum Sepolia', short: 'tARB', color: '#28A0F0' },
  534351: { name: 'Scroll Sepolia', short: 'tSCR', color: '#FFEEDA' },
  11155111: { name: 'Ethereum Sepolia', short: 'tETH', color: '#CFB5F0' },
  11155420: { name: 'Optimism Sepolia', short: 'tOP', color: '#FF0420' },
}

/** Resolve chain metadata, falling back to a generic entry. */
export function getChain(chainId: number): ChainMeta {
  return (
    CHAINS[chainId] ?? {
      name: `Chain ${chainId}`,
      short: `#${chainId}`,
      color: '#888078',
    }
  )
}
