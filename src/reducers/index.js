import { combineReducers } from 'redux';

// actions
export const actionLoadWeb3 = (web3) => {
	console.log("action LoadWeb3 executed");
	return {
		type: 'WEB3_LOAD',
		payload: { web3 }
	}
}

export const actionLoadAccounts = (accounts) => {
	console.log("action LoadAccount executed");
	return {
		type: 'WEB3_LOAD_ACCOUNT',
		payload: { accounts }
	}
}

export const actionLoadToken = (contract) => {
	console.log("action LoadToken executed");
	return {
		type: 'TOKEN_LOAD',
		payload: { contract }
	}
}

export const actionLoadExchange= (contract) => {
	console.log("action LoadExchange executed");
	return {
		type: 'EXCHANGE_LOAD',
		payload: { contract }
	}
}

// reducers
function reducerWeb3(state = {}, action) {
	switch (action.type) {
		case 'WEB3_LOAD':
			console.log("reducer reducerWeb3 WEB3_LOAD called")
			return {
				...state,
				web3: action.payload.web3
			};
		case 'WEB3_LOAD_ACCOUNT':
			console.log("reducer reducerWeb3 WEB3_LOAD_ACCOUNT called",action.payload.accounts)
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
			console.log("reducer reducerToken TOKEN_LOAD called")
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
			console.log("reducer reducerExchange EXCHANGE_LOAD called")
			return {
				...state,
				contract: action.payload.contract
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