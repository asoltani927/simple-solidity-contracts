// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library ArrayUtils {
    function remove(string[] storage array, string memory value) internal returns (bool) {
        uint256 length = array.length;
        for (uint256 i = 0; i < length; i++) {
            if (keccak256(abi.encodePacked(array[i])) == keccak256(abi.encodePacked(value))) {
                array[i] = array[length - 1];
                array.pop();
                return true;
            }
        }
        return false;
    }
}