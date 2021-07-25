import { combineReducers } from 'redux';

export const web3Loaded = (connection) => {
	return {
		type: 'WEB3_LOADED',
		connection
	}
}

function web3(state = {}, action) {
	switch (action.type) {
		case 'WEB3_LOADED':
			console.log("web3 reducer WEB3_LOADED called")
			return state;
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	web3,
});

export default rootReducer;