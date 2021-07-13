const Token = artifacts.require('./Token');
import { toWei } from './util';

const EVM_REJECT = "VM Exception while processing transaction: revert";

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Token', ([deployer, receiver]) => {

	const name = 'Bitcoin Fake';
	const symbol = 'BTF';
	const decimals = '18';
	const totalSupply = toWei(1000000).toString();

	let token;
	beforeEach(async () => {
		// Fetch token from the blockchain
		token = await Token.new();
		console.log("We deploy a new smart contract")
	});

	describe('Deploy the contract', () => {

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

		let amount, result;

		describe('Correct amounts', async () => {

			beforeEach(async () => {
				amount = toWei(100);
				result = await token.transfer(receiver, amount, { from: deployer });
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
				event.from.toString().should.equal(deployer, 'sender is correct');
				event.to.toString().should.equal(receiver, 'receiver is correct');
				event.value.toString().should.equal(amount.toString(), 'value is correct');
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
				await token.transfer("0x0000000000000000000000000000000000000000", amount, { from: deployer }).should.be.rejectedWith(EVM_REJECT);
			})
		});
	});
})