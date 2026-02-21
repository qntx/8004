import { SearchIcon, XIcon, LoaderIcon } from 'lucide-react'
import type { FC, FormEvent } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  /** Called when the user explicitly submits (Enter key or search button). */
  onSubmit: () => void
  loading: boolean
}

/** Search input with explicit submit via Enter or button click. */
export const SearchBar: FC<SearchBarProps> = ({ value, onChange, onSubmit, loading }) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim() && !loading) onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <SearchIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search AI agents by capability, then press Enter..."
        className="w-full rounded-xl border border-input bg-background py-3 pl-11 pr-20 text-sm outline-none transition-shadow placeholder:text-muted-foreground/50 focus:border-ring focus:ring-2 focus:ring-ring/20"
        autoFocus
      />
      {/* Right-side actions */}
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {loading && <LoaderIcon className="size-4 animate-spin text-muted-foreground/60" />}
        {!loading && value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="rounded p-1 text-muted-foreground/60 transition-colors hover:text-foreground"
            aria-label="Clear search"
          >
            <XIcon className="size-4" />
          </button>
        )}
        {!loading && value.trim() && (
          <button
            type="submit"
            className="rounded-lg bg-foreground/10 px-2.5 py-1 text-xs font-medium text-foreground/70 transition-colors hover:bg-foreground/20 hover:text-foreground"
          >
            Search
          </button>
        )}
      </div>
    </form>
  )
}
