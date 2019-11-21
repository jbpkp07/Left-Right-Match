import React from "react"
import { Col, Row } from "../components/Grid/Grid"
import "./SocialMedia.css"

function SocialMedia(props) {
    console.log(props)
    return (
        <div className="socialMedia">
            <Row>
                <Col size="col-4">
                    <a>
                        <img className="icons" src={} alt={} />Facebook
                    </a>
                </Col>
                <Col size="col-4">
                    <a>
                        <img className="icons" src={} alt={} />Instagram
                    </a>
                </Col>
                <Col size="col-4">
                    <a>
                        <img className="icons" src={} alt={} />Twitter
                    </a>
                </Col>
            </Row>
        </div>
    );
}
export default SocialMedia;