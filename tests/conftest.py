# this script wil create a fixed variable (=amount staked) for us to use in tests
import pytest
from web3 import Web3


@pytest.fixture
def amount_staked():
    return Web3.toWei(1, "ether")
