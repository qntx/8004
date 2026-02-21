import { useCallback, useEffect, useRef, type FC } from 'react'
import {
  XIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
  ZapIcon,
  ClockIcon,
  GlobeIcon,
  CopyIcon,
  CheckIcon,
  LinkIcon,
} from 'lucide-react'
import type { SearchResultItem } from '@/lib/types'
import { ScoreBadge } from '@/components/ScoreBadge'
import { ChainBadge } from '@/components/ChainBadge'
import { ServiceTag } from '@/components/ServiceTag'
import { useState } from 'react'

/** Extract initials from an agent name for the avatar placeholder. */
function initials(name: string): string {
  return name
    .split(/[\s-]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

/** Format a Unix epoch timestamp into a human-readable date string. */
function formatTimestamp(epoch: number): string {
  if (!epoch) return 'N/A'
  return new Date(epoch * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** Inline copy-to-clipboard button. */
const CopyButton: FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [text])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded p-0.5 text-muted-foreground/40 transition-colors hover:text-foreground"
      aria-label="Copy to clipboard"
    >
      {copied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
    </button>
  )
}

/** Labelled metadata row with optional copy support. */
const MetaRow: FC<{
  label: string
  value: string
  mono?: boolean
  copy?: boolean
  href?: string
}> = ({ label, value, mono, copy, href }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
      {label}
    </span>
    <div className="flex items-center gap-1.5">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            'inline-flex items-center gap-1 truncate text-xs transition-colors hover:text-foreground',
            mono ? 'font-mono text-muted-foreground/80' : 'text-muted-foreground',
          ].join(' ')}
        >
          <LinkIcon className="size-3 shrink-0" />
          <span className="truncate">{value}</span>
        </a>
      ) : (
        <span
          className={[
            'truncate text-xs',
            mono ? 'font-mono text-muted-foreground/80' : 'text-foreground/90',
          ].join(' ')}
        >
          {value}
        </span>
      )}
      {copy && <CopyButton text={value} />}
    </div>
  </div>
)

interface AgentDetailModalProps {
  item: SearchResultItem | null
  onClose: () => void
}

/** Full-screen modal showing complete agent information. */
export const AgentDetailModal: FC<AgentDetailModalProps> = ({ item, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Open/close the native dialog in sync with the `item` prop
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (item && !dialog.open) {
      dialog.showModal()
    } else if (!item && dialog.open) {
      dialog.close()
    }
  }, [item])

  // Close on Escape (native dialog handles this, but we sync state)
  const handleCancel = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault()
      onClose()
    },
    [onClose],
  )

  // Close on backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) onClose()
    },
    [onClose],
  )

  if (!item) return null
  const meta = item.metadata
  const services = meta?.services ?? []
  const registrations = meta?.registrations ?? []
  const trustModels = meta?.supportedTrust ?? []

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="m-auto max-h-[85dvh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border/60 bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm open:animate-[modal-in_200ms_ease-out]"
    >
      <div className="flex max-h-[85dvh] flex-col overflow-y-auto">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="sticky top-0 z-10 flex items-start gap-4 border-b border-border/40 bg-background/95 p-5 backdrop-blur-sm">
          {/* Avatar */}
          {meta?.image ? (
            <img
              src={meta.image}
              alt={item.name}
              className="size-14 shrink-0 rounded-xl border border-border/40 object-cover"
            />
          ) : (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-muted text-base font-medium text-muted-foreground">
              {initials(item.name)}
            </div>
          )}

          {/* Title block */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-display text-lg font-medium text-foreground">
                {item.name}
              </h2>
              {meta?.active && (
                <span className="size-2 shrink-0 rounded-full bg-green-500" title="Active" />
              )}
              {meta?.active === false && (
                <span
                  className="size-2 shrink-0 rounded-full bg-muted-foreground/30"
                  title="Inactive"
                />
              )}
            </div>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground/60">{item.agentId}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <ChainBadge chainId={item.chainId} />
              <ScoreBadge score={item.score} />
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* ── Body ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 p-5">
          {/* Description */}
          <div>
            <h3 className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
              Description
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {item.description || 'No description available.'}
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-2">
            {meta?.x402Support && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                <ZapIcon className="size-3" />
                x402 Payment Support
              </span>
            )}
            {trustModels.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
              >
                <ShieldCheckIcon className="size-3" />
                {t}
              </span>
            ))}
          </div>

          {/* Metadata grid */}
          {meta && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MetaRow
                label="Agent URI"
                value={meta.agentURI}
                mono
                copy
                href={meta.agentURI.startsWith('http') ? meta.agentURI : undefined}
              />
              {meta.endpoint && (
                <MetaRow
                  label="Primary Endpoint"
                  value={meta.endpoint}
                  mono
                  copy
                  href={meta.endpoint}
                />
              )}
              <MetaRow label="Created" value={formatTimestamp(meta.createdAt)} />
              <MetaRow
                label="Last Updated"
                value={
                  meta.updatedAt
                    ? new Date(meta.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'
                }
              />
              <MetaRow
                label="Reputation Score"
                value={
                  meta.reputationScore > 0 ? `${(meta.reputationScore * 100).toFixed(0)}%` : 'N/A'
                }
              />
            </div>
          )}

          {/* Services */}
          {services.length > 0 && (
            <div>
              <h3 className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
                Services ({services.length})
              </h3>
              <div className="flex flex-col gap-2">
                {services.map((svc) => (
                  <div
                    key={svc.name}
                    className="flex items-start gap-3 rounded-lg border border-border/40 bg-muted/30 p-3"
                  >
                    <ServiceTag name={svc.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={svc.endpoint}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 truncate font-mono text-xs text-muted-foreground/80 transition-colors hover:text-foreground"
                        >
                          <GlobeIcon className="size-3 shrink-0" />
                          <span className="truncate">{svc.endpoint}</span>
                          <ExternalLinkIcon className="size-3 shrink-0 opacity-50" />
                        </a>
                      </div>
                      {svc.version && (
                        <span className="mt-0.5 text-[10px] text-muted-foreground/50">
                          v{svc.version}
                        </span>
                      )}
                      {svc.skills && svc.skills.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {svc.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Registrations */}
          {registrations.length > 0 && (
            <div>
              <h3 className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
                Registrations ({registrations.length})
              </h3>
              <div className="flex flex-col gap-2">
                {registrations.map((reg, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/30 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs text-muted-foreground/80">
                        {reg.agentRegistry}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground/50">
                        Token ID: {reg.agentId}
                      </p>
                    </div>
                    <CopyButton text={reg.agentRegistry} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Match reasons */}
          {item.matchReasons.length > 0 && (
            <div>
              <h3 className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
                Match Reasons
              </h3>
              <ul className="flex flex-col gap-1">
                {item.matchReasons.map((reason, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ClockIcon className="size-3 shrink-0 text-muted-foreground/40" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </dialog>
  )
}
