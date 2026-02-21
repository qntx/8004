import { SearchIcon, XIcon, LoaderIcon } from 'lucide-react'
import type { FC } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  loading: boolean
}

/** Prominent search input with clear button and loading indicator. */
export const SearchBar: FC<SearchBarProps> = ({ value, onChange, loading }) => {
  return (
    <div className="relative w-full max-w-2xl">
      <SearchIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search AI agents by capability..."
        className="w-full rounded-xl border border-input bg-background py-3 pl-11 pr-10 text-sm outline-none transition-shadow placeholder:text-muted-foreground/50 focus:border-ring focus:ring-2 focus:ring-ring/20"
        autoFocus
      />
      {loading && (
        <LoaderIcon className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground/60" />
      )}
      {!loading && value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
          aria-label="Clear search"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  )
}
