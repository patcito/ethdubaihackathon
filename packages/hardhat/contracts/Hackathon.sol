//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
pragma experimental ABIEncoderV2;

import "./@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Hackathon {
    address public owner;

    mapping(string => uint256) public sponsorsTokens;
    mapping(address => uint256) public sponsorsETH;

    //TODO implement shares with bentobox
    mapping(string => uint256) public sponsorsShares;
 
    constructor() {
        owner = payable(msg.sender);
    }

   function depositETH() payable public {
       //msg.value msg.sender
       sponsorsETH[msg.sender] = sponsorsETH[msg.sender] + msg.value;
   } 

    function depositToken(address erc20, uint amount) payable public{
        bytes32 data = bytes32(abi.encodePacked(msg.sender, erc20));
        string memory key = bToS(data);
        //uint256 currentVote = userProjectVotes[key];
        sponsorsTokens[key] = sponsorsTokens[key] + amount;
        ERC20 withdrawingToken = ERC20(erc20);
        //uint256 erc20Balance = withdrawingToken.balanceOf(address(this));
        require(withdrawingToken.transferFrom(msg.sender, address(this), amount), "Failed");
    }
    function bToS(bytes32 _bytes32) public pure returns (string memory) {
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
    function withdraw(address payable winner,  uint amount) public payable{
        if(amount <= sponsorsETH[msg.sender]){
          (bool ok, ) = winner.call{value: amount}("");
          require(ok, "Failed");
          sponsorsETH[msg.sender] = sponsorsETH[msg.sender] - amount;
        }
   }

    function withdrawERC20(address erc20, uint amount, address payable winner) public {
        ERC20 withdrawingToken = ERC20(erc20);
        bytes32 data = bytes32(abi.encodePacked(msg.sender, erc20));
        string memory key = bToS(data);
        if(amount <= sponsorsTokens[key]){
          require(withdrawingToken.transfer(winner, amount), "Failed");
          sponsorsTokens[key] = sponsorsTokens[key]-amount;
        }
    }
}
