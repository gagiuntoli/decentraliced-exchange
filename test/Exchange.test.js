
const Token = artifacts.require('./Token');
const Exchange = artifacts.require('./Exchange');

import { toWei } from './util';

const EVM_REJECT = "VM Exception while processing transaction: revert";

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

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

	describe('fallback', () => {
		it('revert when Ether is sent to the address of the constract', async () => {
			await exchange.sendTransaction({from: user1, value: 1}).should.be.rejectedWith(EVM_REJECT);
		});
	});

	describe('depositing Ethers', () => {
		let result;
		beforeEach( async () => {
			result = await exchange.depositEther({from: user1, value: toWei(1).toString()});
		})

		it('tracks the Ether deposit', async () => {
			const balanceExchange = await exchange.tokens(ETHER_ADDRESS, user1);
			balanceExchange.toString().should.equal(toWei(1).toString());
		})

		it('emits a Deposit event', () => {
			const log = result.logs[0];
			log.event.should.equal('Deposit');
			const event = log.args;

			event._token.toString().should.equal(ETHER_ADDRESS);
			event._user.toString().should.equal(user1);
			event._amount.toString().should.equal(toWei(1).toString());
			event._balance.toString().should.equal(toWei(1).toString());
		});
	});

	describe('depositing tokens', () => {

		describe('success', async () => {

			let result;
			beforeEach(async () => {
				await token.approve(exchange.address, toWei(10), { from: user1 });
				result = await exchange.depositToken(token.address, toWei(10), { from: user1 });
			});

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
			});
		});

		describe('failure', () => {
			it('rejects Ether deposits', async () => {
				await exchange.depositToken(ETHER_ADDRESS, toWei(10), {from: user1}).should.be.rejectedWith(EVM_REJECT);
			});

			it('fails when no tokens are approved', async () => {
				await exchange.depositToken(token.address, toWei(10), {from: user1}).should.be.rejectedWith(EVM_REJECT);
			});
		});

	});
});