// SPDX-License-Identifier: MIT

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
	mapping(uint256 => _Order) public orders;
	uint256 public orderCount;
	mapping(uint256 => bool) public ordersCancelled;
	mapping(uint256 => bool) public ordersFilled;

	struct _Order {
		uint256 id;
		address user;
		address tokenGet;
		uint256 amountGet;
		address tokenGive;
		uint256 amountGive;
		uint256 timestamp;
	}

	event Deposit(address _token, address _user, uint256 _amount, uint256 _balance);
	event Withdraw(address _token, address _user, uint256 _amount, uint256 _balance);
	event Order (
		uint256 _id,
		address _user,
		address _tokenGet,
		uint256 _amountGet,
		address _tokenGive,
		uint256 _amountGive,
		uint256 _timestamp
	);
	event Cancel(
		uint256 _id,
		address _user,
		address _tokenGet,
		uint256 _amountGet,
		address _tokenGive,
		uint256 _amountGive,
		uint256 _timestamp
	);
	event Trade (
		uint256 _id,
		address _user,
		address _tokenGet,
		uint256 _amountGet,
		address _tokenGive,
		uint256 _amountGive,
		address _userFill,
		uint256 _timestamp
	);

	constructor (address _feeAccount, uint256 _feePercent) {
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}

	function depositEther() payable public {
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
		emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
	}

	function withdrawEther(uint256 _amount) public {
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
		payable(address(msg.sender)).transfer(_amount);
		emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
	}

	function depositToken(address _token, uint256 _amount) public {
		require(_token != ETHER, "Ethers not allowed to be deposited");
		require(Token(_token).transferFrom(msg.sender, address(this), _amount));
		tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}

	function withdrawToken(address _token, uint256 _amount) public {
		tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
		require(Token(_token).transfer(msg.sender, _amount));
		emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}

	function balanceOf(address _token, address _user) public view returns(uint256) {
		return tokens[_token][_user];
	}

	function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
		uint256 timestamp = block.timestamp;
		orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, timestamp);
		emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, timestamp);
		orderCount = orderCount.add(1);
	}

	function cancelOrder(uint256 _id) public {
		_Order storage order = orders[_id];
		require(msg.sender == order.user);
		require(order.id == _id);
		ordersCancelled[_id] = true;
		emit Cancel(
			_id,
			order.user,
			order.tokenGet,
			order.amountGet,
			order.tokenGive,
			order.amountGive,
			order.timestamp
		);
	}

	function fillOrder(uint256 _id) public {
		require(_id >= 0 && _id < orderCount);
		require(!ordersCancelled[_id]);
		require(!ordersFilled[_id]);
		_Order storage order = orders[_id];
		trade(order.id);
		ordersFilled[order.id] = true;
	}

	function trade(uint256 _id) internal {

		_Order storage order = orders[_id];

		uint256 feeAmount = order.amountGive.mul(feePercent).div(100);

		tokens[order.tokenGet][order.user] = tokens[order.tokenGet][order.user].add(order.amountGet);
		tokens[order.tokenGive][order.user] = tokens[order.tokenGive][order.user].sub(order.amountGive);

		tokens[order.tokenGet][msg.sender] = tokens[order.tokenGet][msg.sender].sub(order.amountGet);
		tokens[order.tokenGive][msg.sender] = tokens[order.tokenGive][msg.sender].add(order.amountGive);

		tokens[order.tokenGive][feeAccount] = tokens[order.tokenGive][feeAccount].add(feeAmount);
		tokens[order.tokenGive][order.user] = tokens[order.tokenGive][order.user].sub(feeAmount);

		emit Trade (
			order.id,
			order.user,
			order.tokenGet,
			order.amountGet,
			order.tokenGive,
			order.amountGive,
			msg.sender,
			block.timestamp
		);
	}
}