import {useEthers, ConfigProvider} from "@usedapp/core"

export const Header = () => {
    const {account, activateBrowserWallet, deactivate} = useEthers()
// those constants are from usedapp and its function useEthers() that allows us to provide 
// connection to a wallet for example
// now we need to figure out if the user is already connected
    const isConnected = account !== undefined
    return(
// if isConnected is true, let's show a Disconnect button
// is isConnected is not true, show a Connect button
        <div>
            {isConnected ? (
                <button color="primary" onClick={deactivate}>
                    Disconnect
                </button>
            ) : (
                <button color="primary"
                    onClick={() => activateBrowserWallet()}>
                        Connect
                </button>
            )
        }
        </div>

    )
}
