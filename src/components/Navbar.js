import { useSelector } from 'react-redux';

function Navbar() {

  const accounts = useSelector(state => state.reducerWeb3.accounts);
  let myAccount = accounts !== undefined && accounts.length !== 0 ? accounts[0] : "0x0000";

	return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#/">BTF/ETH Exchange</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a
              className="nav-link small"
              href={`https://etherscan.io/address/${myAccount}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              	{myAccount}
            </a>
          </li>
        </ul>
      </nav>
	)
}

export default Navbar;