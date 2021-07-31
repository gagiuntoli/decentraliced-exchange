import { useSelector } from 'react-redux';
import Web3 from 'web3';

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

function OrderBook(props) {

	const allOrders = useSelector(state => state.reducerExchange.allOrders)
	const cancelledOrders = useSelector(state => state.reducerExchange.cancelledOrders)
	const filledOrders = useSelector(state => state.reducerExchange.filledOrders)

	let buyOrders = [];
	let sellOrders = [];

	if (allOrders !== undefined && cancelledOrders !== undefined && filledOrders !== undefined) {

		let availableOrders = []; 
		for (let i = 0; i < allOrders.length; i++) {
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
				availableOrders.push(order)
			}
		}


		for (let i = 0; i < availableOrders.length; i++) {
			let order = availableOrders[i]
			if (order._tokenGive === ETHER_ADDRESS) {
				buyOrders.push({
					time: new Date(order._timestamp * 1000).toLocaleString(),
					tokenAmount: Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGet : order._amountGive, "ether"),
					etherAmount: Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGive : order._amountGet, "ether"),
				});
			} else {
				sellOrders.push({
					time: new Date(order._timestamp * 1000).toLocaleString(),
					tokenAmount: Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGet : order._amountGive, "ether"),
					etherAmount: Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGive : order._amountGet, "ether"),
				});
			}
		}
		buyOrders.sort((a,b) => (a.etherAmount / a.tokenAmount) - (b.etherAmount / b.tokenAmount))
		sellOrders.sort((a,b) => (a.etherAmount / a.tokenAmount) - (b.etherAmount / b.tokenAmount))
	}

	return (
		<div className="vertical">
			<div className="card bg-dark text-white">
				<div className="card-header">
					Order Book
              	</div>
				<div className="card-body">
					<table className="table table-dark table-sm small">
						<tbody>
							{
							sellOrders.map((order,id) => {
								return (
									<tr key={id} className="text-danger">
										<td>{order.tokenAmount}</td>
										<td>{(order.tokenAmount / order.etherAmount).toFixed(2)}</td>
										<td>{order.etherAmount}</td>
									</tr>
								)
							})
							}
							<tr>
								<th scope="col">BTF</th>
								<th scope="col">BTF/ETH</th>
								<th scope="col">ETH</th>
							</tr>
							{
							buyOrders.map((order,id) => {
								return (
									<tr key={id} className="text-success">
										<td>{order.tokenAmount}</td>
										<td>{(order.tokenAmount / order.etherAmount).toFixed(2)}</td>
										<td>{order.etherAmount}</td>
									</tr>
								)
							})
							}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default OrderBook;