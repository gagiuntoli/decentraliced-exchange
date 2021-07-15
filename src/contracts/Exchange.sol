// SPDX-License-Identifier: MIT

// TODO:
// [x] Set the fee account
// [ ] Deposit Ether
// [ ] Withdraw Ether
// [ ] Deposit Tokens
// [ ] Check balances
// [ ] Make orders
// [ ] Cancel order
// [ ] Fill order
// [ ] Charge fees

pragma solidity >= 0.8.0;

import './Token.sol';
import "../../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Exchange {

	using SafeMath for uint;

	address public feeAccount;
	uint256 public feePercent;
	//      token   =>        (user    => balance)
	mapping(address => mapping(address => uint256)) public tokens;

	event Deposit(address _token, address _user, uint256 _amount, uint256 _balance);

	constructor (address _feeAccount, uint256 _feePercent) {
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}

	function depositToken(address _token, uint256 _amount) public {
		// [X] which token? (address _token)
		// [X] how much?
		// [ ] manage deposit
		// [ ] send tokens to this contract

		// We allow the exchange to transfer tokens from the user account
		require(Token(_token).transferFrom(msg.sender, address(this), _amount));
		tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}
}