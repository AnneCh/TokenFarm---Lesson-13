import React from 'react'
import {DAppProvider, ChainId} from '@usedapp/core'
import {Header} from "./Components/Header"
import {Container} from "@material-ui/core"
import {Main} from "./Components/Main"

function App() {
  return (
    <DAppProvider config={{
      supportedChains: [ChainId.Kovan],
      notifications: {
        expirationPeriod: 1000,
        checkInterval: 1000
      }
    }}>
      <Header />
      <Container maxWidth="md">
        <div>Hello World of Crypto!</div>
        <Main />
      </Container>
    </DAppProvider>
  );
}

export default App;