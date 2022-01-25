// this will show what we have in our account, staked and not

/* eslint-disable spaced-comment */
/// <reference types="react-scripts"/>
import { useEthers} from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import {constants} from "ethers"
import brownieConfig from "../brownie-config.json"
import dapp from "../dapp.png"
import weth from "../weth.png"
import fau from "../fau.png"
import { YourWallet } from "./yourWallet/YourWallet"

export type Token = {
    image: string
    address: string
    name: string
}

export const Main = () => {
    // this needs to :
    // show token values from the wallet
    // Get the address of different tokens
    // get the balance of the users wallet
    // we need the information stored on the brownie-config.yaml file
    // with addresses for tokens and networks
    const { chainId, error } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"
    // now we want to grab the address of the dappToken that we deployed on our kovan network 
    const dappTokenAddress = chainId ? networkMapping[String(chainId)]["DappToken"][0]: constants.AddressZero
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero
    
    // now we need to create something that displays the wallet : YourWallet
    const supportedTokens: Array<Token> = [
        {
            image: dapp,
            address: dappTokenAddress,
            name: "DAPP"
        },
        {
            image: weth,
            address: wethTokenAddress,
            name: "WETH"
        },
        {
            image: fau,
            address: fauTokenAddress,
            name: "FAU"
        },
        
    ]
    // now we can pass the array of tokens to the Wallet
    return (<YourWallet supportedTokens={supportedTokens}/>)
}