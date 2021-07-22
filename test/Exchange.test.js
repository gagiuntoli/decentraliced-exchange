
const Token = artifacts.require('./Token');
const Exchange = artifacts.require('./Exchange');

import { toWei } from './util';

const EVM_REJECT = "VM Exception while processing transaction: revert";

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Exchange', ([deployer, feeAccount, user1, user2]) => {

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

	describe('withdraws Ethers funds', async () => {
		let result;
		beforeEach(async () => {
			// user1 = +1 Ether
			await exchange.depositEther({from: user1, value: toWei(1)});
		});

		describe('success', () => {
			beforeEach(async () => {
				// user1 = -1 Ether
				result = await exchange.withdrawEther(toWei(1), { from: user1 });
			});
			it('withdraws Ether funds', async () => {
				const balance = await exchange.tokens(ETHER_ADDRESS, user1);
				balance.toString().should.equal(toWei(0).toString());
			});

			it('emits a `Withdraw` event', () => {
				const log = result.logs[0];
				log.event.should.equal('Withdraw');
				const event = log.args;

				event._token.toString().should.equal(ETHER_ADDRESS);
				event._user.toString().should.equal(user1);
				event._amount.toString().should.equal(toWei(1).toString());
				event._balance.toString().should.equal(toWei(0).toString());
			});
		});

		describe('failure', () => {
			it('rejects withdraw do to insufficient balance', async () => {
				await exchange.withdrawEther(toWei(2), {from: user1}).should.be.rejectedWith(EVM_REJECT);
			});
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

	describe('withdraw tokens', () => {

		let result;
		beforeEach(async () => {
			await token.approve(exchange.address, toWei(10), { from: user1 });
			await exchange.depositToken(token.address, toWei(10), { from: user1 });
			result = await exchange.withdrawToken(token.address, toWei(10), { from: user1 });
		});

		describe('success', () => {

			it('withdraws token funds', async () => {
				const balance = await exchange.tokens(token.address, user1);
				balance.toString().should.equal('0');
			});

			it('emits a `Withdraw` event', () => {
				const log = result.logs[0];
				log.event.should.equal('Withdraw');
				const event = log.args;

				event._token.toString().should.equal(token.address);
				event._user.toString().should.equal(user1);
				event._amount.toString().should.equal(toWei(10).toString());
				event._balance.toString().should.equal(toWei(0).toString());
			});
		});

		describe('failure', () => {
			it('rejects Ether withdraws', async () => {
				await exchange.withdrawToken(ETHER_ADDRESS, toWei(10), {from: user1}).should.be.rejectedWith(EVM_REJECT);
			});
		});
	});

	describe('check balances', () => {
		beforeEach(async () => {
			await exchange.depositEther({from: user1, value: toWei(10)});
		});

		it('returns user balances', async () => {
			const balance = await exchange.balanceOf(ETHER_ADDRESS, user1);
			balance.toString().should.equal(toWei(10).toString());
		});
	});

	describe('Making orders', () => {
		let result;
		beforeEach(async()=>{
			result = await exchange.makeOrder(token.address, toWei(1), ETHER_ADDRESS, toWei(1), {from: user1});
		});

		it('tracks the newly created order', async () => {
			const orderCount = await exchange.orderCount();
			orderCount.toString().should.equal('1');
			const order = await exchange.orders('0');
			order.id.toString().should.equal('0', 'id is correct');
			order.user.toString().should.equal(user1, 'user is correct');
			order.tokenGet.toString().should.equal(token.address, 'tokenGet is correct');
			order.amountGet.toString().should.equal(toWei(1).toString(), 'amoungGet is correct');
			order.tokenGive.toString().should.equal(ETHER_ADDRESS, 'tokenGive is correct');
			order.amountGive.toString().should.equal(toWei(1).toString(), 'amountGive is correct');
			order.timestamp.toString().length.should.be.at.least(1, 'timestamp is present');
		});

		it('emits an `Order` event', () => {
			const log = result.logs[0];
			log.event.should.equal('Order');
			const event = log.args;

			event._id.toString().should.equal('0', '_id is correct');
			event._user.toString().should.equal(user1, '_user is correct');
			event._tokenGet.toString().should.equal(token.address, '_tokenGet is correct');
			event._amountGet.toString().should.equal(toWei(1).toString(), '_amountGet is correct');
			event._tokenGive.toString().should.equal(ETHER_ADDRESS, '_tokenGive is correct');
			event._amountGive.toString().should.equal(toWei(1).toString(), '_amountGive is correct');
			event._timestamp.toString().length.should.at.least(1, '_timestamp is present');
		});
	});

	describe('order actions', () => {
		beforeEach(async() => {
			await exchange.depositEther({ from: user1, value: toWei(2) });
			await token.transfer(user2, toWei(100), {from: deployer});
			await token.approve(exchange.address, toWei(2), {from: user2});
			await exchange.depositToken(token.address, toWei(2), {from: user2});
			await exchange.makeOrder(token.address, toWei(1), ETHER_ADDRESS, toWei(1), {from: user1});
		});

		describe('filling orders', () => {
			let result;
			describe('success', () => {
				beforeEach(async() => {
					result = await exchange.fillOrder('0', {from: user2});
				});
				it('executes the trade & charges the fees', async () => {
					let balance;
					balance = await exchange.balanceOf(token.address, user1);
					balance.toString().should.equal(toWei(1).toString(), "user1 received 1.0 token");
					balance = await exchange.balanceOf(ETHER_ADDRESS, user2);
					balance.toString().should.equal(toWei(1).toString(), "user2 received 1.0 Ether");
					balance = await exchange.balanceOf(ETHER_ADDRESS, user1);
					balance.toString().should.equal(toWei(0.9).toString(), "user1 has 0.9 = 2.0 - 1.1 Ethers");
					balance = await exchange.balanceOf(token.address, user2);
					balance.toString().should.equal(toWei(1).toString(), "user2 has 1.0 = 2.0 - 1.0 token");
					balance = await exchange.balanceOf(ETHER_ADDRESS, feeAccount);
					balance.toString().should.equal(toWei(0.1).toString(), "the fee account has 0.1 Ether");
				});

				it('updates filled orders', async() => {
					const orderFilledStatus = await exchange.ordersFilled(0);
					orderFilledStatus.should.equal(true);
				});

				it('emits a `Trade` event', async () => {
					const log = result.logs[0];
					log.event.should.equal('Trade');
					const event = log.args;

					event._id.toString().should.equal('0', '_id is correct');
					event._user.toString().should.equal(user1, '_user is correct');
					event._tokenGet.toString().should.equal(token.address, '_tokenGet is correct');
					event._amountGet.toString().should.equal(toWei(1).toString(), '_amountGet is correct');
					event._tokenGive.toString().should.equal(ETHER_ADDRESS, '_tokenGive is correct');
					event._amountGive.toString().should.equal(toWei(1).toString(), '_amountGive is correct');
					event._userFill.toString().should.equal(user2, '_userFill is correct');
					event._timestamp.toString().length.should.at.least(1, '_timestamp is present');
				});
			});

			describe('failure', () => {
				it('rejects invalid order ids', async() => {
					await exchange.fillOrder(1).should.be.rejectedWith(EVM_REJECT);
				});

				it('rejects already filled order', async() => {
					await exchange.fillOrder('0', {from: user2}).should.be.fulfilled;
					await exchange.fillOrder('0', {from: user2}).should.be.rejectedWith(EVM_REJECT);
				});

				it('rejects already cancelled order', async() => {
					await exchange.cancelOrder('0', {from: user1}).should.be.fulfilled;
					await exchange.fillOrder('0', {from: user2}).should.be.rejectedWith(EVM_REJECT);
				});
			});
		});

		describe('cancelling orders', () => {
			describe('success', () => {
				let result;
				beforeEach(async() => {
					result = await exchange.cancelOrder('0', {from: user1});
				});

				it('updates cancelled orders', async () => {
					const orderCancelled = await exchange.ordersCancelled(0);
					orderCancelled.should.equal(true);
				});

				it('emits a `Cancel` event', () => {
					const log = result.logs[0];
					log.event.should.equal('Cancel');
					const event = log.args;

					event._id.toString().should.equal('0', '_id is correct');
				});
			});

			describe('failure', () => {
				it('rejects invalid order id', async() => {
					await exchange.cancelOrder('1', {from: user1}).should.be.rejectedWith(EVM_REJECT);
				});

				it('rejects invalid user', async() => {
					await exchange.cancelOrder('0', {from: user2}).should.be.rejectedWith(EVM_REJECT);
				});
			});
		});
	});
});