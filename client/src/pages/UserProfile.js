// dependencies
import React, { Component } from "react"
import { Col, Row, Container } from "../components/Grid/Grid"
import UProfileCard from "../components/UProfileCard/UProfileCard"
import Nav from "../components/Nav/Nav"
import { Results, ResultsItems } from "../components/Results/Results"
import images from "../utils/images.json"
import img1 from "../images/unknown.jpg"
// import API from "../utils/API";

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            name1: "[ Insert User's Name Here ]",
            images,
        }
    }
    componentDidMount = () => {
        this.setState({
            name: images[0].alt,
            src: images[0].src
        })
    }
 

    render() {
        console.log('state', this.state)
        return (
            <div>
                <Nav />
                <Container specs="uProfile">
                    <Row>
                        <Col size="col-md mx-auto">
                            {/* <img src={this.state.src} alt="profile" /> */}
                            <UProfileCard
                                name={this.state.name}
                                img={img1}
                            />
                            <Results />
                            <ResultsItems>
                                
                            </ResultsItems>
                        </Col>
                    </Row>

                   
                </Container >
            </div >
        );
    }
}

export default UserProfile;