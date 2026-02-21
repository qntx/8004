import { API_URL } from './constants'
import type { SearchRequest, SearchResponse } from './types'

/** Perform a semantic search against the ERC-8004 search service. */
export async function searchAgents(req: SearchRequest): Promise<SearchResponse> {
  const res = await fetch(`${API_URL}/api/v1/search`, {
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
