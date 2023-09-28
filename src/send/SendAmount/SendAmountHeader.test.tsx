import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import * as React from 'react'
import { Provider } from 'react-redux'
import SendAmountHeader from 'src/send/SendAmount/SendAmountHeader'
import { createMockStore } from 'test/utils'
import {
  mockCeloAddress,
  mockCeloTokenId,
  mockCeurAddress,
  mockCeurTokenId,
  mockCusdAddress,
  mockCusdTokenId,
} from 'test/values'
import { NetworkId } from 'src/transactions/types'

jest.mock('src/web3/networkConfig', () => {
  const originalModule = jest.requireActual('src/web3/networkConfig')
  return {
    ...originalModule,
    __esModule: true,
    default: {
      ...originalModule.default,
      defaultNetworkId: 'celo-alfajores',
    },
  }
})
const mockOnChangeToken = jest.fn()

function renderComponent({
  tokenAddress,
  cUsdBalance,
  disallowCurrencyChange = false,
}: {
  tokenAddress: string
  cUsdBalance?: string
  disallowCurrencyChange?: boolean
}) {
  return render(
    <Provider
      store={createMockStore({
        tokens: {
          tokenBalances: {
            [mockCusdTokenId]: {
              address: mockCusdAddress,
              tokenId: mockCusdTokenId,
              networkId: NetworkId['celo-alfajores'],
              symbol: 'cUSD',
              priceUsd: '1',
              balance: cUsdBalance ?? '10',
            },
            [mockCeurTokenId]: {
              address: mockCeurAddress,
              tokenId: mockCeurTokenId,
              networkId: NetworkId['celo-alfajores'],
              symbol: 'cEUR',
              priceUsd: '1.2',
              balance: '20',
            },
            [mockCeloTokenId]: {
              address: mockCeloAddress,
              tokenId: mockCeloTokenId,
              networkId: NetworkId['celo-alfajores'],
              symbol: 'CELO',
              priceUsd: '5',
              balance: '0',
            },
          },
        },
      })}
    >
      <SendAmountHeader
        tokenAddress={tokenAddress}
        isOutgoingPaymentRequest={false}
        onChangeToken={mockOnChangeToken}
        disallowCurrencyChange={disallowCurrencyChange}
      />
    </Provider>
  )
}

describe('SendAmountHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("hides selector and changes title if there's only one token with balance", () => {
    const { queryByTestId, getByText } = renderComponent({
      tokenAddress: mockCeurAddress,
      cUsdBalance: '0',
    })

    expect(queryByTestId('onChangeToken')).toBeNull()
    expect(getByText('sendToken, {"token":"cEUR"}')).toBeDefined()
  })

  it("allows changing the token if there's more than one token with balance", async () => {
    const { getByTestId, getByText } = renderComponent({
      tokenAddress: mockCeurAddress,
    })

    const tokenPicker = getByTestId('onChangeToken')
    expect(tokenPicker).not.toBeNull()
    expect(getByText('send')).toBeDefined()

    await act(() => {
      fireEvent.press(tokenPicker)
    })

    await waitFor(() => expect(getByTestId('BottomSheetContainer')).toBeVisible())

    fireEvent.press(getByTestId('cUSDTouchable'))
    expect(mockOnChangeToken).toHaveBeenLastCalledWith(mockCusdAddress)
  })
})
