from brownie import network, exceptions
import pytest
from scripts.helpful_scripts import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    INITIAL_PRICE_FEED_VALUE,
    DECIMALS,
    get_account,
    get_contract,
)
from scripts.deploy import deploy_token_farm_and_dapp_token, KEPT_BALANCE
from conftest import amount_staked


def test_set_price_feed_contract():
    # arrange : first make sure we are on a local network
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!!")
    account = get_account()
    non_owner = get_account(index=1)  # so that we can check the onlyOwner functions
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    # Act
    price_feed_address = get_contract("eth_usd_price_feed")
    token_farm.setPriceFeedContract(
        dapp_token.address, price_feed_address, {"from": account}
    )
    # Assert
    assert token_farm.tokenPriceFeedMapping(dapp_token.address) == price_feed_address
    # test successful
    # now let's make sure nobody can call this function except the owner
    with pytest.raises(exceptions.VirtualMachineError):
        token_farm.setPriceFeedContract(
            dapp_token.address, price_feed_address, {"from": non_owner}
        )
    # test passed


def test_stake_tokens(amount_staked):
    # need to stake a certain amount, see conftest.py
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!!")
    account = get_account()
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    # Act
    dapp_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.stakeTokens(
        amount_staked, dapp_token.address, {"from": account}
    )  # call the stakeTokens() from TokenFarm
    # Assert
    assert (
        token_farm.stakingBalance(dapp_token.address, account.address) == amount_staked
    )
    assert token_farm.uniqueTokensStaked(account.address) == 1
    assert token_farm.stakers(0) == account.address
    return token_farm, dapp_token  # so we can use this test in other tests
    # passed correctly


# we could probably make this whole function into a function in our helpful scripts


def test_issue_tokens(amount_staked):
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    starting_balance = dapp_token.balanceOf(account.address)
    # Act
    token_farm.issueTokens({"from": account})
    # Arrange
    # we are staking 1 dapp_token which is == in price to 1 ETH
    # soo we should get 2000 dapp tokens in reward,
    # since 1ETH = 2000$
    assert (
        dapp_token.balanceOf(account.address)
        == starting_balance + INITIAL_PRICE_FEED_VALUE
    )
    # test passed


# TESTS MADE WITHOUT TUTORIALS - in progress


def test_unstake_tokens():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    # deploy both contracts to unstake the DappToken using the TokenFarm.sol function
    token_farm, dapp_token = test_stake_tokens(
        amount_staked
    )  # had it wrong, had put deploy()
    # need to make sure there are tokens in the user's balance
    # dapp_token.balanceOf(account.address) : unecessary because we jave the test above
    # need to make sure there is a token to unstake :
    # token_farm.uniqueTokensStaked(account.address) > 0 :unecessary because we jave the test above
    # Act
    token_farm.unStakeTokens(dapp_token.address, {"from": account})
    # Assert
    assert token_farm.uniqueTokensStaked(account.address) == 0
    assert dapp_token.balanceOf(account.address) == KEPT_BALANCE
    assert token_farm.stakingBalance(dapp_token.address, account.address) == 0
    # need stakingBalance[_token][msg.sender]
    # uniqueTokenStaked[_token] == 0
