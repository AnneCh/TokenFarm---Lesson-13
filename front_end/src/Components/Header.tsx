import {useEthers} from "@usedapp/core"

export const Header = () => { // this line means Header is a function, and this is what its gonna do
    const {account, activateBrowserWallet, deactivate} = useEthers()
    const isConnected = account !== undefined
    return (
        <div>
            {isConnected ? (
                <button color="primary" onClick={deactivate}>
                    Disconnect
                </button>
                ) : (
                    <button color="primary" onClick={() => activateBrowserWallet()}>
                        Connect
                    </button>
                )
            }
        </div>
    )

}