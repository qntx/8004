import { useMemo } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { wrapFetchWithPayment, x402Client } from '@x402/fetch'
import { ExactEvmScheme, toClientEvmSigner } from '@x402/evm'
import { createSanitizedFetch } from '@/lib/fetch'

/**
 * Hook that creates an x402-enhanced fetch bound to the connected wallet.
 * Returns `null` when no wallet is available.
 *
 * The returned fetch automatically handles HTTP 402 payment challenges:
 * detect → parse PAYMENT-REQUIRED → sign EIP-3009 → retry with signature.
 */
export function useX402Fetch() {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const fetchWithPayment = useMemo(() => {
    if (!walletClient?.account || !publicClient) return null

    const signer = toClientEvmSigner({
      address: walletClient.account.address,
      readContract: (args) => publicClient.readContract(args),
      signTypedData: (msg) =>
        walletClient.signTypedData({
          account: walletClient.account!,
          domain: msg.domain as Record<string, unknown>,
          types: msg.types as Record<string, readonly { name: string; type: string }[]>,
          primaryType: msg.primaryType,
          message: msg.message,
        }),
    })

    const client = new x402Client()
    // Register only for the active chain — MetaMask rejects signTypedData
    // if the domain chainId doesn't match the wallet's active chain.
    client.register(`eip155:${walletClient.chain.id}`, new ExactEvmScheme(signer))

    const baseFetch = createSanitizedFetch()

    return wrapFetchWithPayment(baseFetch, client)
  }, [walletClient, publicClient])

  return {
    fetchWithPayment,
    walletAddress: walletClient?.account?.address ?? null,
    isReady: !!fetchWithPayment,
  }
}
