/** Chain ID → human-readable name and optional icon color. */

export interface ChainMeta {
  name: string
  /** Short label for badges */
  short: string
  /** Hex color for the chain badge */
  color: string
}

/** Known EVM chains. Add more as needed. */
const CHAINS: Record<number, ChainMeta> = {
  1: { name: 'Ethereum', short: 'ETH', color: '#627EEA' },
  10: { name: 'Optimism', short: 'OP', color: '#FF0420' },
  56: { name: 'BNB Chain', short: 'BNB', color: '#F0B90B' },
  100: { name: 'Gnosis', short: 'GNO', color: '#04795B' },
  137: { name: 'Polygon', short: 'MATIC', color: '#8247E5' },
  8453: { name: 'Base', short: 'Base', color: '#0052FF' },
  42161: { name: 'Arbitrum', short: 'ARB', color: '#28A0F0' },
  43114: { name: 'Avalanche', short: 'AVAX', color: '#E84142' },
  11155111: { name: 'Sepolia', short: 'SEP', color: '#CFB5F0' },
  84532: { name: 'Base Sepolia', short: 'B.SEP', color: '#0052FF' },
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
