import React, { Component } from "react"
import Nav from "../components/Nav/Nav"
import Jumbotron from "../components/Jumbotron/Jumbotron"
import { Col, Row, Container } from "../components/Grid/Grid"
import { QuizForm, QuizFormItem, RadioInput, FormBtn } from "../components/QuizForm/QuizForm"
import API from "../utils/API";
import "./pageStyles/Quiz.css"


class Quiz extends Component {

    constructor(props) {

        super(props);

        this.state = {
            questionsCount: 0,
            questionsQueue: [],
            questionsAsked: [],
            answers: {},
            bottom: "bottom",
            completed: false
        };
    }

    componentDidMount() {

        API.getQuestions()

            .then((response) => {

                const questionsCount = response.data.length;

                const firstQuestion = response.data.shift();

                this.setState({
                    questionsCount,
                    questionsQueue: response.data,
                    questionsAsked: [firstQuestion]
                });
            })
            .catch((err) => {

                console.log(err);
            });
    }

    componentDidUpdate() {

        this.bottom.scrollIntoView({ behavior: "smooth" });
    }

    renderQuestions = () => {

        let count = 0;

        return (

            this.state.questionsAsked.map(question => {
                count++;
                return (

                    <QuizFormItem key={question.key} question={`(${count} of ${this.state.questionsCount}) - ${question.question}`} >
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

    handleInputChange = (event) => {

        const { name, value } = event.target;

        const answers = this.state.answers;
        const questionsQueue = this.state.questionsQueue;
        const questionsAsked = this.state.questionsAsked;

        answers[name] = value;

        if (Object.keys(answers).length + 1 > this.state.questionsAsked.length && this.state.questionsQueue.length !== 0) {

            questionsAsked.push(questionsQueue.shift());

            this.setState({ answers, questionsQueue, questionsAsked });
        }
        else {

            this.setState({ answers });
        }
    }


    handleQuizSubmit = (event) => {

        event.preventDefault();

        this.setState({ completed: true }, () => {

            API.postUserAnswers(this.state.answers)

                .then(() => {

                    this.props.history.push("/candidatematches");
                })
                .catch(err => {

                    console.log("UserAnswers Not Saved!", err)
                })
        });
    }

    render() {

        return (

            <div>
                <Nav />
                <Jumbotron specs="quizHead">
                    <h1>Quiz</h1>
                    <h1>Which Political Candidate Are You Most Like?</h1>
                </Jumbotron>

                <h3 className="instructions">Answer as many questions as you want and then press Submit...</h3>

                <Container specs="qContainer">
                    <Row>
                        <Col size="col-md-12">

                            <div onSubmit={this.handleQuizSubmit}>

                                <QuizForm specs={"quizForm"} onSubmit={this.handleQuizSubmit}>

                                    {!this.state.completed ? this.renderQuestions() : "Calculating Your Candiate Matches Now..."}

                                    {!this.state.completed && <FormBtn>Submit</FormBtn>}

                                </QuizForm>
                            </div>

                        </Col>
                    </Row>
                </Container>
                <div ref={(elem) => { this.bottom = elem; }}></div>
            </div >
        );
    }
}

export default Quiz;