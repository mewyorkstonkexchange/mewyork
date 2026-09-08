import type { CreateConnectorFn } from 'wagmi'
import type { WalletConfig } from '../config/types'

/**
 * Adapter slot for WalletConnect/Reown. Pending credential: it needs a project id issued
 * to the project account, and the `walletConnect` connector is deliberately not imported
 * until one exists. To wire it up:
 *   1. set VITE_WALLETCONNECT_PROJECT_ID (or wallet.walletConnectProjectId in site.config.ts)
 *   2. import { walletConnect } from 'wagmi/connectors'
 *   3. return walletConnect({ projectId, showQrModal: true }) below
 *   4. append the result to the connectors array in src/wallet/config.ts
 */
export function walletConnectConnector(config: WalletConfig): CreateConnectorFn | null {
  if (!config.walletConnectProjectId) return null
  return null
}

export const WALLETCONNECT_STATUS = 'pending credential'
