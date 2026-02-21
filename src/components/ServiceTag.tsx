import type { FC } from 'react'

/** Protocol service tag (MCP, A2A, OASF, ENS, etc.). */
export const ServiceTag: FC<{ name: string }> = ({ name }) => {
  return (
    <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      {name}
    </span>
  )
}
