//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

interface IWETH {
    function deposit() external payable;

    function withdraw(uint256 wad) external;
}
