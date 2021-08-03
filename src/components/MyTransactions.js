import {useSelector} from 'react-redux';
import {Tab, Tabs, Button} from 'react-bootstrap';
import Web3 from 'web3';

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

function MyTransactions() {

	let filledOrders = useSelector(state => state.reducerExchange.filledOrders);
	let allOrders = useSelector(state => state.reducerExchange.allOrders);
	let cancelledOrders = useSelector(state => state.reducerExchange.cancelledOrders);
	const accounts = useSelector(state => state.reducerWeb3.accounts);
	const exchange = useSelector(state => state.reducerExchange.contract);

	const myAccount = accounts[0];

	let openedOrders = [];
	if (filledOrders !== undefined && allOrders !== undefined && cancelledOrders !== undefined) {

		filledOrders = filledOrders.filter(order => order._user === myAccount || order._userFill === myAccount)
		allOrders = allOrders.filter(order => order._user === myAccount || order._userFill === myAccount)
		cancelledOrders = cancelledOrders.filter(order => order._user === myAccount || order._userFill === myAccount)

		filledOrders = filledOrders.map(order => {
			const tokenAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGet : order._amountGive);
			const etherAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGive : order._amountGet);

			return (
				{
					id: order._id,
					time: new Date(order._timestamp * 1000).toLocaleString(),
					tokenAmount,
					tokenPrice: (etherAmount/tokenAmount).toFixed(6),
					type: order._tokenGive === ETHER_ADDRESS ? "buy" : "sell",
				}
			)
		})

		for (let i=0; i<allOrders.length; i++) {
			const order = allOrders[i];

			let isCancelledOrFilled = false;
			for (let j = 0; j < cancelledOrders.length; j++) {
				if (cancelledOrders[j]._id === order._id) {
					isCancelledOrFilled = true;
				}
			}
			for (let j = 0; j < filledOrders.length; j++) {
				if (filledOrders[j]._id === order._id) {
					isCancelledOrFilled = true;
				}
			}

			if (!isCancelledOrFilled) {
				const tokenAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGet : order._amountGive);
				const etherAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGive : order._amountGet);

				openedOrders.push(
					{
						id: order._id,
						time: new Date(order._timestamp * 1000).toLocaleString(),
						tokenAmount,
						tokenPrice: (etherAmount/tokenAmount).toFixed(6),
						type: order._tokenGive === ETHER_ADDRESS ? "buy" : "sell",
					}
				)
			}

		}
	} else {
		filledOrders = [];
		cancelledOrders = [];
		allOrders = [];
	}

	const cancelOrder = (e, id) => {
		console.log("cancel order", id)
		exchange.methods.cancelOrder(id).send({from: myAccount})
		.on("transactionHash", (hash) => {
			window.alert("cancel order initiated", hash)
		})
		.on("error", (error) => {
			console.log(error)
			window.alert("there was an error")
		})
	}


	return (
		<div className="card bg-dark text-white">
			<div className="card-header">
				My Transactions
            </div>
			<div className="card-body">
				<Tabs defaultActiveKey="trades" id="uncontrolled-tab-example" className="mb-3">
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
									filledOrders.map(order => {
										return (
											<tr key={order.id} className={order.type === "buy" ? "text-success" : "text-danger"}>
												<th scope="col">{order.time}</th>
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
									openedOrders.map(order => {
										return (
											<tr key={order.id} className={order.type === "buy" ? "text-success" : "text-danger"}>
												<th scope="col">{order.type === "buy" ? "+" : "-"}{order.tokenAmount}</th>
												<th scope="col">{order.tokenPrice}</th>
												<th scope="col"><Button onClick={(e) => cancelOrder(e,order.id)}>x</Button></th>
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