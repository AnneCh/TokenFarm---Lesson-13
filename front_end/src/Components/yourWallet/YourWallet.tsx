//get the token balances of the tokens we have
import {Token} from "../Main"
import React, {useState} from "react"
import {Box, makeStyles} from "@material-ui/core"
import { Tab } from "@material-ui/core"
import {TabContext, TabList, TabPanel} from "@material-ui/lab"
import {WalletBalance} from "./WalletBalance"
import { StakeForm } from "./StakeForm"
import { createAssignment } from "typescript"

interface YourWalletProps{
    supportedTokens: Array<Token>
}

const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(4)
    },
    box: {
        backgroundcolor: "white",
        borderRadius: "25px"
    },
    header: {
        color: "white"
    }
}))

export const YourWallet = ({ supportedTokens}: YourWalletProps) =>{
    // the first tab that we are going to use is going to be the first token we have
    // for that we need to create a state hook
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    // this creates a variable called selectedTokenIndex and set it to whatever token we are on
    // useState is a way to send states between renders of components
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }
    const classes = useStyles()
    // handleChange allows us to select other tokens when selecting other tabs
    return(
        <Box>
            <h1 className={classes.header}>This belongs to you!</h1>
            <Box className={classes.box}>
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
                                <div className={classes.tabContent}>
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