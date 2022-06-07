import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
import { InjectedConnector } from 'web3-react-injected-connector'
import { WalletConnectConnector } from 'web3-react-walletconnect-connector'

import { NetworkConnector } from './NetworkConnector'
import {INFURA_NETWORK_URLS} from "../constants/infura";
import {ALL_SUPPORTED_CHAIN_IDS} from "../constants/chains";

export const network = new NetworkConnector({
  urls: INFURA_NETWORK_URLS,
  defaultChainId: 1,
})

export const injected = new InjectedConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
})

export const gnosisSafe = new SafeAppConnector()

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
  rpc: INFURA_NETWORK_URLS,
  qrcode: true,
})
