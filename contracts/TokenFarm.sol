//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// because we are using version 8, we do not have to care for SafeMath

contract TokenFarm {
    // We want this contract to:
    // stakeTokens
    // unStakeTokens
    // issueTokens (reward tokens)
    // addAllowedTokens (allow more tokens to be staked)
    // getEthValue (chainlink to get the current ETH price)
    function stakeTokens(uint256 _amount, address _token) public {
        // what tokens can they stake?
        // how much can they stake? more than 0:
        require(_amount > 0, "Amount must be more than 0");
    }
}
