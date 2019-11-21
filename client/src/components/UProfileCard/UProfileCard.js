import React from "react"
import "./UProfileCard.css"

function ProfileCard(props) {
    // console.log(props)
    return (
        <div className="card candidate-card p-0 mx-auto">
            <div className="uCard">
                <div>
                    <img className="card-img-top candidate-img mt-4" src={props.img} alt={props.name} />
                </div>
                <div className="card-body">
                    <h1 className="card-title">{props.name}</h1>
                </div>
                <div className="card-body">
                    {/* <h1 className="card-title">Results</h1> */}
                    {/* <p>Elizabeth Warren: 45%</p>
                    <p>Bernie Sanders: 43%</p>
                    <p>Donald Trump 25%</p>
                    <p>Joe Biden 24%</p> */}
                </div>
            </div>
        </div>
    );
}
export default ProfileCard;