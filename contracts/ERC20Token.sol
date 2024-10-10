// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
    constructor() ERC20("My ERC20 TOKEN", "MET") {
        _mint(msg.sender, 1_000_000 * (10 ** decimals()));
    }

    // function decimals() public pure override returns (uint8) {
    //     return 18;
    // }
}