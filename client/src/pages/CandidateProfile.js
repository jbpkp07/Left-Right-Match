// dependencies
import React, { Component } from "react"
import { Col, Row, Container } from "../components/Grid/Grid"
import Nav from "../components/Nav/Nav"
import ProfileCard from "../components/ProfileCard/ProfileCard"
import "./pageStyles/CandidateProfile.css"
import API from "../utils/API"
// import SocialMedia from "../components/SocialMedia/SocialMedia"
// import API from "../utils/API"


class CandidateProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isMounted: false,
            candidate: {},
        }
    }

    // looks horribly ugly. Must be more effiecient way of setting their states
    componentDidMount() {

        const { id } = this.props.match.params;

        API.getCandidate(id)
            .then((res) => {
     
                this.setState({ isMounted: true, candidate: res.data })
            })
            .catch(err => console.log(err));
    }

    render() {

        if (this.state.isMounted) {

            return (
                <div>
                    <Nav />
                    <div className="banner">
                        <img className="banner-img" src={this.state.candidate.bannerImg} alt={this.state.candidate.name} />
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
        else {

            return ( 

                <div>
                    <Nav />
                </div>
            );
        }
    }
}

export default CandidateProfile;