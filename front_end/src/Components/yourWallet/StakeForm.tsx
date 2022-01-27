import { Token} from "../Main"
import React, {useState, useEffect} from "react"
import {useEthers, useTokenBalance, useNotifications} from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { Button, Input } from "@material-ui/core"
import {useStakeTokens} from "../../hooks"
import {utils} from "ethers"


export interface StakeFormProps {
    token: Token
}

export const StakeForm = ({ token}: StakeFormProps) => {
    const {address: tokenAddress, name} = token
    const {account} = useEthers()
    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) :0
    const {notifications} =useNotifications()

    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }

    const {approveAndStake, approveErc20State} = useStakeTokens(tokenAddress)
    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }
    // lets watch the notifications
    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Approve ERC20 transfer").length > 0) {
                    console.log("Approved!!")
                }     
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Stake Tokens").length > 0) {
                    console.log("Tokens Staked!!")
                }
    }, [notifications])


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
                onClick={handleStakeSubmit}
                color="primary"
                size="large">
                Stake your Tokens!
            </Button>
        </div>
    )
}
