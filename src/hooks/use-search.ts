import { useCallback, useEffect, useState } from 'react'
import { searchAgents } from '@/lib/api'
import { PAGE_SIZE } from '@/lib/constants'
import type { SearchResultItem } from '@/lib/types'

/** Internal state that tracks which query results belong to. */
interface FetchState {
  forQuery: string
  results: SearchResultItem[]
  total: number
  error: string | null
  hasMore: boolean
  nextCursor: string | null
  isLoadingMore: boolean
}

const INITIAL_FETCH: FetchState = {
  forQuery: '',
  results: [],
  total: 0,
  error: null,
  hasMore: false,
  nextCursor: null,
  isLoadingMore: false,
}

/** Public shape returned by the hook. */
export interface SearchResult {
  results: SearchResultItem[]
  total: number
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
}

const EMPTY_RESULT: SearchResult = {
  results: [],
  total: 0,
  loading: false,
  error: null,
  hasMore: false,
  loadMore: () => {},
}

/** Hook that manages search state and API calls. */
export function useSearch(query: string): SearchResult {
  const [state, setState] = useState<FetchState>(INITIAL_FETCH)

  // Fetch results when query changes (only for non-empty queries).
  // No synchronous setState — loading is derived from query vs forQuery mismatch.
  useEffect(() => {
    if (!query.trim()) return

    let cancelled = false

    searchAgents({ query, limit: PAGE_SIZE, includeMetadata: true })
      .then((res) => {
        if (cancelled) return
        setState({
          forQuery: query,
          results: res.results,
          total: res.total,
          error: null,
          hasMore: res.pagination?.hasMore ?? false,
          nextCursor: res.pagination?.nextCursor ?? null,
          isLoadingMore: false,
        })
      })
      .catch((err) => {
        if (cancelled) return
        setState((s) => ({
          ...s,
          forQuery: query,
          error: err instanceof Error ? err.message : 'Search failed',
          isLoadingMore: false,
        }))
      })

    return () => {
      cancelled = true
    }
  }, [query])

  // Load more results using cursor pagination (called from event handler, not effect)
  const loadMore = useCallback(() => {
    if (!query.trim() || !state.nextCursor || state.isLoadingMore) return

    setState((s) => ({ ...s, isLoadingMore: true }))

    searchAgents({
      query,
      limit: PAGE_SIZE,
      cursor: state.nextCursor ?? undefined,
      includeMetadata: true,
    })
      .then((res) => {
        setState((prev) => ({
          forQuery: query,
          results: [...prev.results, ...res.results],
          total: res.total,
          error: null,
          hasMore: res.pagination?.hasMore ?? false,
          nextCursor: res.pagination?.nextCursor ?? null,
          isLoadingMore: false,
        }))
      })
      .catch((err) => {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Failed to load more',
          isLoadingMore: false,
        }))
      })
  }, [query, state.nextCursor, state.isLoadingMore])

  // Derive public state without imperative resets
  if (!query.trim()) return EMPTY_RESULT

  const isNewSearch = state.forQuery !== query

  return {
    results: isNewSearch ? [] : state.results,
    total: isNewSearch ? 0 : state.total,
    loading: isNewSearch || state.isLoadingMore,
    error: isNewSearch ? null : state.error,
    hasMore: isNewSearch ? false : state.hasMore,
    loadMore,
  }
}
