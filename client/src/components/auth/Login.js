import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  // sets default state for fields inside useState(), connects user input
  const [formData, setFormDate] = useState({
    email: '',
    password: '',
  });
  // destructure for readability
  const { email, password } = formData;

  // create universal event handler updating state for text fields
  const onChange = (e) =>
    setFormDate({ ...formData, [e.target.name]: e.target.value });

  // click / submit event handler
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Success');
  };

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

export default Login;
