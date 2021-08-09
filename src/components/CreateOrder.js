import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs } from 'react-bootstrap';
import Web3 from 'web3';

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

function CreateOrder() {

	const [buyAmount, setBuyAmount] = useState(0);
	const [buyPrice, setBuyPrice] = useState(0);
	const [sellAmount, setSellAmount] = useState(0);
	const [sellPrice, setSellPrice] = useState(0);
	const accounts = useSelector(state => state.reducerWeb3.accounts);
	const myAccount = accounts[0];
	const exchange = useSelector(state => state.reducerExchange.contract);
	const token = useSelector(state => state.reducerToken.contract);

	return (
		<div className="card bg-dark text-white">
			<div className="card-header">
				Create Order
            </div>
			<div className="card-body">
				<Tabs defaultActiveKey="buy" id="uncontrolled-tab-example" className="mb-3" >
  					<Tab eventKey="buy" title="Buy">
						<form className="row" onSubmit={async (e) => {
							e.preventDefault();
							await exchange.methods.makeOrder(
								token._address,
								Web3.utils.toWei(buyAmount.toString()),
								ETHER_ADDRESS,
								Web3.utils.toWei((buyAmount * buyPrice).toString()),
								).send({from: myAccount});
						}}>
							<div className="col-12 col-sm pr-sm-2">
								<h6>BTF Amount</h6>
								<input
									type="text"
									placeholder="BTF Amount"
									onChange={e => setBuyAmount(e.target.value)}
									className="form-control form-control-sm bg-dark text-white"
									required />
								<br />
								<h6>BTF Buy Price (ETH/BTF)</h6>
								<input
									type="text"
									placeholder="BTF Price (BTF/ETH)"
									onChange={e => setBuyPrice(e.target.value)}
									className="form-control form-control-sm bg-dark text-white"
									required />
								<br />
								<button type="submit" className="btn btn-primary btn-block btn-sm">Buy</button>
								<br />
								<small>Total: {(buyAmount * buyPrice).toFixed(6)} ETH</small>
							</div>
						</form>
					</Tab>
  					<Tab eventKey="sell" title="Sell">
						<form className="row" onSubmit={async (e) => {
							e.preventDefault();
							await exchange.methods.makeOrder(
								ETHER_ADDRESS,
								Web3.utils.toWei((sellAmount * sellPrice).toString()),
								token._address,
								Web3.utils.toWei(sellAmount.toString())
							).send({from: myAccount});
						}}>
							<div className="col-12 col-sm pr-sm-2">
								<h6>BTF Amount</h6>
								<input
									type="text"
									placeholder="BTF Amount"
									onChange={e => setSellAmount(e.target.value)}
									className="form-control form-control-sm bg-dark text-white"
									required />
								<br />
								<h6>BTF Sell Price (ETH/BTF)</h6>
								<input
									type="text"
									placeholder="BTF Price (BTF/ETH)"
									onChange={e => setSellPrice(e.target.value)}
									className="form-control form-control-sm bg-dark text-white"
									required />
								<br />
								<button type="submit" className="btn btn-primary btn-block btn-sm">Sell</button>
								<br />
								<small>Total: {(sellAmount * sellPrice).toFixed(6)} ETH</small>
							</div>
						</form>
					</Tab>
				</Tabs>
			</div>
		</div>
	)
}

export default CreateOrder;