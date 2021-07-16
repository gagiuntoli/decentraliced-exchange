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

pragma solidity >= 0.8.0 <= 0.8.4;

import './Token.sol';
import "../../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Exchange {

	using SafeMath for uint;

	address public feeAccount;
	uint256 public feePercent;
	address constant ETHER = address(0); // this allows to store Ether in the `tokens` mapping
	//      token   =>        (user    => balance)
	mapping(address => mapping(address => uint256)) public tokens;

	event Deposit(address _token, address _user, uint256 _amount, uint256 _balance);

	constructor (address _feeAccount, uint256 _feePercent) {
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}

	function depositEther() payable public {
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
		emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
	}

	function depositToken(address _token, uint256 _amount) public {
		require(_token != ETHER, "Ethers not allowed to be deposited");
		require(Token(_token).transferFrom(msg.sender, address(this), _amount));
		tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}
}