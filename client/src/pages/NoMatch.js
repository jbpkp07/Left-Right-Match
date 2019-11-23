import React from "react"
import { Col, Row, Container } from "../components/Grid/Grid"
import Jumbotron from "../components/Jumbotron/Jumbotron"

function NoMatch() {
  return (
    <div>
      <Container fluid>
        <Row>
          <Col size="col-md-12">
            <Jumbotron>
              <h1>404 Not Found</h1>
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
