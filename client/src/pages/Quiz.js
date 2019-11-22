// dependencies
import React, { Component } from "react"
import Nav from "../components/Nav/Nav"
import Jumbotron from "../components/Jumbotron/Jumbotron"
import { Col, Row, Container } from "../components/Grid/Grid"
import questions from "../utils/questions.json"
import { QuizForm, QuizFormItem, RadioInput, FormBtn } from "../components/QuizForm/QuizForm"
import API from "../utils/API";
import "./pageStyles/Quiz.css"
// import { Results, ResultsItems } from "../components/Results/Results"
// import allCandidates from "../utils/candidates.json"
// import headImg from "../images/joe-biden-cutout.png"

class Quiz extends Component {

  constructor(props) {
    super(props);

    console.log(props);


    this.state = {
      loading: false,
      isProblem: false,
      questions,
      userResults: [],
      answers: {},
      value: "",
      ////////////////////
      // keys for res.data
      isLoggedIn: props.isLoggedIn,
      userId: props.userId,
      questionsData: [],
      key: "",
      name: ""
      /////////////////
      // candidateMatches states dont delete until sure nothing else needs it after i moved it to its own page
      // allCandidates,
      // completed: false,
      // show: "false",
      // headImg,

    };
  }

  // uncomment this function when backend is ready to use

  loadQuestions() {
    //   this.setState({ loading: true, isProblem: false }, () => {
    API.getQuestions()
    //       .then(res => {
    //         this.setState({ questionsData: res.data, loading: false });
    //         console.log(this.state.questionsData)
    //       })
    //       .catch(err => {
    //         console.log(err)
    //         this.setState({ loading: false, isProblem: true });
    //       });
    //   });
  }

  // renders questions & stances
  renderQuestions = () => {
    return (
      this.state.questions.map(question => {
        return (
          <QuizFormItem
            key={question.key}
            question={question.question}
          >
            <RadioInput
              key={question.key}
              name={question.key}
              onChange={this.handleInputChange}
              value0={question.stances[0]}
              value1={question.stances[1]}
            />
          </QuizFormItem>
        );
      })
    )
  }

  // function when a radio input is clicked
  handleInputChange = event => {

    const { name, value } = event.target;
    // console.log('[name]: value = ', name, value)

    // answers[name] assigns this named property dynamically as the answers key/prop name & initializes its value from its html attribute equal to value 
    // will update & reflect its value if a different radio input is selected - elimantes redundancy
    // this.state.answers[name] = value;

    const updatedAnswers = this.state.answers;
    updatedAnswers[name] = value;

    this.setState({ answers: updatedAnswers });

  }

  // after db connected in .then add code to setState & render user's matches
  handleQuizSubmit = event => {
    event.preventDefault();
    console.log('handleSubmit hit')

    this.setState({ completed: true })

    // send this.state.answers to axios.post() to database
    API.postUserAnswers(this.state.answers)

      .then(res => {

        //save response from database to state.userAnswers
        console.log('userAnswers Saved!', res.data)
        this.setState({ userResults: res.data })

        //redirect to results
        this.props.history.push("/candidatematches")

      })
      .catch(err => {
        console.log("UserAnswers Not Saved!", err)
        //redirect to NoMatch page
        // this.props.history.push("/NoMatch")
      })
  }

  render() {

    console.log(this.state.userId);

    return (

      <div>
        <Nav />
        <Jumbotron specs="quizHead">
          <h1>Quiz</h1>
          <h1>Which Political Candidate Are You Most Like?</h1>
        </Jumbotron>

        <Container specs="qContainer">
          <Row>
            <Col size="col-md-12">

              <div onSubmit={this.handleQuizSubmit}>

                <QuizForm specs={"quizForm"} onSubmit={this.handleQuizSubmit}>

                  {!this.state.completed ? this.renderQuestions() : "Calculating Your Scores Now..."}

                  <FormBtn
                  >Submit</FormBtn>

                </QuizForm>
              </div>

            </Col>
          </Row>
        </Container>
      </div >
    );
  }
}

export default Quiz;