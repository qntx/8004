import { useState } from 'react'
import { Header } from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { AgentGrid } from '@/components/AgentGrid'
import { useDebounce } from '@/hooks/use-debounce'
import { useSearch } from '@/hooks/use-search'
import { DEBOUNCE_MS, MAX_CONTENT_WIDTH } from '@/lib/constants'

/** Main search page with centered hero that transitions upward on search. */
export function SearchPage() {
  const [input, setInput] = useState('')
  const query = useDebounce(input, DEBOUNCE_MS)
  const search = useSearch(query)

  // Active = user has typed something (use raw input for instant transition)
  const isActive = input.trim().length > 0

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main
        className="mx-auto flex w-full flex-1 flex-col px-6 pb-12"
        style={{ maxWidth: MAX_CONTENT_WIDTH }}
      >
        {/* Hero + Search — vertically centered when idle, top-aligned when active */}
        <div
          className={[
            'flex w-full flex-col items-center gap-4 transition-all duration-500 ease-out',
            isActive ? 'pt-8' : 'flex-1 justify-center',
          ].join(' ')}
        >
          <h1
            className={[
              'font-display font-medium text-foreground transition-all duration-500',
              isActive ? 'text-xl' : 'text-3xl sm:text-4xl',
            ].join(' ')}
          >
            Agent Search
          </h1>
          <p
            className={[
              'text-center text-muted-foreground transition-all duration-500',
              isActive
                ? 'max-h-0 overflow-hidden opacity-0 text-[0px]'
                : 'max-h-10 text-xs opacity-100',
            ].join(' ')}
          >
            Semantic search across ERC-8004 registered AI agents
          </p>
          <SearchBar value={input} onChange={setInput} loading={search.loading} />
        </div>

        {/* Results — only rendered when active */}
        {isActive && (
          <div className="mt-8 w-full">
            <AgentGrid
              results={search.results}
              total={search.total}
              loading={search.loading}
              error={search.error}
              hasMore={search.hasMore}
              query={query}
              onLoadMore={search.loadMore}
            />
          </div>
        )}
      </main>
    </div>
  )
}
