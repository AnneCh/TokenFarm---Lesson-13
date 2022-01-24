from importlib.abc import Loader
from turtle import update
from black import json
from pyparsing import javaStyleComment
from scripts.helpful_scripts import get_account, config, network, get_contract
from brownie import DappToken, TokenFarm
from web3 import Web3
import yaml
import json
import os
import shutil

KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_dapp_token(front_end_update=False):
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
    # we will deploy mock weth and fau contracts to interact with them during testin
    weth_token = get_contract("weth_token")
    fau_token = get_contract("fau_token")
    dict_of_allowed_tokens = {
        dapp_token: get_contract(
            "dai_usd_price_feed"
        ),  # dai price feed for sake of testing
        fau_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed"),
    }
    if front_end_update:
        update_front_end()
    # by default, we do not update the front end, but the if function allows us to do it
    # if we require
    add_allowed_tokens(token_farm, dict_of_allowed_tokens, account)
    return token_farm, dapp_token


# by returning token_farm and dapp_token, that allows us to use this deploy script in our tests


# We want to create a function that allows tokens and map them to their priceFeed Address


def add_allowed_tokens(token_farm, dict_of_allowed_tokens, account):
    # we are gonna loop thru the dictionary and call the add_allowed_tokens function on each
    for token in dict_of_allowed_tokens:
        add_tx = token_farm.addAllowedTokens(token.address, {"from": account})
        add_tx.wait(1)
        set_tx = token_farm.setPriceFeedContract(
            token.address, dict_of_allowed_tokens[token], {"from": account}
        )
        set_tx.wait(1)
    return token_farm


def update_front_end():
    # send the build folder:

    copy_folders_to_front_end("./build", "./front_end/src/chain-info")
    # need to convert from yaml to js, will do by concerting our yaml file into a dictionnary
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./front_end/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)
    print("Front end updated!")


def copy_folders_to_front_end(src, dest):
    # firdt check that destination exists:
    if os.path.exists(dest):
        shutil.rmtree(dest)  # if the build folder already exists, delete it
    shutil.copytree(src, dest)


def main():
    deploy_token_farm_and_dapp_token(front_end_update=True)
