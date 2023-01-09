import { isBalanceSufficientForSigRetrieval } from '@celo/identity/lib/odis/phone-number-identifier'
import getPhoneHash from '@celo/phone-utils/lib/getPhoneHash'
import { createSelector } from 'reselect'
import { celoTokenBalanceSelector } from 'src/goldToken/selectors'
import { IdentifierToE164NumberType } from 'src/identity/reducer'
import { RootState } from 'src/redux/reducers'
import { cUsdBalanceSelector } from 'src/stableToken/selectors'

export const e164NumberToAddressSelector = (state: RootState) => state.identity.e164NumberToAddress
export const addressToE164NumberSelector = (state: RootState) => state.identity.addressToE164Number
export const walletToAccountAddressSelector = (state: RootState) =>
  state.identity.walletToAccountAddress
export const addressToDataEncryptionKeySelector = (state: RootState) =>
  state.identity.addressToDataEncryptionKey
export const e164NumberToSaltSelector = (state: RootState) => state.identity.e164NumberToSalt
export const secureSendPhoneNumberMappingSelector = (state: RootState) =>
  state.identity.secureSendPhoneNumberMapping
export const importContactsProgressSelector = (state: RootState) =>
  state.identity.importContactsProgress
export const addressToDisplayNameSelector = (state: RootState) =>
  state.identity.addressToDisplayName

export const identifierToE164NumberSelector = createSelector(
  e164NumberToSaltSelector,
  (e164NumberToSalt) => {
    const identifierToE164Numbers: IdentifierToE164NumberType = {}
    for (const e164Number of Object.keys(e164NumberToSalt)) {
      const pepper = e164NumberToSalt[e164Number]
      if (pepper) {
        const phoneHash = getPhoneHash(e164Number, pepper)
        identifierToE164Numbers[phoneHash] = e164Number
      }
    }
    return identifierToE164Numbers
  }
)

export const isBalanceSufficientForSigRetrievalSelector = createSelector(
  [cUsdBalanceSelector, celoTokenBalanceSelector],
  (cUsdBalance, celoTokenBalance) =>
    isBalanceSufficientForSigRetrieval(cUsdBalance || 0, celoTokenBalance || 0)
)
