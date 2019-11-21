import React, { Component } from "react"
import { Col, Row, Container } from "../components/Grid/Grid"
import Nav from "../components/Nav/Nav"
import { Results, ResultsItems } from "../components/Results/Results"
import headImg from "../images/bidenCutout.png"
// import images from "../utils/images.json"
import candidatesJSON from "../utils/candidates.json"
import API from "../utils/API";
import "./pageStyles/CandidateMatches.css"

class CandidateMatches extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isProblem: false,
            candidatesJSON,
            matchData: {},
            key: "",
            name: "",
            completed: "false"
            // show: "false",

        }
    }
    componentDidMount() {
        // this.getCandidateMatch()
    }

    getCandidateMatch = () => {

        console.log('getCanMatch() hit ')
        this.setState({
            loading: true,
            isProblem: false,
            // userId: this.props.match.params.id
            userId: "5dd5da1966c3253ad445824d"
        },
            () => {
                API.getCandidateMatches(this.state.userId)

                .then(res => {
                    console.log('getCandMatch res.data', res.data)
                    this.setState({ loading: false, completed: true, matchData: res.data })
                }).catch(err => {
                    console.log("Err loading CandidateMatches ", err)
                    this.setState({ loading: false, completed: false, isProblem: true });
                })

            })
    }

    // fuction maps through results & renders each candidate & percentage of same answers question asked
    showResults = () => {

        // console.log('showResults hit')

        return (
            this.state.candidatesJSON.map(candidate => {
                // this.state.matchData.map(result => {
                return (
                    //Code for static json 
                    <ResultsItems
                        key={candidate.name}
                        name={candidate.name}
                        image={headImg}
                        percentage={"45%"}
                    />
                    // CODE for res.data from db
                    // <ResultsItems
                    //   key={result._id}
                    //   name={result.name}
                    //   image={result.headImg}
                    //   percentage={result.percentageMatch}
                    // />       

                );
            })
        )
    }


    render() {

        console.log('render() state========= ', this.state)

        return (
            <div>
                <Nav />
                <Container specs="uProfile">
                    <Row>
                        <Col size="col-12">

                            <div className="resultsStyles mx-auto">
                                {/* <img src={""} alt="examplepic" /> */}
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