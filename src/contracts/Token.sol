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
	mapping(address => mapping(address => uint256)) public allowance;

	// Events
	event Transfer(address indexed _from, address indexed _to, uint256 _value);
	event Approval(address indexed _owner, address indexed _spender, uint256 _value);

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

	function approve(address _spender, uint256 _value) public returns(bool success) {
		require(_spender != address(0));
		allowance[msg.sender][_spender] = _value;
		emit Approval(msg.sender, _spender, _value);
		return true;
	}

	function transferFrom(address _from, address _to, uint _value) public returns(bool success) {
		require(_to != address(0));
		allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
		balanceOf[_from] = balanceOf[_from].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);
		emit Transfer(_from, _to, _value);
		return true;
	}
}