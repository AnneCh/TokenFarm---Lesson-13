import { useEthers, useContractFunction } from "@usedapp/core"
import { constants, utils } from "ethers"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import {Contract} from '@usedapp/core/node_modules/@ethersproject/contracts'
import networkMapping from "../chain-info/deployments/map.json"
import { useEffect, useState } from "react"

export const useStakeTokens = (tokenAddress : string) => {
    // what we need to approve the staking :
    // abi
    // address
    // chainId
    const{chainId} = useEthers() 
    const {abi} = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0]: constants.AddressZero
    const tokenFarmInterface =new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)
    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)
    // approve
    const { send: approveErc20Send, state: approveAndStakeErc20State } =
        useContractFunction(erc20Contract, "approve", {
            transactionName: "Approve ERC20 transfer",})
    const approveAndStake = (amount: string) => {
        setAmountToStake(amount)
        return approveErc20Send(tokenFarmAddress, amount)
    } // this function is gonna kick off the approve but also change the amount that we are going to stake

    const [amountToStake, setAmountToStake] = useState("0")

    const { send: stakeSend, state: stakeState} = 
        useContractFunction(tokenFarmContract, "stakeTokens", {
            transactionName: "Stake Tokens",})

    //uesEffect allows us top do something is some variable is changed
    useEffect(() => {
        if (approveAndStakeErc20State.status === "Success") {
            // stake function
            stakeSend(amountToStake, tokenAddress)
        }
    }, [approveAndStakeErc20State, amountToStake, tokenAddress])

    const [state, setState] = useState(approveAndStakeErc20State)
    // we need to track both the approving, and the staking states
    useEffect(() => {
            if (approveAndStakeErc20State.status === "Success") {
                setState(stakeState)
            } else {
                setState(approveAndStakeErc20State)
            }
    },[approveAndStakeErc20State, stakeState])

    //we add an array of anything we want to track, if anything in this array changes,
    // we kick of the useEffect and do somrthing
    // we want tot rack this approveErc20State

    return {approveAndStake, state}

}