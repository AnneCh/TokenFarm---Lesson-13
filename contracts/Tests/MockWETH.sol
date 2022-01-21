// this is a fake contract for the weth token

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockWeth is ERC20 {
    constructor() public ERC20("Mock WETH", "WETH") {}
}