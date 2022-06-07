import { Trans } from "@lingui/macro"
import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "web3-react-core"
import { isMobile } from "react-device-detect"
import { SUPPORTED_WALLETS } from "../../constants/wallet"
import { injected } from "../../connectors"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { AbstractConnector } from "@web3-react/abstract-connector"
import { useEffect, useState } from "react"
import MetamaskIcon from "../../assets/images/metamask.png"
import styled from "styled-components"
import PendingView from "./PeddingView"
import usePrevious from "../../hooks/usePrevious"
import AccountDetails from "../AccountDetails"
import { Activity } from "react-feather"
import { shortenAddress } from "../../utils"
import Identicon from "../Identicon";

const IconWrapper = styled.div<{ size?: number | null }>`
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: ${({ size }) => (size ? size + "px" : "24px")};
    width: ${({ size }) => (size ? size + "px" : "24px")};
  }
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

const WALLET_VIEWS = {
  OPTIONS: "options",
  OPTIONS_SECONDARY: "options_secondary",
  ACCOUNT: "account",
  PENDING: "pending",
}

export const WalletModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { active, account, connector, activate, error } = useWeb3React()
  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
  const [pendingError, setPendingError] = useState<boolean>()
  const previousAccount = usePrevious(account)

  useEffect(() => {
    if (account && !previousAccount && isOpen) {
      onClose()
    }
  }, [account, previousAccount, isOpen, onClose])

  // always reset to account view
  useEffect(() => {
    if (isOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [isOpen])

  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)
  useEffect(() => {
    if (isOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, error, connector, isOpen, activePrevious, connectorPrevious])

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    let name = ""
    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })

    setPendingWallet(connector) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
      connector.walletConnectProvider = undefined
    }

    connector &&
      activate(connector, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector)
        } else {
          setPendingError(true)
        }
      })
  }

  const getWeb3Status = () => {
    if (account) {
      return (
        <Button onClick={onOpen} leftIcon={<Identicon/>}>
          <Text>{shortenAddress(account)}</Text>
        </Button>
      )
    }

    if (error) {
      return (
        <>
          <NetworkIcon />
          <Text>{error instanceof UnsupportedChainIdError ? <Trans>Wrong Network</Trans> : <Trans>Error</Trans>}</Text>
        </>
      )
    }

    return (
      <Button onClick={onOpen}>
        <Trans>Connect Wallet</Trans>
      </Button>
    )
  }

  const getOptions = () => {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask

    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key]
      // check for mobile options
      if (isMobile) {
        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Button
              id={`connect-${key}`}
              key={key}
              isFullWidth={true}
              size={"lg"}
              onClick={() => {
                option.connector !== connector && !option.href && tryActivation(option.connector)
              }}
            >
              <Stack direction={"row"} w={"100%"} alignItems={"center"}>
                <Text>{option.name}</Text>
                <Spacer />
                <IconWrapper>
                  <img src={option.iconURL} alt={"Icon"} />
                </IconWrapper>
              </Stack>
            </Button>
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === "MetaMask") {
            return (
              <Button id={`connect-${key}`} key={key} isFullWidth={true} size={"lg"}>
                <Link href={"https://metamask.io/"} isExternal w={"100%"}>
                  <Stack direction={"row"} w={"100%"} alignItems={"center"}>
                    <Text>
                      <Trans>Install Metamask</Trans>
                    </Text>
                    <Spacer />
                    <IconWrapper>
                      <img src={MetamaskIcon} alt={"Icon"} />
                    </IconWrapper>
                  </Stack>
                </Link>
              </Button>
            )
          } else {
            return null //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === "MetaMask" && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === "Injected" && isMetamask) {
          return null
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Button
            isFullWidth={true}
            size={"lg"}
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector)
            }}
            key={key}
          >
            <Stack direction={"row"} w={"100%"} alignItems={"center"}>
              <Text color={option.connector === connector ? option.color : "black"}>{option.name}</Text>
              <Spacer />
              <IconWrapper>
                <img src={option.iconURL} alt={"Icon"} />
              </IconWrapper>
            </Stack>
          </Button>
        )
      )
    })
  }

  const getModalContent = () => {
    if (error) {
      return (
        <>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Trans>Error</Trans>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>{error}</ModalBody>
          </ModalContent>
        </>
      )
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Trans>Account</Trans>
            </ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              <AccountDetails openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)} />
            </ModalBody>
          </ModalContent>
        </>
      )
    }

    return (
      <>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Trans>Connect wallet</Trans>
          </ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            {walletView === WALLET_VIEWS.PENDING ? (
              <PendingView
                connector={pendingWallet}
                error={pendingError}
                setPendingError={setPendingError}
                tryActivation={tryActivation}
              />
            ) : (
              <Stack pb={4}>{getOptions()}</Stack>
            )}
          </ModalBody>
        </ModalContent>
      </>
    )
  }

  return (
    <>
      {getWeb3Status()}
      <Modal isOpen={isOpen} onClose={onClose}>
        {getModalContent()}
      </Modal>
    </>
  )
}

export default WalletModal
