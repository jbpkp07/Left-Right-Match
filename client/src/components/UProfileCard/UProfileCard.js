import React from "react"
import "./UProfileCard.css"

function ProfileCard(props) {

    return (
        <div className="card candidate-card p-0 mx-auto">
            <div className="uCard">
                <div>
                    <img className="card-img-top candidate-img mt-4" src={props.img} alt={props.name} />
                </div>
                <div className="card-body">
                    <h1 className="card-title">Welcome back, {props.name}!</h1>
                </div>
                <div className="card-email">
                    Email: {props.email}
                </div>
            </div>
        </div>
    );
}
export default ProfileCard;