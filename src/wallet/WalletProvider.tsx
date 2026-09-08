import type { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { walletConfig } from './config'

const queryClient = new QueryClient()

/** Mounts the wallet stack only when the target network metadata is verified. */
export function WalletProvider({ children }: { children: ReactNode }) {
  if (!walletConfig) return <>{children}</>
  return (
    <WagmiProvider config={walletConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
