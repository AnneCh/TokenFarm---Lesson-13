//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
// because we are using version 8, we do not have to care for SafeMath

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // only using the interface as we don't need the whole contract
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// We want this contract to:
// stakeTokens
// unStakeTokens
// issueTokens (reward tokens)
// addAllowedTokens (allow more tokens to be staked)
// getEthValue (chainlink to get the current ETH price)

// issueTokens will solve the issue of how much DAPP do we give as a reward:
// is staker stakes 50 ETH and 50 DAI, and we want to give a reward of 1 DAPP/1 DAI
// what if staker stakes 100 ETH
contract TokenFarm is Ownable {
    address[] public allowedTokens;
    // mapping token address => staker address => amount
    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => uint256) public uniqueTokensStaked;
    // we cannot loop thru a mapping, so we need to create a stakers' array to loop thru
    address[] public stakers;
    IERC20 public dappToken;
    mapping(address => address) public tokenPriceFeedMapping;

    // the constructor will get the address of the token to be awarded
    constructor(address _dappTokenAddress) public {
        dappToken = IERC20(_dappTokenAddress);
    }

    function setPriceFeedContract(address _token, address _priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeedMapping[_token] = _priceFeed;
    }

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
        // we need the ABI of the token to call the transferFrom(), so we will wrap it into a IERC20 interface that provides the abi
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        // now we need to keep track of how much each address has sent us => create mapping
        updateUniqueTokensStaked(msg.sender, _token); // keep track of which tokens the staker had staked
        stakingBalance[_token][msg.sender] =
            stakingBalance[_token][msg.sender] +
            _amount;
        if (uniqueTokensStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    function issueTokens() public onlyOwner {
        // Issue tokens for all stakers
        for (
            uint256 stakersIndex = 0;
            stakersIndex < stakers.length;
            stakersIndex++
        ) {
            address recipient = stakers[stakersIndex];
            uint256 userTotalValue = getUserTotalValue(recipient);
            // send them a token reward based
            // on their total value locked
            dappToken.transfer(recipient, userTotalValue);
        }
    }

    // in most concrete cases, we would not have a function looping thru everything and
    // issuing the reward token.
    // instead, the user would claim their reward, it's much more gas efficient

    function getUserTotalValue(address _user) public view returns (uint256) {
        uint256 totalValue = 0;
        require(uniqueTokensStaked[_user] > 0, "No tokens staked!");
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokens++
        ) {
            totalValue =
                totalValue +
                getUserSingleTokenValue(
                    _user,
                    allowedTokens[allowedTokensIndex]
                );
        }
        return totalValue;
    }

    function getUserSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        // get the conversion rate of each token's staked
        if (uniqueTokensStaked[_user] <= 0) {
            return 0;
        }
        // we want to get the price of the token * stakingBalance[_token][user]
        (uint256 price, uint256 decimals) = getTokenValue(_token);
        return ((stakingBalance[_token][_user] * price) / 10**decimals);
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        // chainlink priceFeedAddress => need some mapping that will link each token
        // to their priceFeedAddress
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , , ) = priceFeed.latestRoundData();
        // we need to know the decimals to match everything to use the same units
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(price), decimals);
    }

    function updateUniqueTokensStaked(address _user, address _token) internal {
        if (stakingBalance[_token][_user] <= 0) {
            uniqueTokensStaked[_user] = uniqueTokensStaked[_user] + 1;
        }
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

function unStakeTokens(address _token) public {
    //first fetch this specific staker's token's balance
    uint256 balance = stakingBalance[_token][msg.sender];
    require(balance > 0, "Your staking balance cannot be 0");
    // then we transfer the entire balance to the owner of the msg.sender
    tx = IERC20(_token).transfer(msg.sender, balance);
    tx.wait(1);
    // then we update this specific staker's token's balance to 0, as the balance has been sent
    stakingBalance[_token][msg.sender] = 0;
    // now we update the quantity of this token to the mapping uniqueTokensStaked, to remove the token that we just emptied the balance of
    uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;

    // reentrancy???
}
