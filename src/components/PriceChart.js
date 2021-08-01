import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { chartOptions, dummyData } from './PriceChart.config';
import Web3 from 'web3';

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

function PriceChart() {

	let filledOrders = useSelector(state => state.reducerExchange.filledOrders);
	let lastPriceShowed = <span className="text-mutted"> &nbsp; 0.0</span>
	let dataPlot = [{data: []}];

	if (filledOrders !== undefined) {
		filledOrders.sort((a,b) => a._timestamp - b._timestamp);
		filledOrders = filledOrders.map(order => {
			const tokenAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGet : order._amountGive);
			const etherAmount = Web3.utils.fromWei(order._tokenGive === ETHER_ADDRESS ? order._amountGive : order._amountGet);
			return (
				{
					time: order._timestamp,
					tokenAmount,
					etherAmount,
					tokenPrice: (etherAmount / tokenAmount).toFixed(6)
				}
			)
		});

		const lastPrice = filledOrders[filledOrders.length-1].tokenPrice;
		const preLastPrice = filledOrders[filledOrders.length-2].tokenPrice;
		if (lastPrice > preLastPrice) {
			lastPriceShowed = <span className="text-success">&#9650; {lastPrice}</span>
		} else {
			lastPriceShowed = <span className="text-danger">&#9660; {lastPrice}</span>
		}

		// Data format for the Candle Chart
		//export const dummyData = [
		//	{
		//		data: [
		//			{
		//				x: new Date(1538778600000),
		//				y: [6629.81, 6650.5, 6623.04, 6633.33]
		//			},
 		//   }
		//];

		let i = 0;
		while (i<filledOrders.length) {
			let order = filledOrders[i];
			const startTime = order.time;
			const openPrice = order.tokenPrice
			let maxPrice = openPrice;
			let minPrice = openPrice;
			while (i<filledOrders.length && (order.time - startTime < 3600 * 1000)) {
				maxPrice = (maxPrice < order.tokenPrice) ? order.tokenPrice : maxPrice;
				minPrice = (minPrice > order.tokenPrice) ? order.tokenPrice : minPrice;
				order = filledOrders[i];
				i+=1;
			}
			const closePrice = order.tokenPrice
			const plotPoint = {
				x: startTime * 1000,
				y: [openPrice, maxPrice, minPrice, closePrice]
			}
			dataPlot[0].data.push(plotPoint)
			i+=1;
		}
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
						series={dummyData} // dummyData
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