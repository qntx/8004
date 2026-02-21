import { useCallback, useRef, useState } from 'react'
import { searchAgents } from '@/lib/api'
import { PAGE_SIZE } from '@/lib/constants'
import type { SearchResultItem } from '@/lib/types'

/** Internal fetch state. */
interface FetchState {
  forQuery: string
  results: SearchResultItem[]
  total: number
  loading: boolean
  error: string | null
  hasMore: boolean
  nextCursor: string | null
}

const INITIAL: FetchState = {
  forQuery: '',
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
  /** Trigger a search for the given query. Called on form submit (Enter / button). */
  search: (query: string) => void
  /** Load the next page of results. */
  loadMore: () => void
}

/**
 * Hook that manages search state via explicit triggers (not auto-search).
 *
 * x402 requires user interaction (wallet signing) per request, so search
 * must only fire on explicit submit — never on keystroke or debounce.
 *
 * @param fetchFn - x402-enhanced fetch for payment-gated endpoints (null = global fetch)
 */
export function useSearch(fetchFn?: typeof globalThis.fetch | null): SearchResult {
  const [state, setState] = useState<FetchState>(INITIAL)
  const abortRef = useRef<AbortController | null>(null)

  const search = useCallback(
    (query: string) => {
      const q = query.trim()
      if (!q) return

      // x402 requires a connected wallet — refuse to search without one
      if (!fetchFn) {
        setState((s) => ({
          ...s,
          forQuery: q,
          loading: false,
          error: 'Wallet not connected. Please connect your wallet to search.',
        }))
        return
      }

      // Abort any in-flight request
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setState((s) => ({ ...s, loading: true, error: null, forQuery: q }))

      searchAgents({ query: q, limit: PAGE_SIZE, includeMetadata: true }, fetchFn)
        .then((res) => {
          if (controller.signal.aborted) return
          setState({
            forQuery: q,
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

    searchAgents(
      {
        query: state.forQuery,
        limit: PAGE_SIZE,
        cursor: state.nextCursor ?? undefined,
        includeMetadata: true,
      },
      fetchFn,
    )
      .then((res) => {
        setState((prev) => ({
          forQuery: prev.forQuery,
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
  }, [state.forQuery, state.nextCursor, state.loading, fetchFn])

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
