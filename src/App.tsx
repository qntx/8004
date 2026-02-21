import { useState } from 'react'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Header } from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { AgentGrid } from '@/components/AgentGrid'
import { useDebounce } from '@/hooks/use-debounce'
import { useSearch } from '@/hooks/use-search'
import { DEBOUNCE_MS, MAX_CONTENT_WIDTH } from '@/lib/constants'

export default function App() {
  const [input, setInput] = useState('')
  const query = useDebounce(input, DEBOUNCE_MS)
  const search = useSearch(query)

  return (
    <ThemeProvider>
      <div className="flex min-h-dvh flex-col">
        <Header />

        <main
          className="mx-auto flex w-full flex-1 flex-col items-center gap-8 px-6 pb-12 pt-8"
          style={{ maxWidth: MAX_CONTENT_WIDTH }}
        >
          {/* Hero + Search */}
          <div className="flex w-full flex-col items-center gap-4">
            <h1 className="font-display text-2xl font-medium text-foreground sm:text-3xl">
              Agent Search
            </h1>
            <p className="text-center text-xs text-muted-foreground">
              Semantic search across ERC-8004 registered AI agents
            </p>
            <SearchBar value={input} onChange={setInput} loading={search.loading} />
          </div>

          {/* Results */}
          <div className="w-full">
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
        </main>
      </div>
    </ThemeProvider>
  )
}
