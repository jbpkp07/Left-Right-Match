import React from "react"
import "./ProfileCard.css"

function ProfileCard(props) {
    console.log(Array.isArray(props.parties))
    return (
        <div className="card candidate-card p-0">
            <div>
                <img className="card-img-top candidate-img" src={props.img} alt={props.name} />
            </div>
            <div className="card-body">
                <h1 className="card-title">{props.name}</h1>

            </div>
            <ul className="list-group list-group-flush ul-size">
                <li className="list-group-item">Political Parties:
                
                {/* <p className="p-size">{props.parties.map(party => {
                                                            return party + ", "
                                                        })}}</p> */}

                <p className="p-size">{props.parties}</p>
                </li>
                <li className="list-group-item">Themes:
                <p className="p-size">{props.themes}</p>
                </li>
                <li className="list-group-item">Best Qualities:
                <p className="p-size">{props.qualities}</p>
                    <a href={props.policies} className="ul-size">Policies</a>
                </li>
                <li className="list-group-item">Political Experience:
                <p className="p-size">{props.experiences}</p>
                </li>
            </ul>
            <div className="card-body">
                <a href={props.websites} className="card-link">Official Website</a>
                <a href={props.iSideLink} className="card-link">iSideWith Profile</a>
            </div>
        </div>
    );
}
export default ProfileCard;