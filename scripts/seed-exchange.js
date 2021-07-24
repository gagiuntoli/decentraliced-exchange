const { wait } = require("@testing-library/dom");

const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function(callback) {
	try {
		console.log("script running");

		const accounts = await web3.eth.getAccounts();

		const token = await Token.deployed();
		console.log("Token fetched", token.address);

		const exchange = await Exchange.deployed();
		console.log("Exchange fetched", exchange.address);

		const sender = accounts[0]; // in migrations -> the first account
		const receiver = accounts[1];
		console.log("sender", sender)
		console.log("receiver", receiver)
		let amount = web3.utils.toWei("10000", "ether");

		await token.transfer(receiver, amount, {from: sender});
		console.log(`Tranferred ${amount} tokens from ${sender} to ${receiver}`);

		const user1 = accounts[0];
		const user2 = accounts[1];

		amount = web3.utils.toWei("1");
		await exchange.depositEther({from: user1, value: amount});
		console.log(`Deposited ${amount} of Ether from ${user1}`);

		amount = web3.utils.toWei("10000");
		await token.approve(exchange.address, amount, {from: user2});
		console.log(`Approved ${amount} of Token from ${user2}`);

		await exchange.depositToken(token.address, amount, {from: user2});
		console.log(`Deposited ${amount} of Token from ${user2}`);

		let result;
		let orderId;
		result = await exchange.makeOrder(token.address, web3.utils.toWei("100"), ETHER_ADDRESS, web3.utils.toWei("0.1"), {from: user1});
		console.log(`Made order from ${user1}`);

		orderId = result.logs[0].args._id.toString();
		await exchange.cancelOrder(orderId, {from: user1});
		console.log(`Cancelled order ${orderId} made from ${user1}`);


		result = await exchange.makeOrder(token.address, web3.utils.toWei("100"), ETHER_ADDRESS, web3.utils.toWei("0.1"), {from: user1});
		console.log(`Made order from ${user1}`);

		orderId = result.logs[0].args._id.toString();
		await exchange.fillOrder(orderId, {from: user2});
		console.log(`Filled order from ${user2}`);

		await timeout(1000)

		result = await exchange.makeOrder(token.address, web3.utils.toWei("50"), ETHER_ADDRESS, web3.utils.toWei("0.01"), {from: user1});
		console.log(`Made order from ${user1}`);

		orderId = result.logs[0].args._id.toString();
		await exchange.fillOrder(orderId, {from: user2});
		console.log(`Filled order from ${user2}`);

		await timeout(1000)

		result = await exchange.makeOrder(token.address, web3.utils.toWei("200"), ETHER_ADDRESS, web3.utils.toWei("0.15"), {from: user1});
		console.log(`Made order from ${user1}`);

		orderId = result.logs[0].args._id.toString();
		await exchange.fillOrder(orderId, {from: user2});
		console.log(`Filled order from ${user2}`);

		await timeout(1000)

		for(let i=0; i<10; i++) {
			result = await exchange.makeOrder(token.address, web3.utils.toWei(`${10 * i}`), ETHER_ADDRESS, web3.utils.toWei("0.1"), { from: user1 });
			console.log(`Made order from ${user1}`);
			await timeout(500)
		}

		for(let i=0; i<10; i++) {
			result = await exchange.makeOrder(token.address, web3.utils.toWei("0.01"), ETHER_ADDRESS, web3.utils.toWei(`${10 * i}`), { from: user2 });
			console.log(`Made order from ${user2}`);
			await timeout(500)
		}
	}
	catch (error) {
		console.log(error);
	}
	callback();
}