import { injected, walletconnect } from "../../connectors"
import { Trans } from "@lingui/macro"
import { SUPPORTED_WALLETS } from "../../constants/wallet"
import { Button, IconButton, Link, Stack, Text, useClipboard } from "@chakra-ui/react"
import styled from "styled-components"
import WalletConnectIcon from "../../assets/images/walletConnectIcon.svg"
import Identicon from "../Identicon"
import { ExplorerDataType, getExplorerLink } from "../../utils/getExplorerLink"
import { shortenAddress } from "../../utils"
import { CopyIcon } from "@chakra-ui/icons"
import useActiveWeb3React from "../../hooks/useActiveWeb3React";

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + "px" : "32px")};
    width: ${({ size }) => (size ? size + "px" : "32px")};
  }
`

interface AccountDetailsProps {
  openOptions: () => void
}

const AccountDetails = ({ openOptions }: AccountDetailsProps) => {
  const { chainId, account, connector } = useActiveWeb3React()
  const { onCopy } = useClipboard(account ?? "")

  function formatConnectorName() {
    const { ethereum } = window
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        k =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === "METAMASK"))
      )
      .map(k => SUPPORTED_WALLETS[k].name)[0]
    return (
      <Stack>
        <Trans>Connected with {name}</Trans>
      </Stack>
    )
  }

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <IconWrapper size={16}>
          <Identicon />
        </IconWrapper>
      )
    } else if (connector === walletconnect) {
      return (
        <IconWrapper size={16}>
          <img src={WalletConnectIcon} alt={"WalletConnect logo"} />
        </IconWrapper>
      )
    }
    return null
  }

  return (
    <Stack>
      {formatConnectorName()}
      {connector !== injected  && (
        <Button
          onClick={() => {
            ;(connector as any).close()
          }}
        >
          <Trans>Disconnect</Trans>
        </Button>
      )}
      <Button onClick={openOptions}>
        <Trans>Change</Trans>
      </Button>
      {getStatusIcon()}
      <Stack direction={"row"} alignItems={"center"}>
        <Text>{account && shortenAddress(account)}</Text>
        <IconButton aria-label={"copy"} icon={<CopyIcon />} onClick={onCopy} variant={"ghost"} />
        {chainId && account && (
          <Link href={getExplorerLink(chainId, account, ExplorerDataType.ADDRESS)}>View on Explorer</Link>
        )}
      </Stack>
    </Stack>
  )
}

export default AccountDetails
