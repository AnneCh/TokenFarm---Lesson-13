from scripts.helpful_scripts import get_account, config, network
from brownie import DappToken, TokenFarm
from web3 import Web3

KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_dapp_token():
    account = get_account()
    dapp_token = DappToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(
        dapp_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    # now we need to send our DAPP tokens to the dapp_token contract
    tx = dapp_token.transfer(
        token_farm.address, dapp_token.totalSupply() - KEPT_BALANCE, {"from": account}
    )
    tx.wait(1)
    # we will for now, allow only 3 Tokens to be staked: dapp_token, weth_token, fau_token/dai
    # add weth_token and fau_token to brownie-config
    
    add_allowed_tokens(token_farm)
    
# We want to create a function that allows tokens and map them to their priceFeed Address

def add_allowed_tokens(token_farm, dict_of_allowed_tokens, account) {
    
}


def main():
    deploy_token_farm_and_dapp_token()
