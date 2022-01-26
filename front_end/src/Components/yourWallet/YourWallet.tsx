//get the token balances of the tokens we have
import {Token} from "../Main"
import React, {useState} from "react"
import {Box, Tab} from "@material-ui/core"
import {TabContext, TabList, TabPanel} from "@material-ui/lab"
import {WalletBalance} from "./WalletBalance"
import { StakeForm } from "./StakeForm"

interface YourWalletProps{
    supportedTokens: Array<Token>
}

export const YourWallet = ({ supportedTokens}: YourWalletProps) =>{
    // the first tab that we are going to use is going to be the first token we have
    // for that we need to create a state hook
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    // this creates a variable called selectedTokenIndex and set it to whatever token we are on
    // useState is a way to send states between renders of components
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }
    // handleChange allows us to select other tokens when selecting other tabs
    return(
        <Box>
            <h1>I'm Your Wallet</h1>
            <Box>
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange} aria-label="stake form tabs">
                        {supportedTokens.map((token, index) => {
                            return (
                                <Tab label={token.name}
                                    value={index.toString()}
                                    key={index}/>
                            )
                        })}
                    </TabList>
                    {supportedTokens.map((token, index) => {
                        return (
                            <TabPanel value={index.toString()} key={index}>
                                <div>
                                    <WalletBalance token={supportedTokens[selectedTokenIndex]}/>
                                    <StakeForm token={supportedTokens[selectedTokenIndex]}/>
                                </div>
                            </TabPanel>
                        )
                    })}
                </TabContext>
            </Box>
        </Box>
    )
}