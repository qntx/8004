import type { FC } from 'react'
import { getChain } from '@/lib/chains'

/** Compact chain badge showing the short chain name with its brand color. */
export const ChainBadge: FC<{ chainId: number }> = ({ chainId }) => {
  const chain = getChain(chainId)

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
      style={{
        backgroundColor: `${chain.color}18`,
        color: chain.color,
      }}
      title={chain.name}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: chain.color }} />
      {chain.short}
    </span>
  )
}
