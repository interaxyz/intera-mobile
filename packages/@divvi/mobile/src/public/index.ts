/**
 * Public API exports for the mobile library.
 * We use explicit exports instead of 'export *' to:
 * - Maintain a clear and intentional public API surface
 * - Enable better tree-shaking
 * - Prevent accidental exposure of internal implementation details
 */
export { createApp } from './createApp'
export { usePrepareTransactions } from './hooks/usePrepareTransactions'
export { useSendTransactions } from './hooks/useSendTransactions'
export { useWallet } from './hooks/useWallet'
export {
  getFees,
  prepareTransactions,
  sendPreparedTransactions,
  type PreparedTransactionsNeedDecreaseSpendAmountForGas,
  type PreparedTransactionsNotEnoughBalanceForGas,
  type PreparedTransactionsPossible,
  type PreparedTransactionsResult,
} from './prepareTransactions'
export { type NetworkId, type PublicAppConfig } from './types'
