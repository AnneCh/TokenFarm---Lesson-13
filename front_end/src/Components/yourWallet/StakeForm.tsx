import { Token} from "../Main"
import React, {useState} from "react"
import {useEthers, useTokenBalance} from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { Button, Input } from "@material-ui/core"


export interface StakeFormProps {
    token: Token
}

export const StakeForm = ({ token}: StakeFormProps) => {
    const {address: tokenAddress, name} = token
    const {account} = useEthers()
    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) :0

    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }
    // we want to return a button that will allow the user to select the number of tokens
    // they want to stake, need a form for that. input from materialui
    // created a handInputChange to track the number entered 
    // nned to create a input hook to send the amount as part of the stake
    // need to call an approve method, and then the Stake method from our TokenFarm.sol
    return(
        <div>
            <Input
                onChange={handleInputChange}/>
            <Button
            color="primary"
            size="large">
                Stake your tokens!
            </Button>
        </div>
    )
}