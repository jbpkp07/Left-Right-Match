import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import API from "./utils/API";
import NoMatch from "./pages/NoMatch";
import Quiz from "./pages/Quiz";
import FrontPage from "./pages/FrontPage";
import UserProfile from "./pages/UserProfile";
import Candidates from "./pages/Candidates";
import CandidateProfile from "./pages/CandidateProfile";
import LoginSignUp from "./pages/LoginSignup";
import Logout from "./pages/Logout";
import CandidateMatches from "./pages/CandidateMatches";

class App extends React.Component {

    state = {

        isLoggedIn: false,
        userId: "",
        isMounted: false
    };

    componentDidMount() {

        API.startSession()

            .then((sessionState) => {

                const newState = {

                    isLoggedIn: sessionState.data.isLoggedIn,
                    userId: sessionState.data.userId,
                    isMounted: true
                }

                this.setState(newState);
            })
            .catch((err) => {

                console.log(err);
            });
    }

    renderQuiz() {

        if (this.state.isMounted && this.state.isLoggedIn) {

            return (

                <Route exact={true} path="/quiz" render={() => <Quiz {...this.state} />} />
            );
        }
    }

    render() {

        return (

            <BrowserRouter>
                <Switch>
                    <Route exact={true} path="/" component={FrontPage} />
                    {/* {this.state.isMounted && this.state.isLoggedIn && <Route exact={true} path="/quiz" render={() => <Quiz {...this.state} />} />} */}
                    {this.renderQuiz()}
                    <Route exact={true} path="/candidatematches" component={CandidateMatches} />
                    <Route exact={true} path="/candidates" component={Candidates} />
                    <Route exact={true} path="/candidates/:id" component={CandidateProfile} />
                    <Route exact={true} path="/candidatesprofile" component={CandidateProfile} />
                    <Route exact={true} path="/login" component={LoginSignUp} />
                    <Route exact={true} path="/logout" component={Logout} />
                    <Route exact={true} path="/userprofile" component={UserProfile} />
                    <Route component={NoMatch} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;