import { useMemo } from 'react'
import type { UseSelector } from '../../redux/hooks'
import type { SortedTokensWithBalanceOrShowZeroBalanceSelector } from '../../tokens/selectors'
import type { GetSupportedNetworkIdsForSend } from '../../tokens/utils'
import type { NetworkId } from '../../transactions/types'
import type { WalletAddressSelector } from '../../web3/selectors'

function useTokens() {
  const useSelector = require('../../redux/hooks').useSelector as UseSelector
  const getSupportedNetworkIdsForSend = require('../../tokens/utils')
    .getSupportedNetworkIdsForSend as GetSupportedNetworkIdsForSend
  const sortedTokensWithBalanceOrShowZeroBalanceSelector = require('../../tokens/selectors')
    .sortedTokensWithBalanceOrShowZeroBalanceSelector as SortedTokensWithBalanceOrShowZeroBalanceSelector

  const supportedNetworkIds = getSupportedNetworkIdsForSend().join(',')
  const memoizedNetworkIds = useMemo(
    () => supportedNetworkIds.split(',') as NetworkId[],
    [supportedNetworkIds]
  )
  // explicitly allow zero state tokens to be shown for exploration purposes for
  // new users with no balance
  const tokens = useSelector((state) =>
    sortedTokensWithBalanceOrShowZeroBalanceSelector(state, memoizedNetworkIds)
  )
  return tokens
}

export function useWallet() {
  const useSelector = require('../../redux/hooks').useSelector as UseSelector
  const walletAddressSelector = require('../../web3/selectors')
    .walletAddressSelector as WalletAddressSelector
  const address = useSelector(walletAddressSelector)
  const tokens = useTokens()

  return {
    address,
    tokens,
  }
}
