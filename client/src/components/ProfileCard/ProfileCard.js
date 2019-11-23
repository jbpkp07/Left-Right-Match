import React from "react"
import "./ProfileCard.css"

function ProfileCard(props) {

    return (
        <div className="card candidate-card p-1">
            <div>
                <img className="card-img-top candidate-img" src={props.img} alt={props.name} />
            </div>
            <div className="card-body">
                <h1 className="card-title">{props.name}</h1>

            </div>
            <ul className="list-group list-group-flush ul-size">
                <li className="list-group-item">
                    <span className="font-weight-bold">Political Parties: </span>
                    <span>{props.parties.join(", ")}</span>
                </li>
                <li className="list-group-item">
                    <span className="font-weight-bold">Best Qualities: </span>
                    <span>{props.qualities.join(", ")}</span>
                </li>
                <li className="list-group-item">
                    <span className="font-weight-bold">Experience: </span>
                    <span>{props.experiences.join(", ")}</span>
                </li>
                <li className="list-group-item">
                    <span className="font-weight-bold">Themes: </span>
                    <span>{props.themes.join(", ")}</span>
                </li>
            </ul>
            <div className="card-body">
                <div className="candidateLinks">
                    <span className="font-weight-bold">iSideWith Links: &nbsp;&nbsp;</span>
                    <a href={props.iSideLink} target="_blank" rel="noopener noreferrer" className="card-link">Profile</a>
                    <a href={props.policyLink} target="_blank" rel="noopener noreferrer" className="card-link">Policies</a>
                </div>
                <div className="candidateLinks">
                    <span className="font-weight-bold">Official Website(s): &nbsp;&nbsp;</span>
                    {props.contactInfo.websites.map((site) => {

                        return (
                            <a href={site} target="_blank" rel="noopener noreferrer" key={site} className="card-link">{site}</a>
                        );
                    })}
                </div>
                <div className="candidateLinks">
                    <span className="font-weight-bold">Twitter Account(s): &nbsp;&nbsp;</span>
                    {props.contactInfo.twitterAccounts.map((site) => {

                        return (
                            <a href={site} target="_blank" rel="noopener noreferrer" key={site} className="card-link">{site}</a>
                        );
                    })}
                </div>
                <div className="candidateLinks">
                    <span className="font-weight-bold">Facebook Account(s): &nbsp;&nbsp;</span>
                    {props.contactInfo.facebookAccounts.map((site) => {

                        return (
                            <a href={site} target="_blank" rel="noopener noreferrer" key={site} className="card-link">{site}</a>
                        );
                    })}
                </div>
                <div className="candidateLinks">
                    <span className="font-weight-bold">Instagram Account(s): &nbsp;&nbsp;</span>
                    {props.contactInfo.instagramAccounts.map((site) => {

                        return (
                            <a href={site} target="_blank" rel="noopener noreferrer" key={site} className="card-link">{site}</a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
export default ProfileCard;