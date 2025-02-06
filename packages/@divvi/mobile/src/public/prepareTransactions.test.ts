import { getSerializablePreparedTransactions } from 'src/viem/preparedTransactionSerialization'
import { mockAccount, mockCeloTokenBalance } from 'test/values'
import { feeCurrenciesSelector } from '../tokens/selectors'
import {
  getFeeCurrencyAndAmounts,
  prepareTransactions as internalPrepareTransactions,
  PreparedTransactionsPossible,
} from '../viem/prepareTransactions'
import { sendPreparedTransactions as sendPreparedTransactionsSaga } from '../viem/saga'
import {
  getFees,
  prepareTransactions,
  sendPreparedTransactions,
  type TransactionRequest,
} from './prepareTransactions'

jest.mock('../tokens/selectors')
jest.mock('../viem/prepareTransactions')
jest.mock('../viem/saga')

beforeEach(() => {
  jest.clearAllMocks()

  // Reset all mock implementations and return values
  jest.mocked(feeCurrenciesSelector).mockReset()
  jest.mocked(internalPrepareTransactions).mockReset()
  jest.mocked(getFeeCurrencyAndAmounts).mockReset()
  jest.mocked(sendPreparedTransactionsSaga).mockReset()
})

describe('prepareTransactions', () => {
  it('should correctly prepare transactions', async () => {
    const mockFeeCurrencies = [mockCeloTokenBalance]
    const mockPrepareResult = { type: 'possible' } as PreparedTransactionsPossible

    jest.mocked(feeCurrenciesSelector).mockReturnValue(mockFeeCurrencies)
    jest.mocked(internalPrepareTransactions).mockResolvedValue(mockPrepareResult)

    const txRequests: TransactionRequest[] = [
      {
        to: '0x1234567890123456789012345678901234567890',
        data: '0x',
        value: BigInt(1000),
        estimatedGasUse: BigInt(21000),
      },
    ]

    const result = await prepareTransactions({
      networkId: 'celo-alfajores',
      transactionRequests: txRequests,
    })

    expect(result).toEqual(mockPrepareResult)
    expect(internalPrepareTransactions).toHaveBeenCalledWith({
      feeCurrencies: mockFeeCurrencies,
      decreasedAmountGasFeeMultiplier: 1,
      baseTransactions: [
        {
          to: txRequests[0].to,
          data: txRequests[0].data,
          value: txRequests[0].value,
          _estimatedGasUse: txRequests[0].estimatedGasUse,
        },
      ],
      origin: 'framework',
    })
  })
})

describe('getFees', () => {
  it('should delegate to getFeeCurrencyAndAmounts', () => {
    const mockPreparedResult = { type: 'possible' } as PreparedTransactionsPossible
    const mockFees = {} as any

    jest.mocked(getFeeCurrencyAndAmounts).mockReturnValue(mockFees)

    const result = getFees(mockPreparedResult as any)

    expect(result).toEqual(mockFees)
    expect(getFeeCurrencyAndAmounts).toHaveBeenCalledWith(mockPreparedResult)
  })
})

describe('sendPreparedTransactions', () => {
  it('should correctly send prepared transactions', async () => {
    const mockTxHashes = ['0x123', '0x456']
    const mockPrepared = {
      type: 'possible',
      transactions: [
        { to: mockAccount, value: BigInt(1000) },
        { to: mockAccount, value: BigInt(1000) },
      ],
      feeCurrency: mockCeloTokenBalance,
    } as PreparedTransactionsPossible

    jest.mocked(sendPreparedTransactionsSaga).mockReturnValue(mockTxHashes as any)

    const result = await sendPreparedTransactions(mockPrepared as any)

    expect(result).toEqual(mockTxHashes)
    expect(sendPreparedTransactionsSaga).toHaveBeenCalledWith(
      getSerializablePreparedTransactions(mockPrepared.transactions),
      'celo-alfajores',
      expect.any(Array)
    )
  })
})
