
import { useSelector } from 'react-redux';
import Web3 from 'web3';

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

function OrderBook(props) {

	const allOrders = useSelector(state => state.reducerExchange.allOrders)
	console.log("All Orders", allOrders)

	const availableOrders = allOrders; // TODO

	let buyOrders = [];  // GREEN
	let sellOrders = []; // RED

	if (availableOrders != undefined) {
		for (let i = 0; i < availableOrders.length; i++) {
			let val = availableOrders[i].returnValues;
			if (val._tokenGive === ETHER_ADDRESS) {
				buyOrders.push({
					time: new Date(val._timestamp * 1000).toLocaleString(),
					tokenAmount: Web3.utils.fromWei(val._tokenGive === ETHER_ADDRESS ? val._amountGet : val._amountGive, "ether"),
					etherAmount: Web3.utils.fromWei(val._tokenGive === ETHER_ADDRESS ? val._amountGive : val._amountGet, "ether"),
				});
			} else {
				sellOrders.push({
					time: new Date(val._timestamp * 1000).toLocaleString(),
					tokenAmount: Web3.utils.fromWei(val._tokenGive === ETHER_ADDRESS ? val._amountGet : val._amountGive, "ether"),
					etherAmount: Web3.utils.fromWei(val._tokenGive === ETHER_ADDRESS ? val._amountGive : val._amountGet, "ether"),
				});
			}
		}
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
							buyOrders.map((val,id) => {
								return (
									<tr key={id} className="text-success">
										<td>{val.tokenAmount}</td>
										<td>{(val.tokenAmount / val.etherAmount).toFixed(2)}</td>
										<td>{val.etherAmount}</td>
									</tr>
								)
							})
							}
							<tr>
								<th scope="col">BTX</th>
								<th scope="col">BTX/ETH</th>
								<th scope="col">ETH</th>
							</tr>
							{
							sellOrders.map((val,id) => {
								return (
									<tr key={id} className="text-danger">
										<td>{val.tokenAmount}</td>
										<td>{(val.tokenAmount / val.etherAmount).toFixed(2)}</td>
										<td>{val.etherAmount}</td>
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