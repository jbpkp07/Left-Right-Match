// dependencies
import React from "react"
import "./Nav.css"
import image from "../../images/lrmLogoSmall.png"
// import { Redirect } from 'react-router-dom'

function Nav(props) {

    console.log(props);

    function handleLogout() {

        props.logout();
    }

    return (

        <nav className="navbar d-flex navbar-expand-md">
            <a className="navbar-brand mr-auto my-0" href="/">
                <img src={image} className="d-inline-block nav-img" alt="brand-logo" />
                <span className="ml-2 brand-font">Left Right Match</span>
            </a>
            <div className="navbar-nav p-2">
                <a className="navbar-item nav-link" href="/quiz">Quiz</a>
                <a className="navbar-item nav-link" href="/candidates">Candidates</a>
                {!props.isLoggedIn && <a className="navbar-item nav-link" href="/login">Login</a>}
                {props.isLoggedIn && <a className="navbar-item nav-link" href={`/userprofile/${props.userId}`}>Profile</a>}
                {props.isLoggedIn && <a className="navbar-item nav-link" href="/" onClick={handleLogout}>Logout</a>}                 
            </div>
        </nav>
    );
}
export default Nav;