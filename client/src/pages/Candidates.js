// dependencies
import React, { Component } from "react"
import { Col, Row, Container } from "../components/Grid/Grid"
import { List, ListItem } from "../components/List/List"
import API from "../utils/API"
import banner from "../images/allCandidates.jpg"
import "./pageStyles/Candidates.css"

// can this be function instead of a class?
class Candidates extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            isProblem: false,
            name: "",
            image: "",
            id: "",
            allCandidates: {},
            profileData: {},
            selectedId: ""
        }
    }

    componentDidMount(){
        this.loadCandidates();
    }

    loadCandidates()  {

        // initializes compntnt by setting its state & calling a func that makes a call to the database
        this.setState({ loading: true, isProblem: false }, () => {

        // axios get passes this state which is an empty {}
        API.getAllCandidates()

            // it returns an array of json objects props & values from database
            // sets state.loading to false because promise was success & data receieved 
            .then(res => {
                this.setState({ allCandidates: res.data,  loading: false});                              
            })

            // error handling
            .catch(err => {
                console.log("Error at getAllCandidates ", err)
                this.setState({ loading: false, isProblem: true });
            })
        })
    }

    // function captures onClick prop name & value dynamically & setStates
    // if prop doesn't exist in state then it will create it in state 
    handleThisClick = event => {
        // console.log('handleClick hit')

        // Get the data-value of the clicked candidate
        // expected id: value equal to candidates id in database
        const target = event.target.attributes.getNamedItem('data-id').value;

        this.setState({ selectedId: target }, this.getCandidateById)
    }

    // axios call to get candidate by _id in database
    getCandidateById = () => {
        
        this.props.history.push(`/candidateprofile/${this.state.selectedId}`);
    }


    render() {

        return (
            <div>
                <Row fluid>
                    <Col size="mx-auto">
                        <div className="candidatesBanner">
                            <img className="banner-image" src={banner} alt={'2020-candidates'} />
                            <br />
                            <span>Candidates</span>
                        </div>
                    </Col>
                </Row>
                <Container>

                    <Row>
                        <Col size="col-md-12 hello">

                            {!this.state.allCandidates.length ? (
                                <h2> Uh-Oh Seems There's No Candidates to Display</h2>
                            ) : (

                            <div onClick={this.handleThisClick} >

                                <List>
                                    {this.state.allCandidates.map(candidate => {
                                        
                                        return (

                                            // 1 ListItem per candidate
                                            <ListItem
                                                key={candidate.name}
                                                id={candidate._id}
                                                // onChange={() => this.setState({ selectedId: candidate._id })
                                            >
                                                <ul className="list-unstyled" data-id={candidate._id}>

                                                    <img src={candidate.img} className="img-thumbnail float-left mr-4" width="225px" alt={candidate.name} data-id={candidate._id} />
                                                    {/* <img src={candidate.img} className="img-thumbnail float-left mr-4"  width="100px" alt={candidate.name} /> */}

                                                    <h2 data-id={candidate._id} className="font-weight-bold">
                                                        <li data-id={candidate._id}>{candidate.name}</li>
                                                    </h2>

                                                    <li data-id={candidate._id}>
                                                        <span data-id={candidate._id} className="font-weight-bold">Political Parties: </span>
                                                        {candidate.parties.join(", ")}
                                                    </li>

                                                    <li data-id={candidate._id}>
                                                        <span data-id={candidate._id} className="font-weight-bold">Best Qualities: </span>
                                                        {candidate.qualities.join(", ")}
                                                    </li>

                                                    <li data-id={candidate._id}>
                                                        <span data-id={candidate._id} className="font-weight-bold">Experience: </span>
                                                        {candidate.experiences.join(", ")}
                                                    </li>

                                                    <li data-id={candidate._id}>
                                                        <span data-id={candidate._id} className="font-weight-bold">Themes: </span>
                                                        {candidate.themes.join(", ")}
                                                    </li>
                                                </ul>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </div>
                               
                               )}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Candidates;