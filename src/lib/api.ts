import { API_URL } from './constants'
import type { SearchRequest, SearchResponse } from './types'

/**
 * Perform a semantic search against the ERC-8004 search service.
 *
 * @param req - Search request parameters
 * @param fetchFn - Optional custom fetch function (e.g. x402-enhanced fetch
 *   that automatically handles HTTP 402 payment challenges)
 */
export async function searchAgents(
  req: SearchRequest,
  fetchFn: typeof globalThis.fetch = globalThis.fetch,
): Promise<SearchResponse> {
  const res = await fetchFn(`${API_URL}/api/v1/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error')
    throw new Error(`Search failed (${res.status}): ${text}`)
  }

  return res.json()
}
