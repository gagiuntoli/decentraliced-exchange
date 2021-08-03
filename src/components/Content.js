
import { connect, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Trades from './Trades';
import {
	actionLoadCancelledOrders,
	actionLoadAllOrders,
	actionLoadFilledOrders
} from '../reducers';
import OrderBook from './OrderBook';
import MyTransactions from './MyTransactions';
import PriceChart from './PriceChart';
import Balance from './Balance';
import CreateOrder from './CreateOrder';

function Content(props) {

	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			if (props.exchange !== undefined) {
				let cancelledOrders = await props.exchange.getPastEvents('Cancel', {fromBlock: '0', toBlock: 'latest'});
				cancelledOrders = cancelledOrders.map(order => order.returnValues);
				dispatch(actionLoadCancelledOrders(cancelledOrders));

				let filledOrders = await props.exchange.getPastEvents('Trade', {fromBlock: '0', toBlock: 'latest'});
				filledOrders = filledOrders.map(order => order.returnValues);
				dispatch(actionLoadFilledOrders(filledOrders));

				let allOrders = await props.exchange.getPastEvents('Order', {fromBlock: '0', toBlock: 'latest'});
				allOrders = allOrders.map(order => order.returnValues);
				dispatch(actionLoadAllOrders(allOrders));
			}
		}
		fetchData();

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

function mapStateToProps(state) {
	return {
		exchange: state.reducerExchange.contract,
		cancelledOrders: state.reducerExchange.cancelledOrders,
		allOrder: state.reducerExchange.allOrders,
		filledOrders: state.reducerExchange.filledOrders,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actionLoadCancelledOrders: (cancelledOrders) => dispatch(actionLoadCancelledOrders(cancelledOrders)),
		actionLoadAllOrders: (orders) => dispatch(actionLoadAllOrders(orders)),
		actionLoadFilledOrders: (filledOrders) => dispatch(actionLoadFilledOrders(filledOrders)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);