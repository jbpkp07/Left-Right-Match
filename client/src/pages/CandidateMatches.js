import React, { Component } from "react"
import { Col, Row, Container } from "../components/Grid/Grid"
import { Results, ResultsItems } from "../components/Results/Results"
import API from "../utils/API";
import "./pageStyles/CandidateMatches.css"

class CandidateMatches extends Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: false,
            isProblem: false,
            matchData: [],
            key: "",
            name: "",
            completed: "false",
            isMounted: false
        }
    }

    componentDidMount() {

        API.startSession()

            .then((sessionState) => {

                const newState = {

                    matchData: sessionState.data.matches,
                    isMounted: true
                }

                this.setState(newState);
            })
            .catch((err) => {

                console.log(err);
            });
    }

    showResults = () => {

        return (
  
            this.state.matchData.map(result => {

                return (
       
                    <ResultsItems
                      key={result.name}
                      name={result.name}
                      image={result.headImg}
                      percentage={`${result.percentageMatch}%`}
                    />       
                );
            })
        );
    }


    render() {

        return (
            <div>
                <Container specs="uProfile">
                    <Row>
                        <Col size="col-12">

                            <div className="resultsStyles mx-auto">
                       
                                <Results />

                                {this.state.completed ? this.showResults() : "Error Loading Your Matches Now..."}
                            </div>

                        </Col>
                    </Row>
                </Container >
            </div >
        );

    }
}

export default CandidateMatches;