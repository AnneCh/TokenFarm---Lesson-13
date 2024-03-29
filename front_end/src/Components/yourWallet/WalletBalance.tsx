import {Token} from "../Main"
import {useEthers, useTokenBalance} from "@usedapp/core"
import {formatUnits} from "@ethersproject/units"
import {BalanceMsg} from "../../Components/BalanceMsg"

export interface WalletBalanceProps {
    token: Token
}

export const WalletBalance = ({token}: WalletBalanceProps) => {
    const {image, address, name} = token
    const {account} = useEthers()
    const tokenBalance = useTokenBalance(address, account)
    // we need to format the balance
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    return (<BalanceMsg
        label={`Your un-staked ${name} balance`}
        amount={formattedTokenBalance}
        tokenImgSrc={image} /> )
} 