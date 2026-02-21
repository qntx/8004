import { useContext } from 'react'
import { ThemeContext, type ThemeContextValue } from '@/lib/theme-context'

/** Hook to consume the shared theme context. Must be used within ThemeProvider. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
