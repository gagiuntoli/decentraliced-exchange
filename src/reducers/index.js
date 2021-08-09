import { combineReducers } from 'redux';

// actions
export const actionLoadWeb3 = (web3) => {
	return {
		type: 'WEB3_LOAD',
		payload: { web3 }
	}
}

export const actionLoadAccounts = (accounts) => {
	return {
		type: 'WEB3_LOAD_ACCOUNT',
		payload: { accounts }
	}
}

export const actionLoadToken = (contract) => {
	return {
		type: 'TOKEN_LOAD',
		payload: { contract }
	}
}

export const actionLoadExchange= (contract) => {
	return {
		type: 'EXCHANGE_LOAD',
		payload: { contract }
	}
}

export const actionLoadCancelledOrders = (cancelledOrders) => {
	return {
		type: 'CANCELLED_ORDERS_LOAD',
		payload: { cancelledOrders }
	}
}

export const actionLoadAllOrders = (allOrders) => {
	return {
		type: 'ALL_ORDERS_LOAD',
		payload: { allOrders }
	}
}

export const actionLoadFilledOrders = (filledOrders) => {
	return {
		type: 'FILLED_ORDERS_LOAD',
		payload: { filledOrders }
	}
}

export const actionLoadOpenOrders = (openOrders) => {
	return {
		type: 'OPEN_ORDERS_LOAD',
		payload: { openOrders }
	}
}

// reducers
function reducerWeb3(state = {}, action) {
	switch (action.type) {
		case 'WEB3_LOAD':
			return {
				...state,
				web3: action.payload.web3
			};
		case 'WEB3_LOAD_ACCOUNT':
			return {
				...state,
				accounts: action.payload.accounts
			};
		default:
			return state;
	}
}

function reducerToken(state = {}, action) {
	switch (action.type) {
		case 'TOKEN_LOAD':
			return {
				...state,
				contract: action.payload.contract
			};
		default:
			return state;
	}
}

function reducerExchange(state = {}, action) {
	switch (action.type) {
		case 'EXCHANGE_LOAD':
			return {
				...state,
				contract: action.payload.contract
			};
		case 'CANCELLED_ORDERS_LOAD':
			return {
				...state,
				cancelledOrders: action.payload.cancelledOrders
			};
		case 'ALL_ORDERS_LOAD':
			return {
				...state,
				allOrders: action.payload.allOrders
			};
		case 'FILLED_ORDERS_LOAD':
			return {
				...state,
				filledOrders: action.payload.filledOrders
			};
		case 'OPEN_ORDERS_LOAD':
			return {
				...state,
				openOrders: action.payload.openOrders
			};
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	reducerWeb3,
	reducerToken,
	reducerExchange,
});

export default rootReducer;