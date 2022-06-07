import {isAddress} from "../utils"
import {BigNumber, ethers} from 'ethers'
import {useEffect, useState} from "react";
import {IDLE, IDLE_DELAY, PROCESSING} from "../constants/status";
import useInterval from '@use-it/interval'
import useActiveWeb3React from "./useActiveWeb3React";

export const useETHBalance = (uncheckedAddresses: string | null | undefined) => {
  const {library} = useActiveWeb3React()
  const [balance, setBalance] = useState<{
    value: BigNumber
    amount: string
  }>()
  const [status, setStatus] = useState(IDLE)

  async function update() {
    if (!uncheckedAddresses || !isAddress(uncheckedAddresses)) {
      return undefined
    }

    try{
      setStatus(PROCESSING)

      library?.getBalance(uncheckedAddresses).then((balance) => {
          const b = {
            value: balance,
            amount: ethers.utils.formatEther(balance),
          }
          setTimeout(function () {
            setStatus(IDLE)
            setBalance(b)
          }, IDLE_DELAY)
        }
      )
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(()=>{
    if (library){
      update()
    }
  }, [library, uncheckedAddresses])
  useInterval(update, 5000)

  return {
    balance,
    status,
  }
}