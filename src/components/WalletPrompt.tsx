import { useEffect, useRef, useState, type FC } from 'react'
import { WalletIcon, XIcon } from 'lucide-react'
import { useConnectModal } from '@rainbow-me/rainbowkit'

interface WalletPromptProps {
  /** Controls visibility — prompt auto-dismisses after a timeout. */
  visible: boolean
  onDismiss: () => void
}

/** Duration (ms) before the prompt auto-hides. */
const AUTO_DISMISS_MS = 5_000

/**
 * Elegant inline banner prompting the user to connect their wallet.
 *
 * Slides in below the search bar with a smooth transition and provides
 * a one-click "Connect" action via RainbowKit's connect modal.
 */
export const WalletPrompt: FC<WalletPromptProps> = ({ visible, onDismiss }) => {
  const { openConnectModal } = useConnectModal()
  const [animate, setAnimate] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!visible) return

    // Trigger enter animation on next frame for CSS transition
    const raf = requestAnimationFrame(() => setAnimate(true))

    // Schedule auto-dismiss
    timerRef.current = setTimeout(() => {
      setAnimate(false)
      setTimeout(onDismiss, 300)
    }, AUTO_DISMISS_MS)

    return () => {
      cancelAnimationFrame(raf)
      if (timerRef.current) clearTimeout(timerRef.current)
      setAnimate(false)
    }
  }, [visible, onDismiss])

  /** Manually dismiss the prompt. */
  const handleDismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setAnimate(false)
    setTimeout(onDismiss, 300)
  }

  /** Open wallet connect modal and dismiss. */
  const handleConnect = () => {
    openConnectModal?.()
    handleDismiss()
  }

  if (!visible) return null

  return (
    <div
      role="alert"
      className={[
        'flex w-full max-w-2xl items-center gap-3 rounded-xl border border-border/60',
        'bg-accent/50 px-4 py-2.5 backdrop-blur-sm',
        'transition-all duration-300 ease-out',
        animate ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
      ].join(' ')}
    >
      <WalletIcon className="size-4 shrink-0 text-muted-foreground/70" />
      <p className="flex-1 text-xs text-muted-foreground">
        Connect your wallet to enable x402 payment-gated searches
      </p>
      <button
        type="button"
        onClick={handleConnect}
        className="shrink-0 rounded-lg bg-foreground px-3 py-1 text-xs font-medium text-background transition-opacity hover:opacity-80"
      >
        Connect
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded p-0.5 text-muted-foreground/50 transition-colors hover:text-foreground"
        aria-label="Dismiss"
      >
        <XIcon className="size-3" />
      </button>
    </div>
  )
}
