// dependencies
import React, { Component } from "react"
import { Col, Row, Container } from "../components/Grid/Grid"
import Nav from "../components/Nav/Nav"
import ProfileCard from "../components/ProfileCard/ProfileCard"
import candidateJSON from "../utils/candidates.json"
// import Img from "../images/bernie_blue_profile1.jpg"
// import EWBanner from "../images/bernie-banner1.png"
import "./pageStyles/CandidateProfile.css"
import API from "../utils/API"
// import SocialMedia from "../components/SocialMedia/SocialMedia"
// import API from "../utils/API"


class CandidateProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            // allCandidates: [],
            candidate: {},
        }
    }

    // function gets all candidates from database & renders them to html page
    getCandidate = () => {
        // grab candidate _id from params & request their profile data from db
        // .get returs candidate profile data & renders CandidateProfile.js
        API.getCandidate(this.props.match.params.id)
            .then(res => this.setState({ profileData: res.data }))
            .catch(err => console.log(err));
    }

    // looks horribly ugly. Must be more effiecient way of setting their states
    componentDidMount() {
        this.setState({
            candidate: candidateJSON[1]
        })
    }

    render() {

        console.log('candidataData ', candidateJSON)
        console.log('render() state ', this.state.candidate)
        return (
            <div>
                <Nav />
                <div className="banner">
                    <img  className="banner-img" src={this.state.candidate.bannerImg} alt={this.state.candidate.name} />
                </div>

                <Container specs="hello">
                    <Row>
                        <Col size="col-md-auto mx-auto">
                            <ProfileCard
                                {...this.state.candidate}
                                
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default CandidateProfile;