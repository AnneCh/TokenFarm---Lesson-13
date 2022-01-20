//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
// because we are using version 8, we do not have to care for SafeMath

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // only using the interface as we don't need the whole contract

contract TokenFarm is Ownable {
    // We want this contract to:
    // stakeTokens
    // unStakeTokens
    // issueTokens (reward tokens)
    // addAllowedTokens (allow more tokens to be staked)
    // getEthValue (chainlink to get the current ETH price)
    address[] public allowedTokens;

    function stakeTokens(uint256 _amount, address _token) public {
        // what tokens can they stake?
        // how much can they stake? more than 0:
        require(_amount > 0, "Amount must be more than 0");
        // require(_token is allowed??) => need to create a specific function to determine which tokens are allowed
        require(
            tokenIsAllowed(_token),
            "Token is currently not allowed, sorry!"
        );
        // we will call the transferFrom() because we are not the owner of the token
        // if we had been the owner of the token to stake, then we would have called transfer()
    }

    // We also want a function to add tokens to the list of allowedTokens, but only the admin should be able to do so!!!
    function addAllowedTokens(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    function tokenIsAllowed(address _token) public returns (bool) {
        // we want some kind of list or mappings => list of addresses allowedTokens
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            if (allowedTokens[allowedTokensIndex] == _token) {
                return true;
            }
        }
        return false;
        // We created a variable allowedTokensIndex that allows us to loop through the list of token
        // addresses, to figure out if the staker's token's address is in the list of allowedTokens
    }
}
