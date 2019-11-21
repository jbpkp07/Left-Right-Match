import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NoMatch from "./pages/NoMatch";
import Quiz from "./pages/Quiz";
import FrontPage from "./pages/FrontPage";
import UserProfile from "./pages/UserProfile";
import Candidates from "./pages/Candidates";
import CandidateProfile from "./pages/CandidateProfile";
import LoginSignUp from "./pages/LoginSignup";
import Logout from "./pages/Logout";
import CandidateMatches from "./pages/CandidateMatches";

// dependencies
// import axios from "axios"
// import Nav from "./components/Nav"


// Needs sessions for Login/Signup

export function App() {

    return (

        <BrowserRouter>
            <Switch>
                <Route exact={true} path="/" component={FrontPage} />
                <Route exact={true} path="/quiz" component={Quiz} />
                <Route exact={true} path="/candidatematches" component={CandidateMatches} />
                <Route exact={true} path="/candidates" component={Candidates} />
                <Route exact={true} path="/candidates/:id" component={CandidateProfile} />
                <Route exact={true} path="/candidatesprofile" component={CandidateProfile} />
                <Route exact={true} path="/login" component={LoginSignUp} />
                <Route exact={true} path="/logout" component={Logout} />
                <Route exact={true} path="/userprofile" component={UserProfile} />
                {/* <Route exact path="/userprofile/:id" component={UserProfile} /> */}
                <Route component={NoMatch} />
            </Switch>
        </BrowserRouter>
    );
}