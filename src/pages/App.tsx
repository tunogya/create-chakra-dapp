import React from "react"
import { Route, Switch } from "react-router-dom"
import { Stack } from "@chakra-ui/react"
import Test from "./Test"
import Web3ReactManager from "../components/Web3ReactManager"

function App() {
  return (
    <Web3ReactManager>
      <Stack spacing={0} minH={"100vh"}>
        <Stack p={"120px 16px 0 16px"} alignItems={"center"}>
          <Switch>
            <Route exact strict path="/" component={Test} />
          </Switch>
        </Stack>
      </Stack>
    </Web3ReactManager>
  )
}

export default App
