// dependencies
import React from 'react'
// import axios from 'axios'
import "./LoginForm.css"

function Login(props) {

  // Define the form submission handler, to be used in the `onSubmit` event
  const handleLoginFormSubmit = (evt) => {
    evt.preventDefault();
    console.log("login.js handleSubmit")
  }

  return (
    <div className="loginForm">

      <div className="row">
        <div className="col-md-6 mx-auto">
          <h1>Login</h1>
        </div>
      </div>

      <form onSubmit={handleLoginFormSubmit}>
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="form-group">
              <label htmlFor="emailLoginInput">
                Email
                </label>
              <input
                type="email"
                id="emailLoginInput"
                name="email"
                className="form-control"
              // onChange={evt => setEmail(evt.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="form-group">
              <label htmlFor="passwordLoginInput">
                Password
                </label>
              <input
                type="current-password"
                id="passwordLoginInput"
                className="form-control"
                name="password"
              // onChange={evt => setPassword(evt.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <button type="submit">Login</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;