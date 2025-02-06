import { useAsyncCallback } from 'react-async-hook'
import { sendPreparedTransactions } from '../prepareTransactions'
import { toAsyncStatus } from './toAsyncStatus'

export function useSendTransactions() {
  const asyncCallback = useAsyncCallback(sendPreparedTransactions)

  return {
    status: toAsyncStatus(asyncCallback.status),
    error: asyncCallback.error,
    data: asyncCallback.result,
    sendTransactions: asyncCallback.execute,
    reset: asyncCallback.reset,
  }
}
