const Token = artifacts.require('./Token');

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Token', (accounts) => {

	const name = 'Bitcoin Fake';
	const symbol = 'BTF';
	const decimals = '18';
	const totalSupply = '1' + '0'.repeat(6) + '0'.repeat(18);

	let token;
	beforeEach(async () => {
		// Fetch token from the blockchain
		token = await Token.new();
	});

	describe('deployment', () => {

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
			console.log(result)
			result.toString().should.equal(decimals);
		});

		it('tracks the total supply', async () => {
			const result = await token.totalSupply();
			result.toString().should.equal(totalSupply);
		});
	})
})