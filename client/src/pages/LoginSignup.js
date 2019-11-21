// dependencies
import React, { Component } from "react"
import Nav from "../components/Nav/Nav"
import Jumbotron from "../components/Jumbotron/Jumbotron"
import { Col, Row, Container } from "../components/Grid/Grid"
import LoginForm from "../components/LoginForm/LoginForm"
import SignUpForm from "../components/SignUpForm/SignUpForm"
import "./pageStyles/LoginSignUp.css"
// import SignUpTab from "../components/SignUpTab/SignUpTab"
// import LoginTab from "../components/LoginTab/LoginTab"

const selected='nav-item navTabItems selected';
const notSelected='nav-item navTabItems not-selected'

class LoginSignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "login",
      selectedClass: selected,
      notSelectedClass: notSelected,
      isSelected: "true"
    }
  }

  handleChange = event => {
    const target = event.target.attributes.getNamedItem('data-value').value;
    // const target= event.target.value;
    console.log(target)
    // if(isSelected){
    //   this.setState({
    //     selectedTab: target, 
    //     selectedClass: selected , 
    //     notSelectedClass: notSelected
    //   })
    // }
      // else {
      // this.setState({ 
      //   selectedTab: target, 
      //   selectedClass: notSelected , 
      //   notSelectedClass: selected})
      // })}
    
   
  }


  render() {
    console.log('render() state======= ', this.state)

    return (
      <div>
        <Nav />
        <Jumbotron>
          <h1>Which Political Candidate Are You Most Like?</h1>
        </Jumbotron>
        <Container>
          <Col size="col mx-auto">
            <Row>
              <Col size="col mx-auto">

                <ul className="nav nav-justified" id="myTab" role="tablist" >

                  <li className={this.state.selectedClass} >
                   
                    {/* <h3 data-value={"login"} onClick={this.handleChange("login")} > */}
                    <h3 onClick={() => this.setState({ selectedTab: "login", selectedClass: selected , notSelectedClass: notSelected})}>

                      <span role="button">Login</span>
                    </h3>
                  </li>

                  <li className={this.state.notSelectedClass} >

                    {/* <h3 data-value={"signup"} onClick={this.handleChange("signup")} > */}
                    <h3 onClick={() => this.setState({ selectedTab: "signup", selectedClass: notSelected , notSelectedClass: selected})}>
                      <span role="button">SignUp</span>
                    </h3>
                  </li>
                </ul>
              </Col>
            </Row>

            {/* render Login & SignUp Forms here */}
            <Row>
              <Col size="col mx-auto LSForm">

                {/* Ternary: if seletedTab is equal to login, then call this compntnt; else call this compntnt */}
                {this.state.selectedTab === "login" ? <LoginForm /> : <SignUpForm />}

              </Col>
            </Row>
          </Col>
        </Container>
      </div>
    );
  }
}

export default LoginSignUp;
