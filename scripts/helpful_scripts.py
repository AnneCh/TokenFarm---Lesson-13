from brownie import (
    accounts,
    network,
    config,
    LinkToken,
    Contract,
    MockV3Aggregator,
    MockDAIFAU,
    MockWETH,
)
from web3 import Web3

FORKED_LOCAL_ENVIRONMENTS = ["mainnet-fork", "mainnet-fork-dev"]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local"]


def get_account(index=None, id=None):
    # accounts[0]
    # accounts.add("env")
    # accounts.load("id")
    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if (
        network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS
        or network.show_active() in FORKED_LOCAL_ENVIRONMENTS
    ):
        return accounts[0]
    return accounts.add(config["wallets"]["from_key"])


contract_to_mock = {
    "eth_usd_price_feed": MockV3Aggregator,
    "dai_usd_price_feed": MockV3Aggregator,
    "fau_token": MockDAIFAU,
    "weth_token": MockWETH,
}
# we also need to make sure we have the usd_price_feed in our mock contracts


def get_contract(contract_name):
    """
    This function will either:
        - Get an address from the config
        - Or deploy a Mock to use for a network that doesn't have the contract

    Args:
        contract_name (string): This is the name of the contract that we will get
        from the config or deploy

    Returns:
        brownie.network.contract.ProjectContract: This is the most recently deployed
        Contract of the type specified by a dictionary. This could either be a mock
        or a 'real' contract on a live network.
    """
    # link_token
    # LinkToken
    contract_type = contract_to_mock[contract_name]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        if len(contract_type) <= 0:
            deploy_mocks()
        contract = contract_type[-1]
    else:
        contract_address = config["networks"][network.show_active()][contract_name]
        contract = Contract.from_abi(
            contract_type._name, contract_address, contract_type.abi
        )
    return contract


def deploy_mocks():
    """
    Use this script if you want to deploy mocks to a testnet
    """
    print(f"The active network is {network.show_active()}")
    print("Deploying mocks...")
    account = get_account()
    print("Deploying Mock LinkToken...")
    link_token = LinkToken.deploy({"from": account})
    print("Deploying Mock Price Feed...")
    mock_price_feed = MockV3Aggregator.deploy(
        decimals, initial_value, {"from": account}
    )
    print(f"Deployed to {mock_price_feed.address}")
    print("Deploying Mock DAI...")
    dai_token = MockDAIFAU.deploy({"from": account})
    print(f"Deployed to {dai_token.address}")
    print("Deploying Mock WETH...")
    weth_token = MockWETH.deploy({"from": account})
    print(f"Deployed to {weth_token.address}")


# def fund_with_link(
#    contract_address, account=None, link_token=None, amount=Web3.toWei(0.3, "ether")
# ):
#   account = account if account else get_account()
#   link_token = link_token if link_token else get_contract("link_token")
#   funding_tx = link_token.transfer(contract_address, amount, {"from": account})
#   funding_tx.wait(1)
#   print(f"Funded {contract_address}")
#   return funding_tx
