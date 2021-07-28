import { connect } from 'react-redux';

function Navbar(props) {

	console.log("Navbar", props)

	return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#/">BTF Token Exchange</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a
              className="nav-link small"
              href={`https://etherscan.io/address/${props.accounts !== undefined ? props.accounts[0] : "0x0000000"}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              	{props.accounts !== undefined ? props.accounts[0] : "0x0000000"}
            </a>
          </li>
        </ul>
      </nav>
	)
}

function mapStateToProps(state) {
	console.log("mapStateToProps on Navbar", state.reducerWeb3)
	return {
		accounts: state.reducerWeb3.accounts
	}
}

export default connect(mapStateToProps)(Navbar);