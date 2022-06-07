import {
  Stack, Text,
} from "@chakra-ui/react"
import {isAddress, shortenAddress} from "../../utils"
import {useETHBalance} from "../../hooks/useETHBalance"
import useActiveWeb3React from "../../hooks/useActiveWeb3React";

export const Wallet = () => {
  const {account, chainId} = useActiveWeb3React()
  const {balance} = useETHBalance(account)

  return (
    <Stack w={"600px"} h={"600px"} p={6} borderRadius={"xl"} spacing={6}>
      <Text>My Account: {isAddress(account) || NaN}</Text>
      <Text>Short Address: {shortenAddress(account || "NaN", 8)}</Text>
      <Text>Chain Id: {chainId}</Text>
      <Text>My Balance: {balance?.amount || NaN} ether, {balance?.value.toString() || NaN} wei</Text>
    </Stack>
  )
}

export default Wallet
