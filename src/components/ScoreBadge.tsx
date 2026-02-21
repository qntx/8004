import type { FC } from 'react'

/** Circular score indicator with color gradient from red (low) to green (high). */
export const ScoreBadge: FC<{ score: number }> = ({ score }) => {
  const pct = Math.round(score * 100)

  // Color interpolation: red -> yellow -> green
  const hue = score * 120 // 0=red, 60=yellow, 120=green

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums"
      style={{
        backgroundColor: `hsla(${hue}, 60%, 50%, 0.12)`,
        color: `hsl(${hue}, 60%, 35%)`,
      }}
      title={`Relevance: ${pct}%`}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: `hsl(${hue}, 60%, 50%)` }}
      />
      {pct}%
    </span>
  )
}
