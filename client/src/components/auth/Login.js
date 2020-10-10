import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

// add / destructure login as prop in Login arguments
const Login = ({ login, isAuthenticated }) => {
  // sets default state for fields inside useState(), connects user input
  const [formData, setFormDate] = useState({
    email: '',
    password: '',
  });
  // destructure for readability
  const { email, password } = formData;

  // update state for text field when user types
  const onChange = (e) =>
    setFormDate({ ...formData, [e.target.name]: e.target.value });

  // click / submit event handler to login
  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  // redirect to user page if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <section className="container">
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Sign Into Your Account
        </p>
        <form className="form" onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              minLength="8"
              value={password}
              onChange={(e) => onChange(e)}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </section>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
// use connect w/ no initial state and pass in { props } and (visual component)
export default connect(mapStateToProps, { login })(Login);
