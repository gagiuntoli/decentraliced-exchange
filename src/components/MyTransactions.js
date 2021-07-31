import {useSelector} from 'react-redux';
import {Tab, Tabs} from 'react-bootstrap';
import Web3 from 'web3';

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

function MyTransactions() {

	let filledOrders = useSelector(state => state.reducerExchange.filledOrders);
	let allOrders = useSelector(state => state.reducerExchange.allOrders);
	let cancelledOrders = useSelector(state => state.reducerExchange.cancelledOrders);
	const accounts = useSelector(state => state.reducerWeb3.accounts);
	const myAccount = accounts[0];

	let filledOrdersFormated = [];
	let openedOrdersFormated = [];
	if (filledOrders !== undefined && allOrders !== undefined && cancelledOrders !== undefined) {

		filledOrders = filledOrders.filter(order => order.returnValues._user == myAccount || order.returnValues._userFill == myAccount)
		allOrders = allOrders.filter(order => order.returnValues._user == myAccount || order.returnValues._userFill == myAccount)
		cancelledOrders = cancelledOrders.filter(order => order.returnValues._user == myAccount || order.returnValues._userFill == myAccount)

		for (let i=0; i<filledOrders.length; i++) {
			const order = filledOrders[i].returnValues;

			const tokenAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGet : order._amountGive);
			const etherAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGive : order._amountGet);

			filledOrdersFormated.push(
				{
					time: order._timestamp,
					tokenAmount,
					tokenPrice: (etherAmount/tokenAmount).toFixed(2),
					type: order._tokenGive === ETHER_ADDRESS ? "buy" : "sell",
				}
			)
		}

		for (let i=0; i<allOrders.length; i++) {
			const order = allOrders[i].returnValues;

			let isCancelledOrFilled = false;
			for (let j = 0; j < cancelledOrders.length; j++) {
				if (cancelledOrders[j].returnValues._id == order._id) {
					isCancelledOrFilled = true;
				}
			}
			for (let j = 0; j < filledOrders.length; j++) {
				if (filledOrders[j].returnValues._id == order._id) {
					isCancelledOrFilled = true;
				}
			}

			if (!isCancelledOrFilled) {
				const tokenAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGet : order._amountGive);
				const etherAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGive : order._amountGet);

				openedOrdersFormated.push(
					{
						time: order._timestamp,
						tokenAmount,
						tokenPrice: (etherAmount/tokenAmount).toFixed(2),
						type: order._tokenGive === ETHER_ADDRESS ? "buy" : "sell",
					}
				)
			}

		}
	}


	return (
		<div className="card bg-dark text-white">
			<div className="card-header">
				My Transactions
            </div>
			<div className="card-body">
				<Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
  					<Tab eventKey="trades" title="Trades">
						<table className="table table-dark table-sm small">
							<thead>
								<tr>
									<th scope="col">Time</th>
									<th scope="col">BTF</th>
									<th scope="col">BTF/ETH</th>
								</tr>
							</thead>
							<tbody>
								{
									filledOrdersFormated.map((order, id) => {
										return (
											<tr key={id} className={order.type === "buy" ? "text-success" : "text-danger"}>
												<th scope="col">{new Date(order.time * 1000).toLocaleString()}</th>
												<th scope="col">{order.type === "buy" ? "+" : "-"}{order.tokenAmount}</th>
												<th scope="col">{order.tokenPrice}</th>
											</tr>
										)
									})
								}
							</tbody>
  						</table>
  					</Tab>
  					<Tab eventKey="orders" title="Orders">
						<table className="table table-dark table-sm small">
							<thead>
								<tr>
									<th scope="col">Amount</th>
									<th scope="col">BTF/ETH</th>
									<th scope="col">Cancel</th>
								</tr>
							</thead>
							<tbody>
								{
									openedOrdersFormated.map((order, id) => {
										return (
											<tr key={id} className={order.type === "buy" ? "text-success" : "text-danger"}>
												<th scope="col">{order.type === "buy" ? "+" : "-"}{order.tokenAmount}</th>
												<th scope="col">{order.tokenPrice}</th>
												<th scope="col">cancel</th>
											</tr>
										)
									})
								}
							</tbody>
  						</table>
  					</Tab>
				</Tabs>
			</div>
		</div>
	)
}

export default MyTransactions;