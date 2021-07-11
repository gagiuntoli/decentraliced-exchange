// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0;

contract Token {
	string public name = "Bitcoin Fake";
	string public symbol = "BTF";
	uint256 public decimals = 18;
	uint256 public totalSupply;

	constructor() public {
		totalSupply = 10**6 * (10**decimals);
	}
}