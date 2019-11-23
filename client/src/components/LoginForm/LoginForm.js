import React from 'react'
import "./LoginForm.css"
import API from "../../utils/API";

class Login extends React.Component {

    constructor(props) {
        
        super(props);

        this.state = {
            email: "",
            password: ""
        };
    }

    handleSearchInputChange = (event) => {

        const name = event.target.name;
        const value = event.target.value;

        const newState = {

            [name]: value
        };

        this.setState(newState);
    }

    handleSubmit = (event) => {

        if (this.state.email.length !== 0 && this.state.password.length >= 8) {

            event.preventDefault();

            API.login(this.state)

                .then((result) => {

                    const clearState = {

                        email: "",
                        password: ""
                    };

                    this.setState(clearState, () => {
                        
                        setTimeout(() => {
                            
                            this.props.history.push(`/userprofile/${result.data.userId}`);

                        }, 1000);
                    });
                })
                .catch((err) => {

                    alert("Credentials not valid, try again...");
                    console.log(err);
                });
        }
    }

    render() {

        return (
            <div className="loginForm">
    
                <div className="row">
                    <div className="col-md-6 mx-auto">
                        <h1>Login</h1>
                    </div>
                </div>
    
                <form>
                    <div className="row">
                        <div className="col-md-6 mx-auto">
                            <div className="form-group2">
                                <label htmlFor="emailLoginInput">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="emailInput"
                                    name="email"
                                    className="form-control"
                                    spellCheck={false}
                                    autoComplete="off"
                                    required={true}
                                    autoFocus={true}
                                    value={this.state.email}
                                    onChange={this.handleSearchInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mx-auto">
                            <div className="form-group2">
                                <label htmlFor="passwordLoginInput">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="passwordInput"
                                    className="form-control"
                                    name="password"
                                    spellCheck={false}
                                    autoComplete="off"
                                    minLength={8}
                                    required={true}
                                    value={this.state.password}
                                    onChange={this.handleSearchInputChange}
                                />
                            </div>
                        </div>
                    </div>
    
                    <div className="row">
                        <div className="col">
                            <button type="submit" onClick={this.handleSubmit}>Login</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;