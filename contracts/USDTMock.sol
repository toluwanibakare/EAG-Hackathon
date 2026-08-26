// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title USDTMock
 * @notice Mock USDT token for testing on HSK Chain local/testnet.
 */
contract USDTMock is ERC20 {
    address public owner;

    error OnlyOwner();
    error ZeroAmount();

    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);

    constructor() ERC20("Tether USD", "USDT") {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        if (amount == 0) revert ZeroAmount();
        _mint(to, amount);
        emit Minted(to, amount);
    }

    function burn(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();
        _burn(msg.sender, amount);
        emit Burned(msg.sender, amount);
    }
}
