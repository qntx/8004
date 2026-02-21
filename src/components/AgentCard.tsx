import type { FC } from 'react'
import { ExternalLinkIcon, ShieldCheckIcon, ZapIcon } from 'lucide-react'
import type { SearchResultItem } from '@/lib/types'
import { ScoreBadge } from '@/components/ScoreBadge'
import { ChainBadge } from '@/components/ChainBadge'
import { ServiceTag } from '@/components/ServiceTag'

/** Extract initials from an agent name for the avatar placeholder. */
function initials(name: string): string {
  return name
    .split(/[\s-]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

/** Single agent result card with metadata. */
export const AgentCard: FC<{
  item: SearchResultItem
  onSelect: (item: SearchResultItem) => void
}> = ({ item, onSelect }) => {
  const meta = item.metadata
  const services = meta?.services ?? []
  const hasEndpoint = meta?.endpoint && meta.endpoint.length > 0

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="group flex cursor-pointer flex-col gap-3 rounded-xl border border-border/60 bg-background p-4 text-left transition-all hover:shadow-md hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      {/* Top row: avatar + name + score */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {meta?.image ? (
          <img
            src={meta.image}
            alt={item.name}
            className="size-10 shrink-0 rounded-lg border border-border/40 object-cover"
          />
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-muted text-xs font-medium text-muted-foreground">
            {initials(item.name)}
          </div>
        )}

        {/* Name + ID */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-medium text-foreground">{item.name}</h3>
            {meta?.active && (
              <span className="size-1.5 shrink-0 rounded-full bg-green-500" title="Active" />
            )}
            {meta?.active === false && (
              <span
                className="size-1.5 shrink-0 rounded-full bg-muted-foreground/30"
                title="Inactive"
              />
            )}
          </div>
          <p className="truncate text-[11px] font-mono text-muted-foreground/60">{item.agentId}</p>
        </div>

        {/* Score */}
        <ScoreBadge score={item.score} />
      </div>

      {/* Description */}
      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {item.description || 'No description available.'}
      </p>

      {/* Tags row: chain + services + x402 */}
      <div className="flex flex-wrap items-center gap-1.5">
        <ChainBadge chainId={item.chainId} />
        {services.map((svc) => (
          <ServiceTag key={svc.name} name={svc.name} />
        ))}
        {meta?.x402Support && (
          <span
            className="inline-flex items-center gap-0.5 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
            title="x402 payment supported"
          >
            <ZapIcon className="size-2.5" />
            x402
          </span>
        )}
        {meta?.supportedTrust && meta.supportedTrust.length > 0 && (
          <span
            className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
            title={`Trust: ${meta.supportedTrust.join(', ')}`}
          >
            <ShieldCheckIcon className="size-2.5" />
            trust
          </span>
        )}
      </div>

      {/* Footer: endpoint hint */}
      {hasEndpoint && (
        <span className="mt-auto flex items-center gap-1 text-[11px] text-muted-foreground/60">
          <ExternalLinkIcon className="size-3" />
          <span className="truncate">{meta!.endpoint}</span>
        </span>
      )}
    </button>
  )
}
