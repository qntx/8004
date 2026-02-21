import { useCallback, useEffect, useState } from 'react'
import { searchAgents } from '@/lib/api'
import { PAGE_SIZE } from '@/lib/constants'
import type { SearchResultItem } from '@/lib/types'

export interface SearchState {
  /** Current results (accumulated across pages when loading more). */
  results: SearchResultItem[]
  /** Total number of matching results on the server. */
  total: number
  /** Whether a request is in flight. */
  loading: boolean
  /** Error message from the last failed request, if any. */
  error: string | null
  /** Whether more results are available. */
  hasMore: boolean
  /** Cursor for the next page. */
  nextCursor: string | null
}

const INITIAL: SearchState = {
  results: [],
  total: 0,
  loading: false,
  error: null,
  hasMore: false,
  nextCursor: null,
}

/** Hook that manages search state and API calls. */
export function useSearch(query: string) {
  const [state, setState] = useState<SearchState>(INITIAL)

  // Reset and search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setState(INITIAL)
      return
    }

    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))

    searchAgents({ query, limit: PAGE_SIZE, includeMetadata: true })
      .then((res) => {
        if (cancelled) return
        setState({
          results: res.results,
          total: res.total,
          loading: false,
          error: null,
          hasMore: res.pagination?.hasMore ?? false,
          nextCursor: res.pagination?.nextCursor ?? null,
        })
      })
      .catch((err) => {
        if (cancelled) return
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : 'Search failed',
        }))
      })

    return () => {
      cancelled = true
    }
  }, [query])

  // Load more results using cursor pagination
  const loadMore = useCallback(() => {
    if (!query.trim() || !state.nextCursor || state.loading) return

    setState((s) => ({ ...s, loading: true }))

    searchAgents({
      query,
      limit: PAGE_SIZE,
      cursor: state.nextCursor ?? undefined,
      includeMetadata: true,
    })
      .then((res) => {
        setState((prev) => ({
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
  }, [query, state.nextCursor, state.loading])

  return { ...state, loadMore }
}
