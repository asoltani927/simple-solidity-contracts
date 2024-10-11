// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library GiftCalculator {
    function calculateGift(uint256 amount) public pure returns (uint256) {
        return amount * 2;
    }
}

