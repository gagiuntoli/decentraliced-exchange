
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Web3 from 'web3';

function Trades(props) {


	const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

	console.log("Trades props", props)
	const [filledOrdersFormated, setFilledOrdersFormated] = useState([]);

	useEffect(() => {
		if (props.filledOrders != undefined) {

			let filledOrdersFormated_ = [];
			for (let i = 0; i < props.filledOrders.length; i++) {
				let val = props.filledOrders[i].returnValues;
				filledOrdersFormated_.push({
					time: new Date(val._timestamp * 1000).toLocaleString(),
					tokenAmount: Web3.utils.fromWei(val._tokenGive == ETHER_ADDRESS ? val._amountGet : val._amountGive, "ether"),
					ethAmount: Web3.utils.fromWei(val._tokenGive == ETHER_ADDRESS ? val._amountGive : val._amountGet),
				});
			}
			setFilledOrdersFormated(filledOrdersFormated_);
		}
		console.log("Trades filled orders (useEffect)", filledOrdersFormated)

	}, [props.filledOrders])


		console.log("Trades filled orders", filledOrdersFormated)
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
								<th scope="col">BTX</th>
								<th scope="col">BTX/ETH</th>
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

function mapStateToProps(state) {
	return {
		filledOrders: state.reducerExchange.filledOrders,
	}
}

export default connect(mapStateToProps)(Trades);