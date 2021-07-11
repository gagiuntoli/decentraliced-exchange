
export const toWei = (n) => {
	//return "1" + "0".repeat(n);
	// Replace in future for some generic 'decimals'
	return new web3.utils.BN(
		web3.utils.toWei(n.toString(), 'ether')
	)
}
