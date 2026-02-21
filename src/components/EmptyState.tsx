import type { FC } from 'react'
import { SearchIcon, AlertCircleIcon } from 'lucide-react'

/** Empty state shown before any search or when no results are found. */
export const EmptyState: FC<{ query: string; error: string | null }> = ({ query, error }) => {
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <AlertCircleIcon className="size-10 text-destructive/60" />
        <p className="text-sm text-destructive/80">{error}</p>
      </div>
    )
  }

  if (query) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <SearchIcon className="size-10 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No agents found for &ldquo;{query}&rdquo;</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <SearchIcon className="size-10 text-muted-foreground/30" />
      <div>
        <p className="font-display text-lg text-foreground/80">Discover AI Agents</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Search across ERC-8004 registered agents by capability, protocol, or description.
        </p>
      </div>
    </div>
  )
}
