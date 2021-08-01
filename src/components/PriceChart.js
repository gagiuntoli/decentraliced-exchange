import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { chartOptions, dummyData } from './PriceChart.config';
import Web3 from 'web3';

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

function PriceChart() {

	let filledOrders = useSelector(state => state.reducerExchange.filledOrders);
	let lastPriceShowed = <span className="text-mutted"> &nbsp; 0.0</span>

	if (filledOrders !== undefined) {
		filledOrders = filledOrders.map(order => order.returnValues);
		filledOrders.sort((a,b) => a._timestamp - b._timestamp);
		filledOrders = filledOrders.map(order => {
			const tokenAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGet : order._amountGive);
			const etherAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGive : order._amountGet);
			return (
				{
					time: new Date(order._timestamp * 1000).toLocaleString(),
					tokenAmount,
					etherAmount,
					priceToken: (etherAmount / tokenAmount).toFixed(6)
				}
			)
		});

		const lastPrice = filledOrders[filledOrders.length-1].priceToken;
		const preLastPrice = filledOrders[filledOrders.length-2].priceToken;
		if (lastPrice > preLastPrice) {
			lastPriceShowed = <span className="text-success">&#9650; {lastPrice}</span>
		} else {
			lastPriceShowed = <span className="text-danger">&#9660; {lastPrice}</span>
		}

		let filledOrdersFormatted;
	}

	return (
		<div className="card bg-dark text-white">
			<div className="card-header">
				<h4>BTF/ETH &nbsp; {lastPriceShowed}</h4>
            </div>
			<div className="card-body">
				<div className="price-chart">
					<Chart
						options={chartOptions}
						series={dummyData}
						type="candlestick"
						width="100%"
						height="100%"
					/>
				</div>
			</div>
		</div>
	)
}

export default PriceChart;