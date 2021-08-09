import { useSelector } from 'react-redux';
import Web3 from 'web3';

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

function Trades() {

	let filledOrders = useSelector(state => state.reducerExchange.filledOrders);

	if (filledOrders !== undefined) {
		filledOrders = filledOrders.sort((a,b) => a._timestamp - b._timestamp);
		filledOrders = filledOrders.map(order => {
			const tokenAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGet : order._amountGive);
			const etherAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGive : order._amountGet);
			return(
				{
					time: new Date(order._timestamp * 1000).toLocaleString(),
					tokenAmount,
					etherAmount,
					tokenPrice: (etherAmount / tokenAmount).toFixed(6),
					type: (order._tokenGive === ETHER_ADDRESS) ? "buy" : "sell"
				}
			)
		});
	} else {
		filledOrders = []
	}

	return (
		<div className="vertical">
			<div className="card bg-dark text-white">
				<div className="card-header">
					Trades
                </div>
				<div className="card-body">
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
							filledOrders.map((order,id) => {
								return (
									<tr key={id} className={order.type === "buy" ? "text-success" : "text-danger"}>
										<td>{order.time}</td>
										<td>{order.tokenAmount}</td>
										<td>{order.tokenPrice}</td>
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

export default Trades;