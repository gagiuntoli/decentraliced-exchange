import Web3 from 'web3';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs } from 'react-bootstrap';

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

function Balance() {

	const [etherWallet, setEtherWallet] = useState(0);
	const [etherExchange, setEtherExchange] = useState(0);
	const web3 = useSelector(state => state.reducerWeb3.web3);
	const accounts = useSelector(state => state.reducerWeb3.accounts);
	const myAccount = accounts[0];
	const exchange = useSelector(state => state.reducerExchange.contract);
	const token = useSelector(state => state.reducerToken.contract);

	useEffect(() => {
		const fetchData = async () => {
			if (web3 !== undefined) {
				setEtherWallet(Web3.utils.fromWei(await web3.eth.getBalance(myAccount)));
			}
			if (exchange !== undefined) {
				setEtherExchange(Web3.utils.fromWei(await exchange.methods.balanceOf(ETHER_ADDRESS, myAccount).call()));
			}
		}
		fetchData();
	}, [web3])

	return (
		<div className="card bg-dark text-white">
			<div className="card-header">
				Balance
            </div>
			<div className="card-body">
				<Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
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
							</tbody>
						</table>
					</Tab>
  					<Tab eventKey="withdraw" title="Withdraw">
					</Tab>
				</Tabs>
			</div>
		</div>
	)
}

export default Balance;