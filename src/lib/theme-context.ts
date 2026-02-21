import { createContext } from 'react'

/** Theme preference stored by the user. 'system' follows OS preference. */
export type ThemePreference = 'light' | 'dark' | 'system'

/** Resolved theme that is actually applied (no 'system'). */
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeContextValue {
  preference: ThemePreference
  resolved: ResolvedTheme
  setTheme: (next: ThemePreference) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
