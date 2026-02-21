import type { FC } from 'react'
import { LoaderIcon } from 'lucide-react'
import type { SearchResultItem } from '@/lib/types'
import { AgentCard } from '@/components/AgentCard'
import { EmptyState } from '@/components/EmptyState'

interface AgentGridProps {
  results: SearchResultItem[]
  total: number
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
  total,
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
          Showing {results.length} of {total} agents
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

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-accent/50 px-5 py-2 text-xs font-medium text-foreground/80 transition-colors hover:bg-accent disabled:opacity-50"
          >
            {loading && <LoaderIcon className="size-3.5 animate-spin" />}
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}
