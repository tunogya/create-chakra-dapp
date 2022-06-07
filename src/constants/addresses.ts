import { constructSameAddressMap } from '../utils/constructSameAddressMap'
import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const UNI_ADDRESS: AddressMap = constructSameAddressMap('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984')

export const NEST_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0x04abeda201850ac0124161f037efd70c74ddc74c',
  [SupportedChainId.RINKEBY]: '0x8d6b97c482ecc00d83979dac4a703dbff04fd84f',
}