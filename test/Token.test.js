const Token = artifacts.require('./Token');
import { toWei } from './util';

const EVM_REJECT = "VM Exception while processing transaction: revert";

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Token', ([deployer, receiver, exchange]) => {

	const name = 'Bitcoin Fake';
	const symbol = 'BTF';
	const decimals = '18';
	const totalSupply = toWei(1000000).toString();

	let token;
	beforeEach(async ()=>{
		// Fetch token from the blockchain
		token = await Token.new();
	})

	describe('Deploy the contract with the correct parameter', () => {

		it('tracks the name', async () => {
			const result = await token.name();
			result.should.equal(name);
		});

		it('tracks the symbol', async () => {
			const result = await token.symbol();
			result.should.equal(symbol);
		});

		it('tracks the decimals', async () => {
			const result = await token.decimals();
			result.toString().should.equal(decimals);
		});

		it('tracks the total supply', async () => {
			const result = await token.totalSupply();
			result.toString().should.equal(totalSupply);
		});

		it('assigns the total supply to the deployer', async () => {
			const result = await token.balanceOf(deployer);
			result.toString().should.equal(totalSupply);
		});
	});

	describe('Send Tokens', () => {

		describe('Correct amounts', () => {

			let validAmount, result;
			beforeEach(async () => {
				validAmount = toWei(100);
				result = await token.transfer(receiver, validAmount, { from: deployer });
			});

			it('transfers token balances', async () => {
				const balanceOfDeployer = await token.balanceOf(deployer);
				balanceOfDeployer.toString().should.equal(toWei(1000000 - 100).toString())
				const balanceOfReceiver = await token.balanceOf(receiver);
				balanceOfReceiver.toString().should.equal(toWei(100).toString())
			});

			it('emits a transfer event', () => {
				const log = result.logs[0];
				log.event.should.equal('Transfer');
				const event = log.args;
				event._from.toString().should.equal(deployer, 'sender is correct');
				event._to.toString().should.equal(receiver, 'receiver is correct');
				event._value.toString().should.equal(validAmount.toString(), 'value is correct');
			});
		});

		describe('Incorrect transfers', () => {

			it('rejects insufficient balances', async () => {
				let invalidAmount;
				invalidAmount = toWei(1000001);
				await token.transfer(receiver, invalidAmount, {from: deployer}).should.be.rejectedWith(EVM_REJECT);

				invalidAmount = toWei(1);
				await token.transfer(deployer, invalidAmount, {from: receiver}).should.be.rejectedWith(EVM_REJECT);
			});

			it('rejects invalid recipients', async () => {
				const validAmount = toWei(100);
				await token.transfer("0x0000000000000000000000000000000000000000", validAmount, { from: deployer }).should.be.rejectedWith(EVM_REJECT);
			})
		});
	});

	describe("approve tokens", () => {

		let amount, result;
		beforeEach(async ()=>{
			// 'deployer' allows 'exchange' to move 'amount=100' to whom 'exchange' wants
			amount = toWei(100);
			result = await token.approve(exchange, amount, {from: deployer});
		});

		describe("success", () => {
			it('allocates an allowance for delegate token spending on exchange', async () => {
				const allowance = await token.allowance(deployer, exchange);
				allowance.toString().should.equal(amount.toString());
			});

			it('emits an Approval event', () => {
				const log = result.logs[0];
				log.event.should.equal('Approval');
				const event = log.args;
				event._owner.toString().should.equal(deployer, 'owner is correct');
				event._spender.toString().should.equal(exchange, 'owner is correct');
			});
		});

		describe("failure", () => {
			it('rejects invalid recipient', async() => {
				await token.approve("0x0000000000000000000000000000000000000000", amount, {from: deployer}).should.be.rejectedWith(EVM_REJECT);
			});
		});
	});
	
	describe('delegating token transfers', () => {

		let amount;
		beforeEach(async () => {
			// 'deployer' allows 'exchange' to move 'amount=100' to whom 'exchange' wants
			amount = toWei(100);
			await token.approve(exchange, amount, { from: deployer });
		});

		describe('successful transaction', () => {

			let resultTransfer;
			beforeEach(async ()=>{
				resultTransfer = await token.transferFrom(deployer, receiver, amount, { from: exchange });
			});

			it('transfers token balances', async() => {
				const balanceOfDeployer = await token.balanceOf(deployer);
				balanceOfDeployer.toString().should.equal(toWei(1000000 - 100).toString());

				const balanceOfReceiver = await token.balanceOf(receiver);
				balanceOfReceiver.toString().should.equal(toWei(100).toString());
			});

			it('resets the allowance', async () => {
				const allowance = await token.allowance(deployer, exchange);
				allowance.toString().should.equal(toWei(0).toString());
			});
			
			it('emits a Transfer event', () => {
				const log = resultTransfer.logs[0]
				log.event.should.equal("Transfer");
				const event = log.args;
				event._from.toString().should.equal(deployer, '_from is correct');
				event._to.toString().should.equal(receiver, '_to is correct');
				event._value.toString().should.equal(amount.toString(), '_amount is correct');
			});
		});

		describe('Invalid transaction', () => {

			it('tries to transfer more as allowed', async () => {
				// deployer (1000000) receiver (0) exchange (0)
				// allowance [deployer][exchange] = 100
				// deployer -> 101 -> receiver : by exchange (not allowed)
				const invalidAmount = toWei(101);
				await token.transferFrom(deployer, receiver, invalidAmount, { from: exchange }).should.be.rejectedWith(EVM_REJECT);
			});

			it('tries to transfer more as the balance', async ()=>{
				// deployer (1000000) receiver (0) exchange (0)
				// allowance [deployer][exchange] = 100
				// deployer -> 10,000,000 -> receiver : by exchange (not allowed)
				const invalidAmount = toWei(10000000);
				const result = await token.transferFrom(deployer, receiver, invalidAmount, { from: exchange }).should.be.rejectedWith(EVM_REJECT);
			});

			it('it tries to transfer to an invalid address', async () => {
				const validAmount = toWei(10);
				await token.transferFrom(deployer, "0x0000000000000000000000000000000000000000", amount, { from: exchange }).should.be.rejectedWith(EVM_REJECT);
			});
		});

	});
})