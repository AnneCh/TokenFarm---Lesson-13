// this will show what we have in our account, staked and not
import { useEthers} from "@usedapp/core"
import helperConfig from "../helper-config.json"

export const Main = () => {
    // this needs to :
    // show token values from the wallet\
    // Get the address of different tokens
    // get the balance of the users wallet
    // we need the information stored on the brownie-config.yaml file
    // with addresses for tokens and networks
    const { chainId } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"
    console.log(chainId)
    console.log(networkName)
    //const dappTokenAddress =?
    return (<div>Hello!</div>)
}