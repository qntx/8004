import { useCallback, useRef, useState } from 'react'
import { searchAgents } from '@/lib/api'
import { PAGE_SIZE } from '@/lib/constants'
import type { Filters, SearchResultItem, SearchRequest } from '@/lib/types'
import type { WalletFilterParams } from '@/hooks/use-filters'

/** Internal fetch state. */
interface FetchState {
  forQuery: string
  forFilters: Filters | undefined
  forWalletFilter: WalletFilterParams
  results: SearchResultItem[]
  total: number
  loading: boolean
  error: string | null
  hasMore: boolean
  nextCursor: string | null
}

const INITIAL: FetchState = {
  forQuery: '',
  forFilters: undefined,
  forWalletFilter: {},
  results: [],
  total: 0,
  loading: false,
  error: null,
  hasMore: false,
  nextCursor: null,
}

/** Public shape returned by the hook. */
export interface SearchResult {
  results: SearchResultItem[]
  total: number
  loading: boolean
  error: string | null
  hasMore: boolean
  /** Trigger a search for the given query, optional filters, and wallet filter params. */
  search: (query: string, filters?: Filters, walletFilter?: WalletFilterParams) => void
  /** Load the next page of results. */
  loadMore: () => void
}

/**
 * Hook that manages search state via explicit triggers (not auto-search).
 *
 * x402 requires user interaction (wallet signing) per request, so search
 * must only fire on explicit submit — never on keystroke or debounce.
 *
 * @param fetchFn - x402-enhanced fetch for payment-gated endpoints (null = wallet not connected)
 */
export function useSearch(fetchFn?: typeof globalThis.fetch | null): SearchResult {
  const [state, setState] = useState<FetchState>(INITIAL)
  const abortRef = useRef<AbortController | null>(null)

  const search = useCallback(
    (query: string, filters?: Filters, walletFilter?: WalletFilterParams) => {
      const q = query.trim()
      if (!q) return

      const wf = walletFilter ?? {}

      // x402 requires a connected wallet — refuse to search without one
      if (!fetchFn) {
        setState((s) => ({
          ...s,
          forQuery: q,
          forFilters: filters,
          forWalletFilter: wf,
          loading: false,
          error: 'Wallet not connected. Please connect your wallet to search.',
        }))
        return
      }

      // Abort any in-flight request
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setState((s) => ({
        ...s,
        loading: true,
        error: null,
        forQuery: q,
        forFilters: filters,
        forWalletFilter: wf,
      }))

      // Strip empty filter objects to keep the request body clean
      const cleanFilters = filters && hasActiveFilters(filters) ? filters : undefined

      const req: SearchRequest = {
        query: q,
        limit: PAGE_SIZE,
        includeMetadata: true,
        filters: cleanFilters,
        ...wf,
      }

      searchAgents(req, fetchFn)
        .then((res) => {
          if (controller.signal.aborted) return
          setState({
            forQuery: q,
            forFilters: filters,
            forWalletFilter: wf,
            results: res.results,
            total: res.total,
            loading: false,
            error: null,
            hasMore: res.pagination?.hasMore ?? false,
            nextCursor: res.pagination?.nextCursor ?? null,
          })
        })
        .catch((err) => {
          if (controller.signal.aborted) return
          setState((s) => ({
            ...s,
            loading: false,
            error: err instanceof Error ? err.message : 'Search failed',
          }))
        })
    },
    [fetchFn],
  )

  const loadMore = useCallback(() => {
    if (!state.forQuery || !state.nextCursor || state.loading || !fetchFn) return

    setState((s) => ({ ...s, loading: true }))

    const cleanFilters =
      state.forFilters && hasActiveFilters(state.forFilters) ? state.forFilters : undefined

    const req: SearchRequest = {
      query: state.forQuery,
      limit: PAGE_SIZE,
      cursor: state.nextCursor ?? undefined,
      includeMetadata: true,
      filters: cleanFilters,
      ...state.forWalletFilter,
    }

    searchAgents(req, fetchFn)
      .then((res) => {
        setState((prev) => ({
          forQuery: prev.forQuery,
          forFilters: prev.forFilters,
          forWalletFilter: prev.forWalletFilter,
          results: [...prev.results, ...res.results],
          total: res.total,
          loading: false,
          error: null,
          hasMore: res.pagination?.hasMore ?? false,
          nextCursor: res.pagination?.nextCursor ?? null,
        }))
      })
      .catch((err) => {
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load more',
        }))
      })
  }, [
    state.forQuery,
    state.forFilters,
    state.forWalletFilter,
    state.nextCursor,
    state.loading,
    fetchFn,
  ])

  return {
    results: state.results,
    total: state.total,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    search,
    loadMore,
  }
}

/** Check whether a Filters object has at least one active condition. */
function hasActiveFilters(f: Filters): boolean {
  return (
    (f.equals != null && Object.keys(f.equals).length > 0) ||
    (f.in != null && Object.keys(f.in).length > 0) ||
    (f.notIn != null && Object.keys(f.notIn).length > 0) ||
    (f.exists != null && f.exists.length > 0) ||
    (f.notExists != null && f.notExists.length > 0)
  )
}
