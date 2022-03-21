//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
pragma experimental ABIEncoderV2;

import "./@openzeppelin/contracts/token/ERC20/ERC20.sol";

//Simple Permissionless Hackathon contract where sponsors
//can deposit any token and rewards them to any address on withdraw

contract Hackathon {
    address public owner;

    //keeps track of amount deposited by each sponsor for a specific token
    //use a composite key of sponsor address + erc20 token address
    //such as sponsorsTokens['0xfooSponsor'+'0xbarToken'] = 123
    mapping(string => uint256) public sponsorsTokens;

    //keeps track of each ETH deposited by each sponsor
    mapping(address => uint256) public sponsorsETH;

    //TODO implement shares with bentobox
    mapping(string => uint256) public sponsorsShares;
 
    constructor() {
        owner = payable(msg.sender);
    }

    //deposit ETH
   function depositETH() payable public {
       //msg.value msg.sender
       sponsorsETH[msg.sender] = sponsorsETH[msg.sender] + msg.value;
   } 

    //deposit any token
    function depositToken(address erc20, uint amount) payable public{
        bytes32 data = bytes32(abi.encodePacked(msg.sender, erc20));
        string memory key = bytesToString(data);
        sponsorsTokens[key] = sponsorsTokens[key] + amount;
        ERC20 withdrawingToken = ERC20(erc20);
        require(withdrawingToken.transferFrom(msg.sender, address(this), amount), "Failed");
    }

    //we use this to concat token address and sponsor address in the sponsorsTokens mapping
    function bytesToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    //this is used to send and ETH reward to a bounty winner
    function withdraw(address payable winner,  uint amount) public payable{
        if(amount <= sponsorsETH[msg.sender]){
          (bool ok, ) = winner.call{value: amount}("");
          require(ok, "Failed");
          sponsorsETH[msg.sender] = sponsorsETH[msg.sender] - amount;
        }
   }

    //this is used to send a token reward to a bounty winner
    function withdrawERC20(address erc20, uint amount, address payable winner) public {
        ERC20 withdrawingToken = ERC20(erc20);
        bytes32 data = bytes32(abi.encodePacked(msg.sender, erc20));
        string memory key = bytesToString(data);
        if(amount <= sponsorsTokens[key]){
          require(withdrawingToken.transfer(winner, amount), "Failed");
          sponsorsTokens[key] = sponsorsTokens[key]-amount;
        }
    }
}
