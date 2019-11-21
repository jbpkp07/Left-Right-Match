// dependencies
import React from 'react'
// import axios from 'axios'
import "./SignUpForm.css"

function SignUp(props) {

  // Define the form submission handler, to be used in the `onSubmit` event
  const handleLoginFormSubmit = (evt) => {
    evt.preventDefault();
    console.log("signup.js handleSubmit evt ", evt)
  }

  return (
    <div className="signUpForm">

      <div className="row">
        <div className="col-md-6 mx-auto">
          <h1>Sign Up</h1>
        </div>
      </div>

      <form onSubmit={handleLoginFormSubmit}>
        <div className="row ">
          <div className="col-md-6 mx-auto">
            <div className="form-group">
              <label htmlFor="firstNameInput">
                First Name
              </label>
              <input
                type="text"
                id="firstNameInput"
                name="firstName"
                className="form-control"
              // onChange={evt => setFirstName(evt.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="form-group">
              <label htmlFor="lastNameInput">
                Last Name
              </label>
              <input
                type="text"
                id="lastNameInput"
                name="lastName"
                className="form-control"
              // onChange={evt => setLastName(evt.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="form-group">
              <label htmlFor="emailInput">
                Email
              </label>
              <input
                type="email"
                id="emailInput"
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
              <label htmlFor="passwordInput">
                Password
              </label>
              <input
                type="current-password"
                id="passwordInput"
                className="form-control"
                name="password"
              // onChange={evt => setPassword(evt.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <button type="submit">Sign Up</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignUp;