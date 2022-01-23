import React from 'react';
import logo from './logo.svg';
import './App.css';
import {DAppProvider, ChainId} from '@usedapp/core'

function App() {
  return (
    <DAppProvider config={{
      supportedChains: [ChainId.Kovan, ChainId.Rinkeby]
    }}>
    <div>Hello World of Crypto!</div>
    </DAppProvider>
  );
}

export default App;
