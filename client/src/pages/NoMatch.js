import React from "react"
import { Col, Row, Container } from "../components/Grid/Grid"
import Jumbotron from "../components/Jumbotron/Jumbotron"
import Nav from "../components/Nav/Nav"

function NoMatch() {
  return (
    <div>
      <Nav />
      <Container fluid>
        <Row>
          <Col size="col-md-12">
            <Jumbotron>
              <h1>404 Page Not Found</h1>
              <h1>
                <span role="img" aria-label="Face With Rolling Eyes Emoji">
                🙄 
              </span>
              </h1>
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default NoMatch;
