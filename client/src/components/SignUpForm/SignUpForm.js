import React from 'react'
import "./SignUpForm.css"
import API from "../../utils/API";

class SignUp extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            name: "",
            email: "",
            password: ""
        };
    }

    handleInputChange = (event) => {

        const name = event.target.name;
        const value = event.target.value;

        const newState = {

            [name]: value
        };

        this.setState(newState);
    }

    handleSubmit = (event) => {

        if (this.state.name.length !== 0 && this.state.email.length !== 0 && this.state.password.length >= 8) {

            event.preventDefault();

            API.signup(this.state)

                .then((result) => {

                    console.log(result.data);

                    const clearState = {

                        name: "",
                        email: "",
                        password: ""
                    };

                    this.setState(clearState, () => {
                        
                        setTimeout(() => {
                            
                            this.props.history.push("/quiz");

                        }, 1000);
                    });
                })
                .catch((err) => {
                    
                    console.log(err);
                });
        }
    }

    render() {

        return (

            <div className="signUpForm">

                <div className="row">
                    <div className="col-md-6 mx-auto">
                        <h1>Sign Up</h1>
                    </div>
                </div>

                <form>
                    <div className="row">
                        <div className="col-md-6 mx-auto">
                            <div className="form-group2">
                                <label htmlFor="nameInput">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="nameInput"
                                    name="name"
                                    className="form-control"
                                    spellCheck={false}
                                    autoComplete="off"
                                    required={true}
                                    autoFocus={true}
                                    value={this.state.name}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mx-auto">
                            <div className="form-group2">
                                <label htmlFor="emailInput">
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
                                    value={this.state.email}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mx-auto">
                            <div className="form-group2">
                                <label htmlFor="passwordInput">
                                    Password (8 characters minimum)
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
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <button type="submit" onClick={this.handleSubmit}>Sign Up</button>
                        </div>
                    </div>
                </form>
            </div>

        );
    }

}

export default SignUp;