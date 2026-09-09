import { walletConnect } from 'wagmi/connectors'
import type { CreateConnectorFn } from 'wagmi'
import type { WalletConfig } from '../config/types'

/** Shown in place of the WalletConnect option while no project id is configured. */
export const WALLETCONNECT_UNAVAILABLE_LABEL = 'Mobile wallets: available soon'

/**
 * Returns null when no project id is set, which keeps the WalletConnect provider bundle
 * from loading at all. The connect sheet then renders the option disabled rather than
 * hiding it, so the gap is visible instead of silent.
 */
export function walletConnectConnector(config: WalletConfig): CreateConnectorFn | null {
  const projectId = config.walletConnectProjectId?.trim()
  if (!projectId) return null
  return walletConnect({ projectId, showQrModal: true })
}
