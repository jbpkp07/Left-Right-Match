// dependencies
import React, { Component } from "react"
import Flip from 'react-reveal/Flip';
import { Col, Row, Container } from "../components/Grid/Grid"
import Image from "../components/Image/Image"
import logoImg from "../images/lrmLogo.png"

class FrontPage extends Component {

    constructor(props) {

        super(props);
        
        this.state = { show: true };
    }

    handleThisClick = () => {

        this.setState({ show: false }, () => {
           
            setTimeout(() => {
            
                this.props.history.push("/quiz");     

            }, 1000);
        });
    }

    render() {

        return (

            <div>
                <Container fluid>
                    <Row fluid>
                        <Col size="mx-auto">
                            <div onClick={this.handleThisClick}>
                                <Flip left when={this.state.show}>
                                    <Image image={logoImg} name={logoImg.name} >
                                        <h1>Which Political Candidate Are You Most Like?</h1>
                                    </Image>
                                </Flip>
                            </div>
                        </Col>
                    </Row>
                </Container >
            </div>
        );
    }
}

export default FrontPage;