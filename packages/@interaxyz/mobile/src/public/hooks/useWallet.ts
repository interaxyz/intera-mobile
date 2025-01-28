import { useMemo } from 'react'
import { useSelector } from 'src/redux/hooks'
import { sortedTokensWithBalanceOrShowZeroBalanceSelector } from 'src/tokens/selectors'
import { getSupportedNetworkIdsForSend } from 'src/tokens/utils'
import { type NetworkId } from 'src/transactions/types'
import { walletAddressSelector } from 'src/web3/selectors'

function useTokens() {
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
  const address = useSelector(walletAddressSelector)
  const tokens = useTokens()

  return {
    address,
    tokens,
  }
}
