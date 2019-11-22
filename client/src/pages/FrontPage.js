// dependencies
import React, { Component } from "react"
import { Col, Row, Container } from "../components/Grid/Grid"
import Image from "../components/Image/Image"
import logoImg from "../images/lrmLogo.png"
import Nav from "../components/Nav/Nav"

class FrontPage extends Component {

    handleThisClick = () => {
        this.props.history.push("/quiz")
    }

    render() {
        return (
            <div>
                <Nav />
                <Container fluid>
                    <Row fluid>
                        <Col size="mx-auto">
                            <div onClick={this.handleThisClick}>
                                <Image
                                    image={logoImg}
                                    name={logoImg.name}
                                >
                                    <h1>Which Political Candidate Are You Most Like?</h1>
                                </Image>
                            </div>
                        </Col>
                    </Row>
                </Container >
            </div>
        );
    }
}

export default FrontPage;