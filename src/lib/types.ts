/** API types matching the ERC-8004 Semantic Search Standard v1. */

/** POST /api/v1/search request body. */
export interface SearchRequest {
  query: string
  limit?: number
  offset?: number
  cursor?: string
  filters?: Filters
  minScore?: number
  includeMetadata?: boolean
  /** Wallet addresses to exclude from reputation re-aggregation. */
  reputationExcludeWallets?: string[]
  /** Wallet addresses to exclusively include in reputation re-aggregation. */
  reputationIncludeWallets?: string[]
}

/** Structured filter criteria. */
export interface Filters {
  equals?: Record<string, unknown>
  in?: Record<string, unknown[]>
  notIn?: Record<string, unknown[]>
  exists?: string[]
  notExists?: string[]
}

/** POST /api/v1/search response body. */
export interface SearchResponse {
  query: string
  results: SearchResultItem[]
  total: number
  pagination?: PaginationMeta
  requestId: string
  timestamp: string
  provider: ProviderInfo
}

/** A single search result. */
export interface SearchResultItem {
  rank: number
  agentId: string
  chainId: number
  name: string
  description: string
  score: number
  metadata?: ResultMetadata
  matchReasons: string[]
}

/** Per-wallet feedback breakdown returned by the API. */
export interface FeedbackDetail {
  /** Wallet address (abbreviated key "w" from the API). */
  w: string
  /** Average score from this wallet. */
  s: number
  /** Number of feedbacks from this wallet. */
  c: number
}

/** Extended metadata for a search result. */
export interface ResultMetadata {
  agentURI: string
  image: string
  active: boolean
  x402Support: boolean
  supportedTrust: string[]
  services: ServiceEntry[]
  registrations: RegistrationEntry[]
  endpoint: string
  reputationScore: number
  /** Number of on-chain feedback submissions contributing to the score. */
  feedbackCount: number
  /** Per-wallet feedback breakdown. Empty array when no feedback exists. */
  feedbackDetails: FeedbackDetail[]
  createdAt: number
  updatedAt: string
}

/** Service entry from the agent registration file. */
export interface ServiceEntry {
  name: string
  endpoint: string
  version?: string
  skills?: string[]
  domains?: string[]
}

/** Registration entry from the agent registration file. */
export interface RegistrationEntry {
  agentId: number | string
  agentRegistry: string
}

/** Pagination metadata. */
export interface PaginationMeta {
  hasMore: boolean
  nextCursor?: string
  limit: number
  offset: number
}

/** Provider info. */
export interface ProviderInfo {
  name: string
  version: string
}

/** GET /api/v1/capabilities response body. */
export interface CapabilitiesResponse {
  version: string
  limits: {
    maxQueryLength: number
    maxLimit: number
    maxFilters: number
    maxRequestSize: number
  }
  supportedFilters: string[]
  supportedOperators: string[]
  features: {
    pagination: boolean
    cursorPagination: boolean
    metadataFiltering: boolean
    scoreThreshold: boolean
  }
}

/** API error response. */
export interface ApiError {
  error: string
  code: string
  status: number
  requestId: string
  timestamp: string
}
