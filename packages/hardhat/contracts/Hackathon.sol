//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
pragma experimental ABIEncoderV2;

import "./@openzeppelin/contracts/token/ERC20/ERC20.sol";

error DepositFailed();
error WithdrawFailed();
error NotEnoughEther();
error NotEnoughTokens();

/**
    @title ETH Dubai -- Hackathon contract
    @notice Simple Permissionless Hackathon contract where sponsors
            can deposit any token and rewards them to any address on withdraw
**/
contract Hackathon {
    address public immutable owner;

    //keeps track of amount deposited by each sponsor for a specific token
    // mapping(sponsor => mapping(erc20 => amount))
    mapping(address => mapping(address => uint256)) public sponsorsTokens;

    //keeps track of each ETH deposited by each sponsor
    // mapping(sponsor => amount)
    mapping(address => uint256) public sponsorsETH;

    //TODO implement shares with bentobox
    mapping(string => uint256) public sponsorsShares;

    constructor() {
        owner = payable(msg.sender);
    }

    /// @notice Allow anyone to deposit some native tokens.
    function depositETH() public payable {
        sponsorsETH[msg.sender] += msg.value;
    }

    /**
        @notice Allow anyone to deposit any ERC20 tokens
        This function will be called by sponsors to deposit some tokens into the contract
        @param erc20 The address of the ERC20 token to be deposited
        @param amount The amount of tokens to be deposited
    **/
    function depositToken(address erc20, uint256 amount) external payable {
        sponsorsTokens[msg.sender][erc20] += amount;

        ERC20 withdrawingToken = ERC20(erc20);

        if (!withdrawingToken.transferFrom(msg.sender, address(this), amount))
            revert DepositFailed();
    }

    /** 
        @notice Allow sponsors to reward winner using some native tokens. 
        This function will be called by sponsors to reward winners with some native tokens
        @param winner The address of the winner to be rewarded
        @param amount The amount of native tokens to be rewarded
    **/
    function withdraw(address payable winner, uint256 amount) external payable {
        if (amount > sponsorsETH[msg.sender]) revert NotEnoughEther();

        /* As the amount is checked to be lower than the amount of ETH the sender has,
           this value won't underflow. */
        unchecked {
            sponsorsETH[msg.sender] -= amount;
        }

        (bool ok, ) = winner.call{value: amount}("");
        if (!ok) revert WithdrawFailed();
    }

    /** 
        @notice Allow sponsors to reward winner using some ERC20 tokens. 
        This function will be called by sponsors to reward winners with some ERC20 tokens
        @param winner The address of the winner to be rewarded
        @param amount The amount of ERC20 tokens to be rewarded
    **/
    function withdrawERC20(
        address erc20,
        uint256 amount,
        address payable winner
    ) external {
        ERC20 withdrawingToken = ERC20(erc20);

        if (amount > sponsorsTokens[msg.sender][erc20])
            revert NotEnoughTokens();

        sponsorsTokens[msg.sender][erc20] -= amount;
        if (!withdrawingToken.transfer(winner, amount)) revert WithdrawFailed();
    }
}
