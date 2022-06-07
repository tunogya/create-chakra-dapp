import { Token } from '@uniswap/sdk-core'
import { NEST_ADDRESS } from './addresses'
import { SupportedChainId } from './chains'

export const AMPL = new Token(
  SupportedChainId.MAINNET,
  '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
  9,
  'AMPL',
  'Ampleforth'
)

export const NEST: { [chainId: number]: Token } = {
  [SupportedChainId.MAINNET]: new Token(SupportedChainId.MAINNET, NEST_ADDRESS[SupportedChainId.MAINNET], 18, 'NEST', 'Nest'),
  [SupportedChainId.RINKEBY]: new Token(SupportedChainId.RINKEBY, NEST_ADDRESS[SupportedChainId.RINKEBY], 18, 'NEST', 'Nest'),
}