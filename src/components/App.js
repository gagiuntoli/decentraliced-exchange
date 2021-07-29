import './App.css';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';
import Navbar from './Navbar';
import Content from './Content';

import {
  actionLoadWeb3,
  actionLoadAccounts,
  actionLoadToken,
  actionLoadExchange,
} from '../reducers';

function App(props) {

  const dispatch = useDispatch();

  useEffect(() => {

    const loadBlockchainData = async () => {

      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      dispatch(actionLoadWeb3(web3)); // we load into web3 connection into the store

      const networkId = await web3.eth.net.getId();
      const accounts = await web3.eth.getAccounts();
      dispatch(actionLoadAccounts(accounts));

      let token;
      try {
        token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address);
        dispatch(actionLoadToken(token));
      } catch (error) {
        window.alert("Contract `Token` not deployed on the current network");
      }

      let exchange;
      try {
        exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address);
        dispatch(actionLoadExchange(exchange));
      } catch (error) {
        window.alert("Contract `Exchange` not deployed on the current network");
      }


    }

    loadBlockchainData();
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      {
        props.exchange !== undefined && props.token !== undefined ?
          <Content /> :
          <div className="content"></div>
      }
    </div>
  );
}

function mapStateToProps(state) {
  return {
    web3: state.reducerWeb3.web3,
    accounts: state.reducerWeb3.accounts,
    token: state.reducerToken.contract,
    exchange: state.reducerExchange.contract,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actionLoadWeb3: (web3) => dispatch(actionLoadWeb3(web3)),
    actionLoadAccounts: (accounts) => dispatch(actionLoadAccounts(accounts)),
    actionLoadToken: (contract) => dispatch(actionLoadToken(contract)),
    actionLoadExchange: (contract) => dispatch(actionLoadExchange(contract)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
