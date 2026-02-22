import type { FC } from 'react'
import { LoaderIcon, ChevronsDownIcon } from 'lucide-react'
import type { SearchResultItem } from '@/lib/types'
import { AgentCard } from '@/components/AgentCard'
import { EmptyState } from '@/components/EmptyState'

interface AgentGridProps {
  results: SearchResultItem[]
  loading: boolean
  error: string | null
  hasMore: boolean
  query: string
  onLoadMore: () => void
  onSelect: (item: SearchResultItem) => void
}

/** Responsive grid of agent cards with pagination. */
export const AgentGrid: FC<AgentGridProps> = ({
  results,
  loading,
  error,
  hasMore,
  query,
  onLoadMore,
  onSelect,
}) => {
  // Show empty state when there are no results
  if (!loading && results.length === 0) {
    return <EmptyState query={query} error={error} />
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Result count */}
      {results.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing {results.length} agent{results.length === 1 ? '' : 's'}
        </p>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <AgentCard key={`${item.agentId}-${item.rank}`} item={item} onSelect={onSelect} />
        ))}
      </div>

      {/* Error banner (for load-more failures) */}
      {error && results.length > 0 && (
        <p className="text-center text-xs text-destructive/80">{error}</p>
      )}

      {/* Load more — minimal icon trigger */}
      {hasMore && (
        <div className="flex flex-col items-center gap-1.5 pt-2">
          <button
            onClick={onLoadMore}
            disabled={loading}
            aria-label="Load more agents"
            className="group flex size-9 items-center justify-center rounded-full border border-border/50 text-muted-foreground/50 transition-all hover:border-border hover:text-foreground/70 hover:shadow-sm active:scale-95 disabled:pointer-events-none"
          >
            {loading ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <ChevronsDownIcon className="size-4 transition-transform group-hover:translate-y-0.5" />
            )}
          </button>
          <span className="text-[11px] text-muted-foreground/40">
            {loading ? 'Loading…' : 'Load more'}
          </span>
        </div>
      )}

      {/* End-of-list indicator */}
      {!hasMore && results.length > 0 && (
        <div className="flex items-center gap-3 py-2">
          <div className="h-px flex-1 bg-border/40" />
          <span className="text-[11px] text-muted-foreground/40">
            All {results.length} agents loaded
          </span>
          <div className="h-px flex-1 bg-border/40" />
        </div>
      )}
    </div>
  )
}
