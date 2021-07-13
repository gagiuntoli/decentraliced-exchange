// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0;

import "../../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Token {
	using SafeMath for uint;

	string public name = "Bitcoin Fake";
	string public symbol = "BTF";
	uint256 public decimals = 18;
	uint256 public totalSupply;

	mapping(address => uint256) public balanceOf;

	// Events
	event Transfer(address indexed from, address indexed to, uint256 value);

	constructor() {
		totalSupply = 10**6 * (10**decimals);
		balanceOf[msg.sender] = totalSupply;
	}

	function transfer(address _to, uint256 _value) public returns (bool success) {
		require(balanceOf[msg.sender] >= _value);
		require(_to != address(0));
		balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);
		emit Transfer(msg.sender, _to, _value);
		return true;
	}
}