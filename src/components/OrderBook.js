import { useSelector } from 'react-redux';
import Web3 from 'web3';

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

function OrderBook(props) {

	let allOrders = useSelector(state => state.reducerExchange.allOrders)
	let cancelledOrders = useSelector(state => state.reducerExchange.cancelledOrders)
	let filledOrders = useSelector(state => state.reducerExchange.filledOrders)

	let buyOrders = [];
	let sellOrders = [];

	if (allOrders !== undefined && cancelledOrders !== undefined && filledOrders !== undefined) {

		let openedOrders = []; 
		for (let i = 0; i < allOrders.length; i++) {
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
				openedOrders.push(order)
			}
		}

		for (let i = 0; i < openedOrders.length; i++) {
			let order = openedOrders[i]
			const tokenAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGet : order._amountGive, "ether");
			const etherAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGive : order._amountGet, "ether");
			const tokenPrice = (etherAmount/tokenAmount).toFixed(6);

			if (order._tokenGive === ETHER_ADDRESS) {
				buyOrders.push({
					time: new Date(order._timestamp * 1000).toLocaleString(),
					tokenAmount,
					etherAmount,
					tokenPrice,
				});
			} else {
				sellOrders.push({
					time: new Date(order._timestamp * 1000).toLocaleString(),
					tokenAmount,
					etherAmount,
					tokenPrice,
				});
			}
		}
		buyOrders.sort((a,b) => b.tokenPrice - a.tokenPrice);
		sellOrders.sort((a,b) => b.tokenPrice - a.tokenPrice)
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
										<td>{order.tokenPrice}</td>
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
										<td>{order.tokenPrice}</td>
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