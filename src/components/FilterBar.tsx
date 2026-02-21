import { type FC, useCallback, useState } from 'react'
import { ChevronDownIcon, FilterIcon, RotateCcwIcon, ZapIcon, WalletIcon } from 'lucide-react'
import {
  SERVICE_PROTOCOLS,
  TRUST_MODELS,
  type UseFiltersResult,
  type WalletFilterMode,
} from '@/hooks/use-filters'

/** Collapsible filter bar for ERC-8004 search refinement. */
export const FilterBar: FC<{ filters: UseFiltersResult }> = ({ filters }) => {
  const [open, setOpen] = useState(false)

  const toggle = useCallback(() => setOpen((v) => !v), [])

  return (
    <div className="w-full max-w-2xl">
      {/* Toggle button */}
      <button
        type="button"
        onClick={toggle}
        className="group flex w-full items-center gap-2 rounded-lg px-1 py-1.5 text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
      >
        <FilterIcon className="size-3.5" />
        <span className="font-medium">Filters</span>
        {filters.activeCount > 0 && (
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-semibold text-foreground">
            {filters.activeCount}
          </span>
        )}
        <ChevronDownIcon
          className={[
            'ml-auto size-3.5 transition-transform duration-200',
            open ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {/* Collapsible panel */}
      <div
        className={[
          'grid transition-[grid-template-rows] duration-200 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        ].join(' ')}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 pt-3 pb-1">
            {/* Service protocols */}
            <FilterSection title="Protocols">
              <ChipGroup
                options={SERVICE_PROTOCOLS}
                selected={filters.state.serviceNames}
                onToggle={filters.toggleService}
              />
            </FilterSection>

            {/* Trust models */}
            <FilterSection title="Trust Models">
              <ChipGroup
                options={TRUST_MODELS}
                selected={filters.state.trustModels}
                onToggle={filters.toggleTrust}
              />
            </FilterSection>

            {/* Boolean toggles */}
            <FilterSection title="Status">
              <div className="flex flex-wrap items-center gap-2">
                <ToggleChip
                  label="Active Only"
                  active={filters.state.activeOnly}
                  onToggle={filters.toggleActiveOnly}
                />
                <ToggleChip
                  label="x402 Support"
                  active={filters.state.x402Only}
                  onToggle={filters.toggleX402Only}
                  icon={<ZapIcon className="size-3" />}
                />
              </div>
            </FilterSection>

            {/* Wallet reputation filter */}
            <FilterSection title="Reputation Wallets">
              <WalletFilter
                mode={filters.state.walletFilterMode}
                addresses={filters.state.walletAddresses}
                onModeChange={filters.setWalletFilterMode}
                onAddressesChange={filters.setWalletAddresses}
              />
            </FilterSection>

            {/* Reset */}
            {filters.hasActiveFilters && (
              <button
                type="button"
                onClick={filters.resetAll}
                className="flex items-center gap-1.5 self-start rounded-md px-2 py-1 text-[11px] text-muted-foreground/60 transition-colors hover:text-foreground"
              >
                <RotateCcwIcon className="size-3" />
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Labelled section within the filter panel. */
const FilterSection: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
      {title}
    </span>
    {children}
  </div>
)

/** Multi-select chip group. */
const ChipGroup: FC<{
  options: readonly string[]
  selected: Set<string>
  onToggle: (value: string) => void
}> = ({ options, selected, onToggle }) => (
  <div className="flex flex-wrap gap-1.5">
    {options.map((opt) => {
      const isActive = selected.has(opt)
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={[
            'rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors',
            isActive
              ? 'border-foreground/20 bg-foreground/10 text-foreground'
              : 'border-border/60 bg-transparent text-muted-foreground/60 hover:border-border hover:text-muted-foreground',
          ].join(' ')}
        >
          {opt}
        </button>
      )
    })}
  </div>
)

/** Wallet reputation filter — mode selector + addresses input. */
const WalletFilter: FC<{
  mode: WalletFilterMode
  addresses: string
  onModeChange: (mode: WalletFilterMode) => void
  onAddressesChange: (value: string) => void
}> = ({ mode, addresses, onModeChange, onAddressesChange }) => {
  const modes: { value: WalletFilterMode; label: string }[] = [
    { value: 'none', label: 'Off' },
    { value: 'exclude', label: 'Exclude' },
    { value: 'include', label: 'Include Only' },
  ]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {modes.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => onModeChange(m.value)}
            className={[
              'inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors',
              mode === m.value
                ? 'border-foreground/20 bg-foreground/10 text-foreground'
                : 'border-border/60 bg-transparent text-muted-foreground/60 hover:border-border hover:text-muted-foreground',
            ].join(' ')}
          >
            {m.value !== 'none' && <WalletIcon className="size-3" />}
            {m.label}
          </button>
        ))}
      </div>
      {mode !== 'none' && (
        <input
          type="text"
          value={addresses}
          onChange={(e) => onAddressesChange(e.target.value)}
          placeholder="0xabc..., 0xdef... (comma-separated)"
          className="w-full rounded-md border border-border/60 bg-transparent px-2.5 py-1.5 font-mono text-[11px] text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/30 focus:outline-none"
        />
      )}
    </div>
  )
}

/** Single boolean toggle chip. */
const ToggleChip: FC<{
  label: string
  active: boolean
  onToggle: () => void
  icon?: React.ReactNode
}> = ({ label, active, onToggle, icon }) => (
  <button
    type="button"
    onClick={onToggle}
    className={[
      'inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors',
      active
        ? 'border-foreground/20 bg-foreground/10 text-foreground'
        : 'border-border/60 bg-transparent text-muted-foreground/60 hover:border-border hover:text-muted-foreground',
    ].join(' ')}
  >
    {icon}
    {label}
  </button>
)
