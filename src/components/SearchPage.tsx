import { useCallback, useState } from 'react'
import { WalletIcon } from 'lucide-react'
import { Header } from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { AgentGrid } from '@/components/AgentGrid'
import { AgentDetailModal } from '@/components/AgentDetailModal'
import { WalletPrompt } from '@/components/WalletPrompt'
import { useSearch } from '@/hooks/use-search'
import { useFilters } from '@/hooks/use-filters'
import { useX402Fetch } from '@/hooks/use-x402-fetch'
import { MAX_CONTENT_WIDTH } from '@/lib/constants'
import type { SearchResultItem } from '@/lib/types'

/** Main search page with centered hero that transitions upward on search. */
export function SearchPage() {
  const [input, setInput] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [showWalletPrompt, setShowWalletPrompt] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<SearchResultItem | null>(null)
  const { fetchWithPayment, isReady: walletReady } = useX402Fetch()
  const { results, total, loading, error, hasMore, search, loadMore } = useSearch(fetchWithPayment)
  const filtersHook = useFilters()

  const dismissWalletPrompt = useCallback(() => setShowWalletPrompt(false), [])
  const closeDetail = useCallback(() => setSelectedAgent(null), [])

  /** Reset to the welcome hero view. */
  const resetToHome = useCallback(() => {
    setInput('')
    setSubmittedQuery('')
    setSelectedAgent(null)
    setShowWalletPrompt(false)
  }, [])

  const handleSubmit = useCallback(() => {
    const q = input.trim()
    if (!q) return
    if (!walletReady) {
      setShowWalletPrompt(true)
      return
    }
    setSubmittedQuery(q)
    search(q, filtersHook.filters)
  }, [input, search, walletReady, filtersHook.filters])

  // Layout transitions when a search has been performed
  const hasSearched = submittedQuery.length > 0

  return (
    <div className="flex min-h-dvh flex-col">
      <Header onBrandClick={resetToHome} />

      <main
        className="mx-auto flex w-full flex-1 flex-col px-6 pb-12"
        style={{ maxWidth: MAX_CONTENT_WIDTH }}
      >
        {/* Hero + Search — vertically centered when idle, top-aligned after submit */}
        <div
          className={[
            'flex w-full flex-col items-center gap-4 transition-all duration-500 ease-out',
            hasSearched ? 'pt-8' : 'flex-1 justify-center',
          ].join(' ')}
        >
          <h1
            className={[
              'font-display font-medium text-foreground transition-all duration-500',
              hasSearched ? 'text-xl' : 'text-3xl sm:text-4xl',
            ].join(' ')}
          >
            Agent Search
          </h1>
          <p
            className={[
              'text-center text-muted-foreground transition-all duration-500',
              hasSearched
                ? 'max-h-0 overflow-hidden opacity-0 text-[0px]'
                : 'max-h-10 text-xs opacity-100',
            ].join(' ')}
          >
            Semantic search across ERC-8004 registered AI agents
          </p>
          <SearchBar value={input} onChange={setInput} onSubmit={handleSubmit} loading={loading} />
          <FilterBar filters={filtersHook} />

          {/* Inline wallet connection prompt — replaces browser alert */}
          <WalletPrompt visible={showWalletPrompt} onDismiss={dismissWalletPrompt} />

          {/* Wallet connection hint */}
          {!walletReady && !showWalletPrompt && (
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
              <WalletIcon className="size-3" />
              Connect wallet for x402 payment-gated searches
            </p>
          )}
        </div>

        {/* Results — only rendered after explicit search */}
        {hasSearched && (
          <div className="mt-8 w-full">
            <AgentGrid
              results={results}
              total={total}
              loading={loading}
              error={error}
              hasMore={hasMore}
              query={submittedQuery}
              onLoadMore={loadMore}
              onSelect={setSelectedAgent}
            />
          </div>
        )}
      </main>

      <AgentDetailModal item={selectedAgent} onClose={closeDetail} />
    </div>
  )
}
