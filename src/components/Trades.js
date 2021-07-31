import { useSelector } from 'react-redux';
import Web3 from 'web3';

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

function Trades(props) {

	const filledOrders = useSelector(state => state.reducerExchange.filledOrders);

	let filledOrdersFormated = [];

	if (filledOrders !== undefined) {

		for (let i = 0; i < filledOrders.length; i++) {
			let val = filledOrders[i].returnValues;
			filledOrdersFormated.push({
				time: new Date(val._timestamp * 1000).toLocaleString(),
				tokenAmount: Web3.utils.fromWei(val._tokenGive === ETHER_ADDRESS ? val._amountGet : val._amountGive, "ether"),
				ethAmount: Web3.utils.fromWei(val._tokenGive === ETHER_ADDRESS ? val._amountGive : val._amountGet),
			});
		}
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
							filledOrdersFormated.map((val,id) => {
								return (
									<tr key={id}>
										<td>{val.time}</td>
										<td>{val.tokenAmount}</td>
										<td>{(val.tokenAmount / val.ethAmount).toFixed(2)}</td>
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