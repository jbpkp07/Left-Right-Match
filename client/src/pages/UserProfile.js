// dependencies
import React, { Component } from "react"
import { Col, Row, Container } from "../components/Grid/Grid"
import UProfileCard from "../components/UProfileCard/UProfileCard"
import { Results, ResultsItems } from "../components/Results/Results"
import img1 from "../images/unknown.jpg"
import { QuizFormItem } from "../components/QuizForm/QuizForm"
import API from "../utils/API";
import "./pageStyles/UserProfile.css"

class UserProfile extends Component {

    constructor(props) {

        super(props);

        this.state = {
            userId: "",
            userData: {},
            isMounted: false
        }
    }

    componentDidMount() {

        const { id } = this.props.match.params;

        API.getUserProfile(id)
            .then((res) => {

                this.setState({ userId: id, userData: res.data, isMounted: true });
            })
            .catch(err => console.log(err));
    }

    showResults = () => {

        return (

            this.state.userData.matches.map(result => {

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

    renderQuestions = () => {

        let count = 0;

        return (

            this.state.userData.stances.map(question => {
                count++;
                return (

                    <div className="userQuestion" key={question.key}>
                        <QuizFormItem key={question.key} question={`(${count} of ${this.state.userData.stances.length}) - ${question.question}`} >
                            <div className="userStance">{question.stance}</div>
                        </QuizFormItem>
                    </div>
                );
            })
        )
    }

    render() {

        return (

            <div>
                <Container specs="uProfile">
                    <Row>
                        <Col size="col-12">

                            <UProfileCard
                                name={this.state.userData.name}
                                email={this.state.userData.email}
                                img={img1}
                            />

                            <div className="resultsStyles mx-auto">

                                <Results />

                                {this.state.isMounted && this.showResults()}
                            </div>

                            <div className="userQuestions">
                                {this.state.isMounted && this.renderQuestions()}
                            </div>
                        </Col>
                    </Row>
                </Container >
            </div >
        );
    }
}

export default UserProfile;