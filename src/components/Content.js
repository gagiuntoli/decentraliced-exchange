
import { connect, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import Trades from './Trades';
import {
	actionLoadCancelledOrders,
	actionLoadAllOrders,
	actionLoadFilledOrders
} from '../reducers';

function Content(props) {

	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			if (props.exchange != undefined) {
				const cancelledOrders = await props.exchange.getPastEvents('Cancel', {fromBlock: '0', toBlock: 'latest'});
				dispatch(actionLoadCancelledOrders(cancelledOrders));

				const filledOrders = await props.exchange.getPastEvents('Trade', {fromBlock: '0', toBlock: 'latest'});
				dispatch(actionLoadFilledOrders(filledOrders));

				const allOrders = await props.exchange.getPastEvents('Order', {fromBlock: '0', toBlock: 'latest'});
				dispatch(actionLoadAllOrders(allOrders));
			}
		}
		fetchData();

	}, [dispatch]);

	console.log("Content props:", props);

	return (
		<div className="content">
			<div className="vertical-split">
				<div className="card bg-dark text-white">
					<div className="card-header">
						Card Title
              </div>
					<div className="card-body">
						<p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
						<a href="/#" className="card-link">Card link</a>
					</div>
				</div>
				<div className="card bg-dark text-white">
					<div className="card-header">
						Card Title
              </div>
					<div className="card-body">
						<p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
						<a href="/#" className="card-link">Card link</a>
					</div>
				</div>
			</div>
			<div className="vertical">
				<div className="card bg-dark text-white">
					<div className="card-header">
						Card Title
              </div>
					<div className="card-body">
						<p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
						<a href="/#" className="card-link">Card link</a>
					</div>
				</div>
			</div>
			<div className="vertical-split">
				<div className="card bg-dark text-white">
					<div className="card-header">
						Card Title
              </div>
					<div className="card-body">
						<p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
						<a href="/#" className="card-link">Card link</a>
					</div>
				</div>
				<div className="card bg-dark text-white">
					<div className="card-header">
						Card Title
              </div>
					<div className="card-body">
						<p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
						<a href="/#" className="card-link">Card link</a>
					</div>
				</div>
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