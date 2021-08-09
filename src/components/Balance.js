import Web3 from 'web3';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs } from 'react-bootstrap';

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

function Balance() {

	const [etherAmount, setEtherAmount] = useState(0);
	const [etherWallet, setEtherWallet] = useState(0);
	const [etherExchange, setEtherExchange] = useState(0);
	const [tokenAmount, setTokenAmount] = useState(0);
	const [tokenWallet, setTokenWallet] = useState(0);
	const [tokenExchange, setTokenExchange] = useState(0);
	const web3 = useSelector(state => state.reducerWeb3.web3);
	const accounts = useSelector(state => state.reducerWeb3.accounts);
	const myAccount = accounts[0];
	const exchange = useSelector(state => state.reducerExchange.contract);
	const token = useSelector(state => state.reducerToken.contract);

	const fetchData = async () => {
		if (web3 !== undefined) {
			setEtherWallet(Web3.utils.fromWei(await web3.eth.getBalance(myAccount)));
		}
		if (token !== undefined) {
			setTokenWallet(Web3.utils.fromWei(await token.methods.balanceOf(myAccount).call()));
		}
		if (exchange !== undefined) {
			setEtherExchange(Web3.utils.fromWei(await exchange.methods.balanceOf(ETHER_ADDRESS, myAccount).call()));
			setTokenExchange(Web3.utils.fromWei(await exchange.methods.balanceOf(token._address, myAccount).call()));
		}
	}
	useEffect(() => {
		fetchData();
	}, [web3])

	return (
		<div className="card bg-dark text-white">
			<div className="card-header">
				Balance
            </div>
			<div className="card-body">
				<Tabs defaultActiveKey="deposit" id="uncontrolled-tab-example" className="mb-3">
  					<Tab eventKey="deposit" title="Deposit">
						<table className="table table-dark table-sm small">
							<thead>
								<tr>
									<th scope="col">Token</th>
									<th scope="col">Wallet</th>
									<th scope="col">Exchange</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="col">ETH</th>
									<th scope="col">{etherWallet}</th>
									<th scope="col">{etherExchange}</th>
								</tr>
								<tr>
									<th>
										<form className="row" onSubmit={(e) => {
											e.preventDefault();
											exchange.methods.depositEther().send({
												from: myAccount,
												value: Web3.utils.toWei(etherAmount.toString())
											}).on('confirmation', () => fetchData());
										}}>
											<div className="col-12 col-sm pr-sm-2">
												<input
													type="text"
													placeholder="ETH Amount"
													onChange={e => setEtherAmount(e.target.value)}
													className="form-control form-control-sm bg-dark text-white"
													required />
												<div className="col-12 col-sm-auto pl-sm-0">
													<button type="submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
												</div> 
											</div>
										</form>
									</th>
								</tr>
								<tr>
									<th scope="col">BTF</th>
									<th scope="col">{tokenWallet}</th>
									<th scope="col">{tokenExchange}</th>
								</tr>
								<tr>
									<th>
										<form className="row" onSubmit={async (e) => {
											e.preventDefault();
											await token.methods.approve(
												exchange._address,
												Web3.utils.toWei(tokenAmount.toString())
											).send({from: myAccount});

											exchange.methods.depositToken(
												token._address,
												Web3.utils.toWei(tokenAmount.toString())
											).send({from: myAccount})
											.on('confirmation', () => fetchData());
										}}>
											<div className="col-12 col-sm pr-sm-2">
												<input
													type="text"
													placeholder="BTF Amount"
													onChange={e => setTokenAmount(e.target.value)}
													className="form-control form-control-sm bg-dark text-white"
													required />
												<div className="col-12 col-sm-auto pl-sm-0">
													<button type="submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
												</div> 
											</div>
										</form>
									</th>
								</tr>
							</tbody>
						</table>

					</Tab>
  					<Tab eventKey="withdraw" title="Withdraw">
						<table className="table table-dark table-sm small">
							<thead>
								<tr>
									<th scope="col">Token</th>
									<th scope="col">Wallet</th>
									<th scope="col">Exchange</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="col">ETH</th>
									<th scope="col">{etherWallet}</th>
									<th scope="col">{etherExchange}</th>
								</tr>
								<tr>
									<th>
										<form className="row" onSubmit={async (e) => {
											e.preventDefault();
											await exchange.methods.withdrawEther(Web3.utils.toWei(etherAmount.toString())).send({from: myAccount});
										}}>
											<div className="col-12 col-sm pr-sm-2">
												<input
													type="text"
													placeholder="ETH Amount"
													onChange={e => setEtherAmount(e.target.value)}
													className="form-control form-control-sm bg-dark text-white"
													required />
												<div className="col-12 col-sm-auto pl-sm-0">
													<button type="submit" className="btn btn-primary btn-block btn-sm">Withdraw</button>
												</div> 
											</div>
										</form>
									</th>
								</tr>
								<tr>
									<th scope="col">BTF</th>
									<th scope="col">{tokenWallet}</th>
									<th scope="col">{tokenExchange}</th>
								</tr>
								<tr>
									<th>
										<form className="row" onSubmit={async (e) => {
											e.preventDefault();
											await exchange.methods.withdrawToken(token._address, Web3.utils.toWei(tokenAmount.toString())).send({ from: myAccount });
										}}>
											<div className="col-12 col-sm pr-sm-2">
												<input
													type="text"
													placeholder="BTF Amount"
													onChange={e => setTokenAmount(e.target.value)}
													className="form-control form-control-sm bg-dark text-white"
													required />
												<div className="col-12 col-sm-auto pl-sm-0">
													<button type="submit" className="btn btn-primary btn-block btn-sm">Withdraw</button>
												</div> 
											</div>
										</form>
									</th>
								</tr>
							</tbody>
						</table>
					</Tab>
				</Tabs>
			</div>
		</div>
	)
}

export default Balance;