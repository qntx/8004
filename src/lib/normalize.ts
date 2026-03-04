/**
 * Defensive normalizers for API response data that may arrive in
 * inconsistent formats depending on backend version.
 */

/**
 * Normalize `supportedTrust` into a clean `string[]` regardless of the
 * wire format returned by the API.
 *
 * Handles:
 * - `string[]`  — proper array (pass-through)
 * - `string`    — JSON-encoded array like `'["reputation","crypto-economic"]'`
 * - `string`    — CSV like `"reputation,crypto-economic"`
 * - `null`/`undefined` — returns `[]`
 */
export function normalizeTrustModels(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string' && v.length > 0)
  }

  if (typeof value !== 'string' || !value.trim()) return []

  // Try JSON parse first (handles `'["a","b"]'`)
  try {
    const parsed: unknown = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.filter((v): v is string => typeof v === 'string' && v.length > 0)
    }
  } catch {
    // Not valid JSON — fall through to CSV split
  }

  // Fallback: CSV split
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
