import './App.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

function App() {

  const dispatch = useDispatch();
	const exchange = useSelector(state => state.reducerExchange.contract);
	const token = useSelector(state => state.reducerToken.contract);

  useEffect(() => {

    const loadBlockchainData = async () => {

      if (window.ethereum) {
          await window.ethereum.send('eth_requestAccounts');
          window.web3 = new Web3(window.ethereum);
      }
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
        exchange !== undefined && token !== undefined ?
          <Content /> :
          <div className="content"></div>
      }
    </div>
  );
}

export default App;
