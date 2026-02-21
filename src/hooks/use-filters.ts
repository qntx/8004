import { useCallback, useMemo, useState } from 'react'
import type { Filters } from '@/lib/types'

/**
 * Standard service protocol names from the ERC-8004 registration file specification.
 *
 * @see https://eips.ethereum.org/EIPS/eip-8004#agent-uri-and-agent-registration-file
 *
 * Note: `services[].name` is an open field — agents MAY use any protocol name.
 * These are the well-known values defined in the official EIP-8004 example.
 */
export const SERVICE_PROTOCOLS = ['MCP', 'A2A', 'OASF', 'ENS', 'DID', 'web', 'email'] as const

/**
 * Standard trust models from the ERC-8004 specification.
 *
 * @see https://eips.ethereum.org/EIPS/eip-8004#security-considerations
 *
 * The three trust models:
 * - reputation: client feedback systems
 * - crypto-economic: stake-secured re-execution / validation
 * - tee-attestation: trusted execution environment oracles
 */
export const TRUST_MODELS = ['reputation', 'crypto-economic', 'tee-attestation'] as const

/** Wallet filter mode for reputation re-aggregation. */
export type WalletFilterMode = 'none' | 'exclude' | 'include'

/** User-facing filter state — easier to work with than the raw API Filters shape. */
export interface FilterState {
  /** Selected service protocol names (serviceName IN filter). */
  serviceNames: Set<string>
  /** Selected trust models (supportedTrust IN filter). */
  trustModels: Set<string>
  /** Only show active agents (active = true). null = no filter. */
  activeOnly: boolean
  /** Only show agents with x402 support. null = no filter. */
  x402Only: boolean
  /** Wallet filter mode for reputation re-aggregation. */
  walletFilterMode: WalletFilterMode
  /** Raw comma-separated wallet addresses input. */
  walletAddresses: string
}

const INITIAL: FilterState = {
  serviceNames: new Set(),
  trustModels: new Set(),
  activeOnly: false,
  x402Only: false,
  walletFilterMode: 'none',
  walletAddresses: '',
}

/** Parsed wallet addresses for the API request. */
export interface WalletFilterParams {
  reputationExcludeWallets?: string[]
  reputationIncludeWallets?: string[]
}

/** Public shape returned by the hook. */
export interface UseFiltersResult {
  /** Current UI filter state. */
  state: FilterState
  /** Derived API-compatible Filters object (empty when no filters active). */
  filters: Filters
  /** Derived wallet filter params for the search request. */
  walletFilterParams: WalletFilterParams
  /** Whether any filter is currently active. */
  hasActiveFilters: boolean
  /** Total count of active filter conditions. */
  activeCount: number
  /** Toggle a service protocol name on/off. */
  toggleService: (name: string) => void
  /** Toggle a trust model on/off. */
  toggleTrust: (name: string) => void
  /** Toggle the "active only" boolean filter. */
  toggleActiveOnly: () => void
  /** Toggle the "x402 support" boolean filter. */
  toggleX402Only: () => void
  /** Set the wallet filter mode (none / exclude / include). */
  setWalletFilterMode: (mode: WalletFilterMode) => void
  /** Set the raw wallet addresses input string. */
  setWalletAddresses: (value: string) => void
  /** Reset all filters to their defaults. */
  resetAll: () => void
}

/**
 * Hook that manages user-facing filter state and converts it to the
 * ERC-8004 Semantic Search Standard v1 `Filters` object.
 *
 * Filter changes are local state only — they take effect on the next
 * explicit search submit (consistent with x402 per-request signing).
 */
export function useFilters(): UseFiltersResult {
  const [state, setState] = useState<FilterState>(INITIAL)

  const toggleService = useCallback((name: string) => {
    setState((s) => {
      const next = new Set(s.serviceNames)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return { ...s, serviceNames: next }
    })
  }, [])

  const toggleTrust = useCallback((name: string) => {
    setState((s) => {
      const next = new Set(s.trustModels)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return { ...s, trustModels: next }
    })
  }, [])

  const toggleActiveOnly = useCallback(() => {
    setState((s) => ({ ...s, activeOnly: !s.activeOnly }))
  }, [])

  const toggleX402Only = useCallback(() => {
    setState((s) => ({ ...s, x402Only: !s.x402Only }))
  }, [])

  const setWalletFilterMode = useCallback((mode: WalletFilterMode) => {
    setState((s) => ({ ...s, walletFilterMode: mode }))
  }, [])

  const setWalletAddresses = useCallback((value: string) => {
    setState((s) => ({ ...s, walletAddresses: value }))
  }, [])

  const resetAll = useCallback(() => setState(INITIAL), [])

  // Derive the API-compatible Filters object from UI state
  const filters = useMemo<Filters>(() => {
    const f: Filters = {}

    if (state.serviceNames.size > 0) {
      f.in = { ...f.in, serviceName: [...state.serviceNames] }
    }
    if (state.trustModels.size > 0) {
      f.in = { ...f.in, supportedTrust: [...state.trustModels] }
    }
    if (state.activeOnly) {
      f.equals = { ...f.equals, active: true }
    }
    if (state.x402Only) {
      f.equals = { ...f.equals, x402Support: true }
    }

    return f
  }, [state])

  // Parse wallet addresses into API params
  const walletFilterParams = useMemo<WalletFilterParams>(() => {
    if (state.walletFilterMode === 'none' || !state.walletAddresses.trim()) return {}
    const addrs = state.walletAddresses
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (addrs.length === 0) return {}
    return state.walletFilterMode === 'exclude'
      ? { reputationExcludeWallets: addrs }
      : { reputationIncludeWallets: addrs }
  }, [state.walletFilterMode, state.walletAddresses])

  const walletActive = state.walletFilterMode !== 'none' && state.walletAddresses.trim().length > 0
  const activeCount =
    state.serviceNames.size +
    state.trustModels.size +
    (state.activeOnly ? 1 : 0) +
    (state.x402Only ? 1 : 0) +
    (walletActive ? 1 : 0)

  return {
    state,
    filters,
    walletFilterParams,
    hasActiveFilters: activeCount > 0,
    activeCount,
    toggleService,
    toggleTrust,
    toggleActiveOnly,
    toggleX402Only,
    setWalletFilterMode,
    setWalletAddresses,
    resetAll,
  }
}
