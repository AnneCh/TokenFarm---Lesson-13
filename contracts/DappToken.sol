// REWARD Token, we will give some Dapp token to whoever stakes their token on our application

//DPX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DappToken is ERC20 {
    constructor() public ERC20("Dapp Token", "DAPP") {
        // we give our DAPP an initial supply of 1 million units
        _mint(msg.sender, 1000000000000000000000000);
    }
}
