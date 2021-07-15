
const Token = artifacts.require('./Token');
const Exchange = artifacts.require('./Exchange');

import { toWei } from './util';

const EVM_REJECT = "VM Exception while processing transaction: revert";

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Exchange', ([deployer, feeAccount, user1]) => {

	let exchange, token;
	const feePercent = 10;

	beforeEach(async ()=>{
		token = await Token.new();
		exchange = await Exchange.new(feeAccount, feePercent);
		token.transfer(user1, toWei(100), {from: deployer});
	});

	describe('deployment', () => {

		it('tracks the fee account', async () => {
			const result = await exchange.feeAccount();
			result.should.equal(feeAccount);
		});

		it('tracks the fee percent', async () => {
			const result = await exchange.feePercent();
			result.toString().should.equal(feePercent.toString());
		});
	});

	describe('depositing tokens', () => {
		let result;

		beforeEach(async () => {
			await token.approve(exchange.address, toWei(10), {from: user1});
			result = await exchange.depositToken(token.address, toWei(10), {from: user1});
		});

		describe('success', async () => {
			it('tracks the token deposit', async () => {
				const balanceExchange = await token.balanceOf(exchange.address);
				balanceExchange.toString().should.equal(toWei(10).toString());
				const balanceUser1OnExchange = await exchange.tokens(token.address, user1);
				balanceUser1OnExchange.toString().should.equal(toWei(10).toString());
			});

			it('emits a `Deposit` event', () => {
				const log = result.logs[0];
				log.event.should.equal('Deposit');
				const event = log.args;

				event._token.toString().should.equal(token.address);
				event._user.toString().should.equal(user1);
				event._amount.toString().should.equal(toWei(10).toString());
				event._balance.toString().should.equal(toWei(10).toString());
				console.log("user", event._user.toString());
				console.log("amount", event._amount.toString());
				console.log("balance", event._balance.toString());
			});
		});
	});
});