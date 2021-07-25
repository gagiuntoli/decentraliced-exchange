import './App.css';
import { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';

import {
  actionLoadWeb3,
  actionLoadAccounts,
  actionLoadToken,
  actionLoadExchange,
} from '../reducers';

function App(props) {

  const dispatch = useDispatch();
  const [accounts_, setAccounts] = useState([])
  const [web3_, setWeb3] = useState(undefined)

  useEffect(() => {

    const loadBlockchainData = async () => {

      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

      dispatch(actionLoadWeb3(web3)); // we load into web3 connection into the store
      setWeb3(web3);

      const network = await web3.eth.net.getNetworkType();
      const networkId = await web3.eth.net.getId();
      const accounts = await web3.eth.getAccounts();
      dispatch(actionLoadAccounts(accounts));
      setAccounts(accounts)

      const tokenAbi = Token.abi;
      const tokenNetworks = Token.networks;
      console.log(Web3.givenProvider)
      console.log("network", network)
      console.log("network ID", networkId)
      console.log("accounts", accounts)
      console.log("token networks", tokenNetworks)
      const tokenAddress = tokenNetworks[networkId].address;

      let token;
      try {
        token = new web3.eth.Contract(tokenAbi, tokenAddress);
        dispatch(actionLoadToken(token));
      } catch (error) {
        window.alert("Contract `Token` not deployed to the current network");
      }

      const totalSupply = await token.methods.totalSupply().call();

      let exchange;
      try {
        exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address);
        dispatch(actionLoadToken(exchange));
      } catch (error) {
        window.alert("Contract `Exchange` not deployed to the current network");
      }
      console.log("Total supply:", totalSupply);
    }

    loadBlockchainData();
  }, [dispatch]);


  console.log("App props:", props)
  console.log("App accounts_:", accounts_)
  console.log("App web3_:", web3_)
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="/#">Navbar</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/#">Link 1</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#">Link 2</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#">Link 3</a>
            </li>
          </ul>
        </div>
      </nav>
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
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  console.log("mapStateToProps", state)
  return {
    web3: state.web3,
    accounts: state.accounts
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
