const Token = artifacts.require('./Token');
import { toWei } from './util';

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
		it('transfers token balances', async () => {

			const result = await token.transfer(receiver, toWei(100), { from: deployer });

			const balanceOfDeployer = await token.balanceOf(deployer);
			balanceOfDeployer.toString().should.equal(toWei(1000000 - 100).toString())
			const balanceOfReceiver = await token.balanceOf(receiver);
			balanceOfReceiver.toString().should.equal(toWei(100).toString())
		})
	});
})