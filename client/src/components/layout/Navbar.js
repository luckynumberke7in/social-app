import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

// func arrow component destructuring {isAuth, loading, logout} in arg
const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
	const authLinks = (
		<ul>
			<li>
				{/* link to nowhere that logs user out */}
				<Link onClick={logout} to="#!">
					<i className="fas fa-sign-out-alt"></i>{' '}
					<span className="hide-sm">Logout</span>
				</Link>
			</li>
		</ul>
	);

	const guestLinks = (
		<ul>
			<li>
				<Link to="#!">Developers</Link>
			</li>
			<li>
				<Link to="/register">Register</Link>
			</li>
			<li>
				<Link to="/login">Login</Link>
			</li>
		</ul>
	);

	return (
		<nav className="navbar bg-dark">
			<h1>
				<Link to="/">
					<i className="fas fa-code"></i> Ke7in's Social App
				</Link>
			</h1>
			{
				// this code triggers when loading ends and updates navbar depending if user is logged in or not.
				!loading && (
					<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
				)
			}
		</nav>
	);
};

Navbar.propTypes = {
	logout: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
