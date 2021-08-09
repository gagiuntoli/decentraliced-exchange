
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Trades from './Trades';

import {
	actionLoadCancelledOrders,
	actionLoadAllOrders,
	actionLoadFilledOrders,
	actionLoadOpenOrders
} from '../reducers';

import OrderBook from './OrderBook';
import MyTransactions from './MyTransactions';
import PriceChart from './PriceChart';
import Balance from './Balance';
import CreateOrder from './CreateOrder';

function Content() {

	const dispatch = useDispatch();

	const exchange = useSelector(state => state.reducerExchange.contract);

	let options = {
		filter: {
			value: [],
		},
		fromBlock: 0,
	};

	const fetchData = async () => {
		if (exchange !== undefined) {
			let cancelledOrders = await exchange.getPastEvents('Cancel', options);
			cancelledOrders = cancelledOrders.map(order => order.returnValues);
			dispatch(actionLoadCancelledOrders(cancelledOrders));

			let filledOrders = await exchange.getPastEvents('Trade', options);
			filledOrders = filledOrders.map(order => order.returnValues);
			dispatch(actionLoadFilledOrders(filledOrders));

			let allOrders = await exchange.getPastEvents('Order', options);
			allOrders = allOrders.map(order => order.returnValues);
			dispatch(actionLoadAllOrders(allOrders));

			let openOrders = allOrders.filter(order => 
				!cancelledOrders.find(element => element._id === order._id) && 
				!filledOrders.find(element => element._id === order._id)
			);
			dispatch(actionLoadOpenOrders(openOrders));
		}
	}

	useEffect(() => {
		fetchData();

		exchange.events.Trade(options)
			.on('data', () => {
				fetchData();
			});

		exchange.events.Order(options)
			.on('data', () => {
				fetchData();
			});

		exchange.events.Cancel(options)
			.on('data', () => {
				fetchData();
			});

	}, [dispatch]);


	return (
		<div className="content">
			<div className="vertical-split">
				<Balance />
				<CreateOrder />
			</div>
			<OrderBook />
			<div className="vertical-split">
				<PriceChart />
				<MyTransactions />
			</div>
			<Trades />
		</div>
	)
}

export default Content;