import { Token} from "../Main"
import React, {useState, useEffect} from "react"
import {useEthers, useTokenBalance, useNotifications} from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
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

    const {approveAndStake, state: approveAndStakeErc20State} = useStakeTokens(tokenAddress)
    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }
    const isMining = approveAndStakeErc20State.status === "Mining"
    const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = useState(false)
    const [showStaketokenSuccess, setShowStakeTokenSuccess] = useState(false)
    const handleCloseSnack = () => {
        setShowErc20ApprovalSuccess(false)
        setShowStakeTokenSuccess(false)
    }

    // lets watch the notifications
    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Approve ERC20 transfer").length > 0) {
                    setShowErc20ApprovalSuccess(true)
                    setShowStakeTokenSuccess(false)
                }     
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Stake Tokens").length > 0) {
                    setShowErc20ApprovalSuccess(false)
                    setShowStakeTokenSuccess(true)
                }
    }, [notifications, showErc20ApprovalSuccess, showStaketokenSuccess])



    // we want to return a button that will allow the user to select the number of tokens
    // they want to stake, need a form for that. input from materialui
    // created a handInputChange to track the number entered 
    // nned to create a input hook to send the amount as part of the stake
    // need to call an approve method, and then the Stake method from our TokenFarm.sol
    return(
        <>
            <div>
                <Input
                    onChange={handleInputChange}/>
            <Button
                    onClick={handleStakeSubmit}
                    color="primary"
                    size="large"
                    disabled={isMining}>
                    {isMining ? <CircularProgress size={26} /> : "Stake your TKs!"}
                </Button>
            </div>
            <Snackbar
                open={ showErc20ApprovalSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}
                >
                    <Alert onClose={handleCloseSnack} severity="success">
                        ERC-20 token transfer approved! Yey! Now, 
                        you go ahead and press those buttons to approve the 2nd transaction... Will you?
                    </Alert>
            </Snackbar>
            <Snackbar
                open={showStaketokenSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}
                >
                    <Alert onClose={handleCloseSnack} severity="success">
                        Tokens Staked! Isn't it exciting, to give your tokens away?
                    </Alert>
            </Snackbar>
        </>
    )
}
