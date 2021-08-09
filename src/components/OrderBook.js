import { useSelector } from 'react-redux';
import Web3 from 'web3';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

function OrderBook() {

	let allOrders = useSelector(state => state.reducerExchange.allOrders)
	let cancelledOrders = useSelector(state => state.reducerExchange.cancelledOrders)
	let filledOrders = useSelector(state => state.reducerExchange.filledOrders)
	let openOrders = useSelector(state => state.reducerExchange.openOrders)
	const accounts = useSelector(state => state.reducerWeb3.accounts);
	const exchange = useSelector(state => state.reducerExchange.contract);
	const myAccount = accounts[0];

	let buyOrders = [];
	let sellOrders = [];

	if (allOrders !== undefined && cancelledOrders !== undefined && filledOrders !== undefined && openOrders !== undefined) {

		for (let i = 0; i < openOrders.length; i++) {
			let order = openOrders[i]
			const tokenAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGet : order._amountGive, "ether");
			const etherAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGive : order._amountGet, "ether");
			const tokenPrice = (etherAmount/tokenAmount).toFixed(6);

			if (order._tokenGive === ETHER_ADDRESS) {
				buyOrders.push({
					id: order._id,
					time: new Date(order._timestamp * 1000).toLocaleString(),
					tokenAmount,
					etherAmount,
					tokenPrice,
				});
			} else {
				sellOrders.push({
					id: order._id,
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

	const fillOrder = async (event, orderId) => {
		event.preventDefault();
		await exchange.methods.fillOrder(orderId).send({ from: myAccount });
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
									<tr key={id} className="order-book-order text-danger">
										<td>{order.tokenAmount}</td>
										<td>{order.tokenPrice}</td>
										<td>{order.etherAmount}</td>
										<OverlayTrigger
											placement="auto"
											key={order.id}
											overlay={<Tooltip>Click here to buy</Tooltip>}
										>
										<td>
											<button
												type="submit"
												className="btn btn-primary btn-block btn-sm bg-success"
												onClick={(e) => fillOrder(e, order.id)}
											>&#10004;</button>
										</td>
										</OverlayTrigger>
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
							buyOrders.map(order => {
								return (
										<tr className="order-book-order text-success" key={order.id}>
											<td>{order.tokenAmount}</td>
											<td>{order.tokenPrice}</td>
											<td>{order.etherAmount}</td>
											<OverlayTrigger
												placement="auto"
												key={order.id}
												overlay={<Tooltip>Click here to sell</Tooltip>}
											>
											<td>
												<button 
												type="submit"
												className="btn btn-primary btn-block btn-sm bg-danger"
												onClick={(e) => fillOrder(e, order.id)}
												>&#10004;</button>
											</td>
											</OverlayTrigger>
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