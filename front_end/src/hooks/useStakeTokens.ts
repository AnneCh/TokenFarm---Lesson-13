import { useEthers, useContractFunction } from "@usedapp/core"
import { constants, utils } from "ethers"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"

export const useStakeTokens = (tokenAddress : string) => {
    // what we need to approve the staking :
    // abi
    // address
    // chainId
    const{chainId} = useEthers() 
    const {abi} = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0]: constants.AddressZero
    const tokenFarmInterface =new utils.Interface(abi)
    const tokenFarmcontract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)
    // approve
    const {send: approveErc20Send, state: approveErc20State} = useContractFunction(erc20Contract, "approve", {transactionName: "Approve ERC20 Transfer"})
    // now we can stake tokens
}