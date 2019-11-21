import React from "react"
import "./Results.css"

export function Results(props) {
    return (
        <div className="rTitle">
            <div className="row">
                <div className="col-12">
                    <div className="text-center">Candidate Rankings</div>
                </div>
            </div>
        </div>
    );
}

export function ResultsItems(props) {
    return (
        <div className="resultsDiv">
            <div className="row rRow">
                <div className="col">
                    <img className="rImg" src={props.image} alt={props.name} />
                </div>
                <div className="col rItems">{props.name}</div>
                <div className="col rItems">{props.percentage}</div>
            </div>
        </div>

    );
}
