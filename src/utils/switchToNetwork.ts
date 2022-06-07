import {BigNumber} from '@ethersproject/bignumber'
import {hexStripZeros} from '@ethersproject/bytes'
import {ExternalProvider} from '@ethersproject/providers'
import {CHAIN_INFO, SupportedChainId} from "../constants/chains";
import {INFURA_NETWORK_URLS} from "../constants/infura";

interface SwitchNetworkArguments {
  provider: ExternalProvider
  chainId: SupportedChainId
}

// provider.request returns Promise<any>, but wallet_switchEthereumChain must return null or throw
// see https://github.com/rekmarks/EIPs/blob/3326-create/EIPS/eip-3326.md for more info on wallet_switchEthereumChain
export async function switchToNetwork({ provider, chainId }: SwitchNetworkArguments): Promise<null | void> {
  if (!provider.request) {
    return
  }
  const formattedChainId = hexStripZeros(BigNumber.from(chainId).toHexString())
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: formattedChainId }],
    })
  } catch (error: any) {
    // 4902 is the error code for attempting to switch to an unrecognized chainId
    if (error.code === 4902) {
      const info = CHAIN_INFO[chainId]

      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: formattedChainId,
              chainName: info?.label,
              nativeCurrency: {
                name: info?.nativeSymbol,
                symbol: info?.nativeSymbol,
                decimals: 18,
              },
              rpcUrls: [INFURA_NETWORK_URLS[chainId]],
              blockExplorerUrls: [info?.explorer],
            },
          ],
        })
      } catch (addError) {
        console.log(addError)
      }
    } else {
      throw error
    }
  }
}
