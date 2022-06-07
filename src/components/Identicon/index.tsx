import Jazzicon from "@metamask/jazzicon"
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import {useEffect, useRef} from "react";

export default function Identicon() {
  const ref = useRef<HTMLDivElement>()
  const { account } = useActiveWeb3React()

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = ""
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)))
    }
  }, [account])

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
  return <div ref={ref as any} />
}
